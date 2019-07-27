const fs = require('fs');

// noinspection SpellCheckingInspection
const files = [
    'LICENSE',
    'README.md',
    'package.json'
];

files.forEach(f => {
    fs.copyFileSync(f, `dist/src/${f}`);
});
