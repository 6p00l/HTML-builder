const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.rm(bundlePath, { force: true, recursive: true }, () => {});

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) return;
  for (let file of files) {
    if (file.isFile() === true) {
      let ext = path.extname(file.name);
      if (ext === '.css') {
        const readableStream = fs.createReadStream(
          path.join(folderPath, file.name),
          'utf8'
        );
        readableStream.on('data', (data) => {
          fs.appendFile(bundlePath, data + '\n', () => {});
        });
      }
    }
  }
});
