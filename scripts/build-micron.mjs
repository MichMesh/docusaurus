// Builds the docs as NomadNet micron pages and packs them into
// <buildDir>/micron.tgz, so they ship with the website and a node can fetch
// them. Unpack the archive into a NomadNet node's storage/pages directory.
//
//   node scripts/build-micron.mjs [buildDir]
//
// Run after `npm run build`: page order, titles and URLs come from the data
// Docusaurus generates in .docusaurus/, so they always match the website.
//
// Micron has no written spec; the reference parser is the spec. The escaping
// and table rules below follow nomadnet/ui/textui/MicronParser.py and
// MarkdownToMicron in RNS/Utilities/rngit/util.py. Anything this script can't
// convert faithfully (a broken link, unknown HTML) stops the build, the same
// as onBrokenLinks does for the website.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix } from 'node:path';
import { gzipSync } from 'node:zlib';
import GithubSlugger from 'github-slugger';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const GENERATED = '.docusaurus';
if (!existsSync(GENERATED)) throw new Error(`${GENERATED}/ does not exist; run npm run build first`);
const { default: config } = await import(`../${GENERATED}/docusaurus.config.mjs`);

// Clients keep a page this long. The docs change rarely and a refetch over
// LoRa is expensive, so this is longer than NomadNet's 12-hour default.
const CACHE_SECONDS = 86400;
// Docs longer than this become one page per H2 section. About a minute of
// airtime on a typical LoRa link.
const SPLIT_BYTES = 10 * 1024;
// NomadNet truncates cells once a table passes 100 columns. Tables wider than
// this become labelled lists, so nothing is cut off and an 80-column terminal
// still fits them inside a section's indent.
const TABLE_MAX_COLUMNS = 76;

const LINK_COLOR = '79d';
const CODE_COLOR = 'da5';
const parser = unified().use(remarkParse).use(remarkGfm);

// --- Micron escaping --------------------------------------------------------

const esc = (s) => s.replace(/[\\`]/g, '\\$&');
// These start a heading, section reset, comment or divider at column 0.
const safeStart = (line) => (/^[<>#-]/.test(line) ? `\\${line}` : line);
// Cells are unescaped once when the row is split and again as micron.
const escCell = (s) => s.replace(/[\\|]/g, '\\$&');
const linkLabel = (s) => s.replace(/`/g, "'").replace(/\]/g, ')').replace(/\s+/g, ' ').trim();
// Upstream's _visible_width, which decides when a table gets truncated.
const visibleWidth = (s) =>
  [...s.replace(/`[FB][0-9a-fA-F]{3}/g, '').replace(/`[FB]T[0-9a-fA-F]{6}/g, '').replace(/`[!*_=]/g, '').replace(/`[fb]/g, '')].length;

function pageLink(label, target) {
  return `\`F${LINK_COLOR}\`_\`[${linkLabel(label)}\`${target}]\`_\`f`;
}

// --- Loading the docs -------------------------------------------------------

function loadSite() {
  const root = `${GENERATED}/docusaurus-plugin-content-docs/default`;
  // .docusaurus keeps files from earlier builds, so take the newest.
  const newest = readdirSync(`${root}/p`)
    .filter((f) => /^docs-.*\.json$/.test(f))
    .map((f) => `${root}/p/${f}`)
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
  if (!newest) throw new Error(`no docs version in ${root}/p`);
  const { version } = JSON.parse(readFileSync(newest, 'utf8'));

  const docs = [];
  for (const file of readdirSync(root).filter((f) => f.startsWith('site-docs-'))) {
    const meta = JSON.parse(readFileSync(join(root, file), 'utf8'));
    const source = meta.source.replace('@site/', '');
    // Leftovers from earlier builds include docs that have since been renamed.
    if (existsSync(source) && version.docs[meta.id]) docs.push({ ...meta, source });
  }
  const sidebars = Object.values(version.docsSidebars);
  if (sidebars.length !== 1) throw new Error(`expected one sidebar, found ${sidebars.length}`);
  return { docs, sidebar: sidebars[0] };
}

