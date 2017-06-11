const fs = require('fs');
const agilaSverige = require('./agilaSverige');

const startDay = new Date("2017-06-06");
var input = fs.createReadStream('data/2017/program.csv');
var output = fs.createWriteStream('public/data/program.json');
agilaSverige.cvs2json(input, output, {startDay});
