const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');
const dest = path.join(__dirname, 'test.txt');

fs.writeFile(dest, '', function (err) {
  if (err) throw err;
});

stdout.write('Введите текст \n');
stdin.on('data', (data) => {
  const text = data.toString().trim();
  if (text == 'exit') {
    stdout.write('Досвидания _/');
    process.exit();
  }
  fs.appendFile(dest, data, () => {});
});

process.on('SIGINT', () => {
  stdout.write('Досвидания _/');
  process.exit();
});