// Turns the Docusaurus-only syntax into something a plain Markdown parser
// keeps: admonitions become marker tags that htmlBlock() renders.
function preprocess(markdown) {
  let fenced = false;
  const out = [];
  for (const line of markdown.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const open = !fenced && line.match(/^(\s*):::(\w+)\s*(.*)$/);
    if (fenced) out.push(line);
    else if (/^\s*:::\s*$/.test(line)) out.push('');
    else if (open) {
      const title = encodeURIComponent(open[3].replace(/^\[(.*)\]$/, '$1'));
      out.push('', `${open[1]}<mm-admonition type="${open[2]}" title="${title}">`, '');
    } else if (!/^import\s.+\sfrom\s+['"].+['"];?\s*$/.test(line)) {
      out.push(line.replace(/<ImageRight\b[^>]*\balt="([^"]*)"[^>]*>/, '![$1](x)'));
    }
  }
  return out.join('\n');
}

function plain(node) {
  if ('value' in node) return node.value;
  return (node.children ?? []).map(plain).join('');
}

function* walk(node) {
  yield node;
  for (const child of node.children ?? []) yield* walk(child);
}

// Gives each heading the same anchor it has on the website.
function assignAnchors(tree) {
  const slugger = new GithubSlugger();
  for (const node of walk(tree)) {
    if (node.type !== 'heading') continue;
    const last = node.children.at(-1);
    const custom = last?.type === 'text' && last.value.match(/\s*\{#([^}]+)\}\s*$/);
    if (custom) last.value = last.value.slice(0, custom.index);
    node.anchor = custom ? custom[1] : slugger.slug(plain(node), true); // Docusaurus keeps case.
  }
}

function pagePathFor(permalink) {
  const clean = decodeURI(permalink).replace(/^\/docs\/?/, '').replace(/\/$/, '');
  return clean.toLowerCase().replace(/[^a-z0-9/]+/g, '-').replace(/^-|-$/g, '');
}

function webUrl(permalink) {
  return encodeURI(`${config.url}${permalink.replace(/\/?$/, '/')}`);
}

function buildSegments(doc) {
  const nodes = doc.tree.children;
  const firstH2 = nodes.findIndex((n) => n.type === 'heading' && n.depth === 2);
  if (Buffer.byteLength(doc.markdown) <= SPLIT_BYTES || firstH2 === -1) {
    return [{ doc, path: doc.path, title: doc.title, nodes, headingBase: 1, url: doc.url }];
  }
  const segments = [{ doc, path: doc.path, title: doc.title, nodes: nodes.slice(0, firstH2), headingBase: 1, url: doc.url }];
  const dir = doc.path.replace(/\.mu$/, '');
  for (let i = firstH2; i < nodes.length; ) {
    let end = i + 1;
    while (end < nodes.length && !(nodes[end].type === 'heading' && nodes[end].depth === 2)) end++;
    const slug = nodes[i].anchor.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    segments.push({
      doc,
      path: `${dir}/${slug}.mu`,
      title: plain(nodes[i]),
      nodes: nodes.slice(i, end),
      headingBase: 2,
      url: `${doc.url}#${nodes[i].anchor}`,
    });
    i = end;
  }
  return segments;
}

// --- Links ------------------------------------------------------------------

function renderLink(node, ctx) {
  const label = plain(node).trim();
  const target = resolveLink(node.url, ctx);
  if (target) return pageLink(label || node.url, target);
  // Web links can't be followed from a micron page; show the address.
  const text = esc(label);
  return label && label !== node.url ? `${text} (${esc(node.url)})` : esc(node.url);
}

function targetIn(doc, anchor, ctx) {
  if (!anchor) return `:/page/${doc.path}`;
  const segment = doc.anchors.get(anchor);
  if (!segment) throw new Error(`${ctx.segment.doc.source}: link to #${anchor} in ${doc.source}, which has no such heading`);
  if (segment === ctx.segment) return `#${anchor}`;
  if (segment.nodes[0]?.anchor === anchor) return `:/page/${segment.path}`;
  return `:/page/${segment.path}\`anchor=${anchor}`;
}

// A micron link target, or null for an address only a web browser can open.
function resolveLink(url, ctx) {
  if (url.startsWith('#')) return targetIn(ctx.segment.doc, url.slice(1), ctx);
  const lxmf = url.match(/^lxmf:\/\/([0-9a-f]{32})$/i);
  if (lxmf) return `lxmf@${lxmf[1]}`;
  if (url.startsWith('rrc://')) return url;

  const siteRelative = url.startsWith(`${config.url}/`) ? url.slice(config.url.length) : url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(siteRelative)) return null;

  const [path, anchor] = siteRelative.split('#');
  if (path === '/') return ':/page/index.mu';
  if (path.startsWith('/docs')) {
    const key = decodeURI(path).replace(/\/$/, '');
    const doc = ctx.byPermalink.get(key);
    if (!doc) throw new Error(`${ctx.segment.doc.source}: link to ${url}, which is not a doc`);
    return targetIn(doc, anchor, ctx);
  }
  if (path.startsWith('/')) return null;

  const source = posix.normalize(posix.join(dirname(ctx.segment.doc.source), decodeURI(path)));
  const doc = ctx.bySource.get(source);
  if (!doc) throw new Error(`${ctx.segment.doc.source}: link to ${url}, which is not a doc`);
  return targetIn(doc, anchor, ctx);
}

// --- Markdown to micron -----------------------------------------------------

function inline(nodes, ctx) {
  return nodes.map((node) => {
    switch (node.type) {
      case 'text': return esc(node.value.replace(/\s*\n\s*/g, ' '));
      case 'strong': return `\`!${inline(node.children, ctx)}\`!`;
      case 'emphasis': return `\`*${inline(node.children, ctx)}\`*`;
      case 'delete': return inline(node.children, ctx);
      case 'inlineCode': return `\`F${CODE_COLOR}${esc(node.value)}\`f`;
      case 'break': return '\n';
      case 'link': return renderLink(node, ctx);
      case 'image': return `\`*[Image: ${esc(node.alt || 'no description')}]\`*`;
      case 'html':
        if (node.value.startsWith('<!--')) return '';
        if (/^<br\s*\/?>$/i.test(node.value)) return '\n';
        return esc(node.value);
      default: throw new Error(`${ctx.segment.doc.source}: unsupported inline Markdown: ${node.type}`);
    }
  }).join('');
}

const lineAt = (text, indent) => (indent ? indent + text : safeStart(text));

function joinBlocks(nodes, ctx, indent) {
  const out = [];
  for (const node of nodes) {
    const lines = block(node, ctx, indent);
    if (!lines.length) continue;
    if (out.length) out.push('');
    out.push(...lines);
  }
  return out;
}

function listBlock(node, ctx, indent) {
  const inner = `${indent}   `;
  const out = [];
  node.children.forEach((item, i) => {
    const bullet = node.ordered ? `${(node.start ?? 1) + i}.` : '•';
    const box = item.checked === true ? '[x] ' : item.checked === false ? '[ ] ' : '';
    const lines = joinBlocks(item.children, ctx, inner);
    const first = lines.findIndex((l) => l.startsWith(inner));
    if (first === -1) throw new Error(`${ctx.segment.doc.source}: list item starts with a block micron can't indent`);
    lines[first] = `${indent} ${bullet} ${box}${lines[first].slice(inner.length)}`;
    if (node.spread && out.length) out.push('');
    out.push(...lines);
  });
  return out;
}

function tableBlock(node, ctx, indent) {
  const rows = node.children.map((row) => row.children.map((cell) => inline(cell.children, ctx).replace(/\n/g, ' ')));
  const columns = rows[0].length;
  const widths = Array.from({ length: columns }, (_, i) => Math.max(3, ...rows.map((r) => visibleWidth(r[i] ?? ''))));
  const total = widths.reduce((a, b) => a + b, 0) + columns * 3 + 1;

  if (total <= TABLE_MAX_COLUMNS) {
    const rule = (node.align ?? []).map((a) => ({ center: ':---:', right: '---:', left: ':---' })[a] ?? '---');
    const row = (cells) => `| ${cells.map(escCell).join(' | ')} |`;
    return ['`t', row(rows[0]), row(rule), ...rows.slice(1).map(row), '`t'];
  }

  const [header, ...data] = rows;
  const out = [];
  data.forEach((cells, r) => {
    if (r) out.push('');
    out.push(lineAt(`\`!${cells[0] || header[0]}\`!`, indent));
    cells.slice(1).forEach((cell, i) => {
      if (cell) out.push(`${indent}   ${header[i + 1] ? `${header[i + 1]}: ` : ''}${cell}`);
    });
  });
  return out;
}

function codeBlock(node, indent) {
  const lines = node.value.split('\n').map((l) => {
    const text = indent + l;
    return text === '`=' ? '\\`=' : text;
  });
  return [`\`F${CODE_COLOR}`, '`=', ...lines, '`=', '`f'];
}

function htmlBlock(node, ctx, indent) {
  let html = node.value.replace(/<!--[\s\S]*?-->/g, '').trim();
  const out = [];

  html = html.replace(/<summary>([\s\S]*?)<\/summary>/gi, (_, markdown) => {
    const paragraph = parser.parse(markdown.trim()).children[0];
    out.push(lineAt(`\`!${inline(paragraph.children, ctx)}\`!`, indent));
    return '';
  });
  // Layout wrappers; what they contain is converted on its own.
  html = html.replace(/<\/?(?:details|div)\b[^>]*>/gi, '');

  html = html.replace(/<mm-admonition type="(\w+)" title="([^"]*)">/, (_, type, title) => {
    const name = type[0].toUpperCase() + type.slice(1);
    const heading = decodeURIComponent(title) ? `${name}: ${decodeURIComponent(title)}` : name;
    out.push(lineAt(`\`!\`F${CODE_COLOR}${esc(heading)}\`f\`!`, indent));
    return '';
  });

  html = html.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, (tag) => {
    const title = tag.match(/\btitle="([^"]*)"/)?.[1] ?? 'Embedded content';
    const src = tag.match(/\bsrc="([^"]*)"/)?.[1] ?? '';
    out.push(lineAt(`\`*[${esc(title)}]\`* ${esc(src)}`, indent));
    return '';
  });

  if (html.trim()) throw new Error(`${ctx.segment.doc.source}: HTML this script can't convert: ${html.slice(0, 80)}`);
  return out;
}

