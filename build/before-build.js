const fs = require('fs');

removeFolderRecursively('dist');

function removeFolderRecursively(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((n) => {
      const nestedPath = path + '/' + n;
      if (fs.lstatSync(nestedPath).isDirectory()) {
        removeFolderRecursively(nestedPath);
      } else {
        fs.unlinkSync(nestedPath);
      }
    });

    fs.rmdirSync(path);
  }
}
