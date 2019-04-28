const fs = require('fs');

// noinspection SpellCheckingInspection
const files = [
  'LICENSE',
  'README.md',
  'package.json',
  '.npmignore'
];

files.forEach(f => {
  fs.copyFileSync(f, `dist/${f}`);
});
