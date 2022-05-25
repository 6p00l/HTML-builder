const path = require('path');
const destFolderPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');
const { promises: fs } = require('fs');

copyDir(folderPath, destFolderPath);

async function copyDir(source, dest) {
  await fs.rm(destFolderPath, { force: true, recursive: true }, () => {});
  await fs.mkdir(dest, { recursive: true });
  let files = await fs.readdir(source, { withFileTypes: true });

  for (let file of files) {
    let filePath = path.join(source, file.name);
    let destFilePath = path.join(dest, file.name);

    if (file.isFile()) {
      await fs.copyFile(filePath, destFilePath);
    } else await copyDir(filePath, destFilePath);
  }
}
