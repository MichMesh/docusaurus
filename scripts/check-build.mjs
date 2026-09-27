// Checks on build output that the Docusaurus build doesn't make itself:
// every redirect page under static/ must point at a page that exists in
// the build. Run after `npm run build`.
//
//   npm run check:build [-- buildDir]

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  if (!problems.length) console.log(`check-build: OK (${count} redirect(s))`);
  return problems;
}

const [buildDir = 'build'] = process.argv.slice(2);
const problems = checkRedirects(buildDir);
if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}
