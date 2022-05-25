const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(src, 'utf8');
readableStream.on('data', (data) => console.log(data));
