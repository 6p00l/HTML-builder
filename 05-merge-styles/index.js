const fs = require('fs');
const path = require('path');
const folderPath = './05-merge-styles/styles/';
const bundlePath = './05-merge-styles/project-dist/bundle.css';

fs.rm(bundlePath, { force: true, recursive: true }, () => {});

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) return;
  for (let file of files) {
    if (file.isFile() === true) {
      let ext = path.extname(file.name);
      if (ext === '.css') {
        const readableStream = fs.createReadStream(
          folderPath + file.name,
          'utf8'
        );
        readableStream.on('data', (data) => {
          fs.appendFile(bundlePath, data, () => {});
        });
      }
    }
  }
});
