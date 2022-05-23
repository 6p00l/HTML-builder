const path = require('path');
const stylesFolderPath = './06-build-page/styles/';
const bundlePath = './06-build-page/project-dist/style.css';
const assetsFolderPath = './06-build-page/assets';
const assetsDestFolderPath = './06-build-page/project-dist/assets';
const componentsSource = './06-build-page/components/';
const htmlDest = './06-build-page/project-dist/index.html';
const templateSource = './06-build-page/template.html';
const { promises: fs } = require('fs');
const fss = require('fs');

(async function () {
  await fs.rm(
    './06-build-page/project-dist/',
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
            stylesFolderPath + file.name,
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
  let result;
  let template, name;
  let templates = [];
  let templatesName = [];

  fss.readFile(templateSource, 'utf8', (err, data) => {
    result = data.toString();
  });

  fss.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) return;

    for (let file of files) {
      if (file.isFile() === true) {
        if (path.extname(file.name) === '.html') {
          name = `{{${path.basename(file.name, path.extname(file.name))}}}`;
          templates.push(name);
          templatesName.push(file.name);
        }
      }
    }

    templatesName.map(async (templatesName) => {
      fss.readFile(source + templatesName, 'utf8', (err, data) => {
        let name = `{{${path.basename(
          templatesName,
          path.extname(templatesName)
        )}}}`;
        template = data.toString();
        result = result.replace(name, template);
        console.log(name);
        fs.writeFile(dest, result, () => {});
      });
    });
  });
}
