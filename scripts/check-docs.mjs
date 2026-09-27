// Source checks for things the Docusaurus build can't catch.
// Run with: npm run check:docs

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['docs', 'src/pages'];

// Placeholders meant to be filled in before merge, e.g. <GROUP_CHAT_HASH>.
// Deliberate example values in commands (<YourRepeaterName>, <your_password>)
// are mixed or lower case and don't match.
const PLACEHOLDER = /<[A-Z0-9]+(?:_[A-Z0-9]+)+>/g;
const MARKER = /\b(?:TODO|FIXME|TBD)\b/g;
// Reticulum addresses: lxmf://<hash>, lxmf@<hash>, rrc://<hash>/room,
// rrc@<hash>... Every one must carry a full 16-byte (32 hex) destination hash.
const RETICULUM_LINK = /\b(lxmf|rrc(?:\.hub(?:\.session)?)?)(:\/\/|@)\/?([^\s/:)\]`"'<>]*)/g;
const HASH = /^[0-9a-f]{32}$/i;

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.mdx?$/.test(e.name)) yield p;
  }
}

const problems = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      const at = `${file}:${i + 1}`;
      for (const m of line.matchAll(PLACEHOLDER)) {
        problems.push(`${at}: unfilled placeholder ${m[0]}`);
      }
      for (const m of line.matchAll(MARKER)) {
        problems.push(`${at}: leftover ${m[0]} marker`);
      }
      for (const m of line.matchAll(RETICULUM_LINK)) {
        // A bare scheme with nothing after it ("opens `rrc://` links") is prose.
        if (m[3] && !HASH.test(m[3])) {
          problems.push(`${at}: ${m[1]}${m[2]} address "${m[3]}" is not a 32-character hex hash`);
        }
      }
    });
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}
console.log('check-docs: OK');
