const crypto=require('crypto'); 
const fs=require('fs');
 /*Firsova Margarita*/;
console.log(crypto.publicDecrypt(fs.readFileSync('./key'),fs.readFileSync('./secret')).toString());