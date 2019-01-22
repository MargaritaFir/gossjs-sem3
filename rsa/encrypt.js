const crypto = require('crypto');
const fs = require('fs');

const encrypted = crypto.publicEncrypt(fs.readFileSync("./key"), fs.readFileSync("./decrypt.js"));

fs.writeFile('./result.txt', encrypted, () => {});