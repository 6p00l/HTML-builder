const fs = require('fs');
const { stdin, stdout } = process;

fs.writeFile('./02-write-file/test.txt', '', function (err) {
  if (err) throw err;
});

stdout.write('Введите текст \n');
stdin.on('data', (data) => {
  const text = data.toString().trim();
  console.log(text);
  if (text == 'exit') {
    stdout.write('Досвидания _/');
    process.exit();
  }
  fs.appendFile('./02-write-file/test.txt', data, () => {});
});

process.on('SIGINT', () => {
  stdout.write('Досвидания _/');
  process.exit();
});
