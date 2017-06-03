const express = require('express');
const app = express();

app.use(express.static('public'))

/*app.get('/', function (req, res) {
  res.send('Hello World!')
});*/

const fs = require('fs');
const csv = require('csv');

var input = fs.createReadStream('data/1.csv');
input
  .pipe(csv.parse())
  .pipe(csv.transform(function(record) {
     return record.map(function(value) {
       return value;
     });
  }))
  .pipe(csv.stringify())
  .pipe(process.stdout);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
