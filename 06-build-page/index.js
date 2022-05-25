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
    for (let test of templatesName) {
      fss.readFile(path.join(source, test), 'utf8', (err, data) => {
        fs.writeFile(dest, result, () => {});
        let name = `{{${path.basename(test, path.extname(test))}}}`;
        template = data.toString();
        result = result.replace(name, template);
        console.log(name);
        fs.writeFile(dest, result, () => {});
      });
    }
  });
}
