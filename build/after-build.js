const fs = require('fs');

const files = [
  'LICENSE',
  'README.md',
  'package.json'
];

files.forEach(f => {
  fs.copyFileSync(f, `dist/${f}`);
});
