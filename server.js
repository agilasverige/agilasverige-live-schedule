const express = require('express');
const fs = require('fs');
const agilaSverige = require('./agilaSverige');

const app = express();

app.use(express.static('public'))

app.get('/api/schedule', function (req, res) {
  var input = fs.createReadStream('data/2017.csv');
  agilaSverige.cvs2json(input, res);
});

app.listen(3000, function () {
  console.log('Listening on port 3000. http://localhost:3000')
});
