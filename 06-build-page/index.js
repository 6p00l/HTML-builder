const path = require('path');
const { promises: fs } = require('fs');
const fss = require('fs');
const stylesFolderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
const assetsFolderPath = path.join(__dirname, 'assets');
const assetsDestFolderPath = path.join(__dirname, 'project-dist', 'assets');
const componentsSource = path.join(__dirname, 'components');
const htmlDest = path.join(__dirname, 'project-dist', 'index.html');
const templateSource = path.join(__dirname, 'template.html');

(async function () {
  await fs.rm(
    path.join(__dirname, 'project-dist'),
    { force: true, recursive: true },
    () => {}
  );
  await copyDir(assetsFolderPath, assetsDestFolderPath);
  await templates(componentsSource, htmlDest);

  copyCss();
})();

async function copyDir(source, dest) {
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

function copyCss() {
  fss.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) return;
    for (let file of files) {
      if (file.isFile() === true) {
        let ext = path.extname(file.name);
        if (ext === '.css') {
          const readableStream = fss.createReadStream(
            path.join(stylesFolderPath, file.name),
            'utf8'
          );
          readableStream.on('data', (data) => {
            fss.appendFile(bundlePath, data, () => {});
          });
        }
      }
    }
  });
}

async function templates(source, dest) {
  let result = await fs.readFile(templateSource, 'utf8');

  let templatesName = await fs.readdir(source, { withFileTypes: true });

  for (let file of templatesName) {
    file = file.name;
    let name = `{{${path.basename(file, path.extname(file))}}}`;
    let templateFile = await fs.readFile(path.join(source, file), 'utf8');
    result = result.replace(name, templateFile);
  }
  fs.writeFile(dest, result);
}