function headingBlock(node, ctx) {
  // Page sections nest under the page's title. Micron indents each level.
  const depth = Math.max(1, node.depth - ctx.segment.headingBase + 1);
  const text = esc(plain(node).replace(/`/g, "'").replace(/^>+/, '').trim());
  return [`\`:${node.anchor}`, `${'>'.repeat(depth)}${text}`];
}

function block(node, ctx, indent) {
  switch (node.type) {
    case 'heading': return headingBlock(node, ctx);
    case 'paragraph': return inline(node.children, ctx).split('\n').filter((l) => l.trim()).map((l) => lineAt(l.trim(), indent));
    case 'list': return listBlock(node, ctx, indent);
    case 'table': return tableBlock(node, ctx, indent);
    case 'code': return codeBlock(node, indent);
    case 'blockquote': return joinBlocks(node.children, ctx, `${indent}  │ `);
    case 'thematicBreak': return ['-'];
    case 'html': return htmlBlock(node, ctx, indent);
    default: throw new Error(`${ctx.segment.doc.source}: unsupported Markdown: ${node.type}`);
  }
}

// --- Pages ------------------------------------------------------------------

function flatten(items, parent, visit) {
  for (const item of items) {
    if (item.type === 'link') visit(item, parent);
    else if (item.type === 'category') {
      visit(item, parent);
      flatten(item.items, item, visit);
    }
  }
}

function buildPages({ docs, sidebar }) {
  for (const doc of docs) {
    doc.markdown = preprocess(readFileSync(doc.source, 'utf8'));
    doc.tree = parser.parse(doc.markdown);
    assignAnchors(doc.tree);
    doc.url = webUrl(doc.permalink);
    const path = pagePathFor(doc.permalink);
    doc.path = `${path && /\/$/.test(decodeURI(doc.permalink)) ? `${path}/index` : path || 'home'}.mu`;
    doc.segments = buildSegments(doc);
    doc.anchors = new Map();
    for (const segment of doc.segments) {
      for (const node of segment.nodes) {
        for (const n of walk(node)) if (n.type === 'heading') doc.anchors.set(n.anchor, segment);
      }
    }
  }

  const byPermalink = new Map(docs.map((d) => [decodeURI(d.permalink).replace(/\/$/, ''), d]));
  const bySource = new Map(docs.map((d) => [d.source, d]));
  const docForItem = (item) => (item.href ? byPermalink.get(decodeURI(item.href).replace(/\/$/, '')) : undefined);

  // Reading order, and each doc's place in the sidebar.
  const ordered = [];
  flatten(sidebar, null, (item, parent) => {
    const doc = docForItem(item);
    if (!doc) throw new Error(`sidebar item "${item.label}" has no doc page; add an index.md for it`);
    doc.label = item.label;
    doc.parent = parent ? docForItem(parent) : null;
    doc.children = item.type === 'category' ? item.items.map(docForItem) : [];
    ordered.push(doc);
  });
  const missing = docs.filter((d) => !ordered.includes(d));
  if (missing.length) throw new Error(`not in the sidebar: ${missing.map((d) => d.source).join(', ')}`);

  const home = 'index.mu';
  const sequence = ordered.flatMap((d) => d.segments);
  const pages = new Map();

  sequence.forEach((segment, i) => {
    const { doc } = segment;
    const ctx = { segment, byPermalink, bySource };
    const body = [];

    const crumbs = [pageLink(config.title, `:/page/${home}`)];
    for (const a of ancestors(doc)) crumbs.push(pageLink(a.label, `:/page/${a.path}`));
    if (segment.path !== doc.path) crumbs.push(pageLink(doc.label, `:/page/${doc.path}`));
    body.push(crumbs.join(' / '), '');

    const startsWithTitle = segment.nodes[0]?.type === 'heading' && segment.nodes[0].depth === segment.headingBase;
    if (!startsWithTitle) body.push(`>${esc(segment.title)}`, '');
    body.push(...joinBlocks(segment.nodes, ctx, ''));

    const children = [
      ...(segment.path === doc.path ? doc.segments.slice(1).map((s) => [s.title, s.path]) : []),
      ...(segment.path === doc.path ? doc.children.map((c) => [c.label, c.path]) : []),
    ];
    if (children.length) {
      body.push('', '<', '`!In this section`!', '');
      for (const [title, path] of children) body.push(` • ${pageLink(title, `:/page/${path}`)}`);
    }

    body.push('', '<', '-');
    const previous = sequence[i - 1];
    const next = sequence[i + 1];
    if (previous) body.push(`Previous: ${pageLink(previous.title, `:/page/${previous.path}`)}`);
    if (next) body.push(`Next: ${pageLink(next.title, `:/page/${next.path}`)}`);
    body.push(`On the web: ${esc(segment.url)}`);

    addPage(pages, segment.path, body);
  });

  const index = [`>${esc(config.title)}`, '', esc(config.tagline), ''];
  for (const doc of ordered.filter((d) => !d.parent)) {
    index.push(` ${pageLink(doc.label, `:/page/${doc.path}`)}`);
    for (const child of doc.children) index.push(`    ${pageLink(child.label, `:/page/${child.path}`)}`);
  }
  index.push('', '<', '-', `On the web: ${esc(config.url)}/`);
  addPage(pages, home, index);
  return pages;
}

function ancestors(doc) {
  const chain = [];
  for (let d = doc.parent; d; d = d.parent) chain.unshift(d);
  return chain;
}

function addPage(pages, path, body) {
  if (pages.has(path)) throw new Error(`two pages would be written to ${path}`);
  pages.set(path, `#!c=${CACHE_SECONDS}\n${body.join('\n')}\n`);
}

// --- Packing ----------------------------------------------------------------

// The same docs always pack to the same bytes, so build/ only changes in git
// when a page does. No file is executable: NomadNet runs executable pages as
// programs. Files only, no directory entries, so unpacking doesn't change the
// permissions of the directory it unpacks into.
function pack(pages, outFile) {
  const stage = mkdtempSync(join(tmpdir(), 'micron-'));
  try {
    for (const [path, text] of pages) {
      mkdirSync(dirname(join(stage, path)), { recursive: true });
      writeFileSync(join(stage, path), text, { mode: 0o644 });
    }
    const tar = execFileSync(
      'tar',
      ['--create', '--mtime=@0', '--owner=0', '--group=0', '--numeric-owner', '--mode=a=r,u+w', '-C', stage, ...[...pages.keys()].sort()],
      { maxBuffer: 64 << 20 },
    );
    writeFileSync(outFile, gzipSync(tar, { level: 9 }));
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}

const [buildDir = 'build'] = process.argv.slice(2);
if (!existsSync(buildDir)) throw new Error(`${buildDir}/ does not exist; run npm run build first`);
const pages = buildPages(loadSite());
const outFile = join(buildDir, 'micron.tgz');
pack(pages, outFile);
console.log(`build-micron: wrote ${pages.size} pages to ${outFile} (${readFileSync(outFile).length} bytes)`);
