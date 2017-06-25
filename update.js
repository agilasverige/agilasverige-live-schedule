const fs = require('fs');
const agilaSverige = require('./agilaSverige');

function getStartDate() {
  if (process.argv.length < 3) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);
  }
  return new Date(process.argv[2]);
}


const startDay = getStartDate();
console.log("Generating json schedule starting on " + startDay.toDateString());
var input = fs.createReadStream('data/2017/program.csv');
var output = fs.createWriteStream('public/data/program.json');
agilaSverige.cvs2json(input, output, {startDay});

var input2 = fs.createReadStream('data/2017/beskrivningar.csv');
var output2 = fs.createWriteStream('public/data/descriptions.json');
agilaSverige.description2json(input2, output2);
