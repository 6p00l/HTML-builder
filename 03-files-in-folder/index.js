const fs = require('fs');
const path = require('path');

const dest = path.join(__dirname, 'secret-folder');

fs.readdir(dest, { withFileTypes: true }, (err, files) => {
  if (err) return;
  for (let file of files) {
    if (file.isFile() === true) {
      let ext = path.extname(file.name).slice(1);
      let name = path.basename(file.name, path.extname(file.name));
      let fileSrc = path.join(dest, file.name);
      fs.stat(fileSrc, (err, stats) => {
        if (err) return;

        let size = stats.size * 0.001 + 'kb';
        console.log(name, '-', ext, '-', size);
      });
    }
  }
});
