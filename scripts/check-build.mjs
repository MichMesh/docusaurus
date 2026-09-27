// Checks on build output that the Docusaurus build doesn't make itself.
//
//   node scripts/check-build.mjs committed
//     The live site is served from the build/ directory committed to git.
//     Every asset a committed page references must be committed too, or the
//     page loads without its scripts, styles or images. Reads from git, not
//     the working tree, so it can run before a fresh build overwrites build/.
//
//   node scripts/check-build.mjs redirects [buildDir]
//     Every redirect page under static/ must point at a page that exists in
//     the build. Run after `npm run build`.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 << 20 });

function checkCommitted() {
  const tracked = new Set(git('ls-files', 'build').split('\n').filter(Boolean));
  if (!tracked.size) {
    console.log('check-build committed: build/ is not tracked in git; nothing to check.');
    return [];
  }
  const problems = [];
  for (const file of [...tracked].filter((f) => f.endsWith('.html'))) {
    const html = git('show', `HEAD:${file}`);
    for (const [, ref] of html.matchAll(/(?:src|href)="(\/[^"/][^"]*)"/g)) {
      const path = ref.split(/[?#]/)[0];
      // Only files (a dot in the last segment); page links are the build's job.
      if (!/\.[^/]+$/.test(path)) continue;
      if (!tracked.has(`build${decodeURI(path)}`)) {
        problems.push(`${file}: references ${path}, which is not committed`);
      }
    }
  }
  const unique = [...new Set(problems)];
  if (!unique.length) console.log(`check-build committed: OK (${tracked.size} files)`);
  return unique;
}

function* staticHtml(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* staticHtml(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

function checkRedirects(buildDir) {
  if (!existsSync(buildDir)) return [`${buildDir}/ does not exist; run npm run build first`];
  if (!existsSync('static')) return [];
  const problems = [];
  let count = 0;
  for (const file of staticHtml('static')) {
    const m = readFileSync(file, 'utf8').match(/http-equiv="refresh"[^>]*url=([^"]+)"/i);
    if (!m) continue;
    count++;
    const target = m[1].trim();
    if (!target.startsWith('/')) {
      problems.push(`${file}: redirect target "${target}" is not a site path`);
      continue;
    }
    const path = decodeURI(target.split(/[?#]/)[0]).replace(/\/$/, '');
    const candidates = [join(buildDir, path, 'index.html'), join(buildDir, `${path}.html`), join(buildDir, path)];
    if (!candidates.some((c) => existsSync(c) && !c.endsWith(buildDir))) {
      problems.push(`${file}: redirects to ${target}, which is not in the build`);
    }
  }
  if (!problems.length) console.log(`check-build redirects: OK (${count} redirect(s))`);
  return problems;
}

const [mode, buildDir = 'build'] = process.argv.slice(2);
let problems;
if (mode === 'committed') problems = checkCommitted();
else if (mode === 'redirects') problems = checkRedirects(buildDir);
else {
  console.error('usage: check-build.mjs committed | redirects [buildDir]');
  process.exit(2);
}
if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}
