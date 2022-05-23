const folderPath = './04-copy-directory/files';
const destFolderPath = './04-copy-directory/files-copy';

const { promises: fs } = require('fs');
const path = require('path');

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

copyDir(folderPath, destFolderPath);
