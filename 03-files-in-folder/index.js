const fs = require('fs');
const path = require('path');
const filePath = './03-files-in-folder/secret-folder/';

fs.readdir(filePath, { withFileTypes: true }, (err, files) => {
  if (err) return;
  for (let file of files) {
    if (file.isFile() === true) {
      let ext = path.extname(file.name).slice(1);
      let name = path.basename(file.name, path.extname(file.name));
      fs.stat(filePath + file.name, (err, stats) => {
        if (err) return;

        let size = stats.size * 0.001 + 'kb';
        console.log(name, '-', ext, '-', size);
      });
    }
  }
});
