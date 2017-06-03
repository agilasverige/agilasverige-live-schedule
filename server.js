const express = require('express');
const app = express();

app.use(express.static('public'))


app.get('/api/schedule', function (req, res) {
  function toObject(row) {
    function parseTime(s) {
      const parts = s.split(':');
      const now = new Date();
      now.setHours(parts[0], parts[1], 0, 0);
      return now;
    }

    function parseDuration(s) {
      const parts = s.trim().split('-');
      if (parts.length < 2) return null;
      return {'start': parseTime(parts[0]), 'stop': parseTime(parts[1])};
    }
    var obj = parseDuration(row[0]);
    if (!obj) return null;
    obj.space = {'title': row[1], 'speaker': row[2]};
    obj.tab =   {'title': row[3], 'speaker': row[4]};
    return obj;
  }
  const fs = require('fs');
  const csv = require('csv');
  const JSONStream = require('JSONStream');

  var input = fs.createReadStream('data/2017.csv');
  input
    .pipe(csv.parse())
    .pipe(csv.transform(function(record) {
      //console.log(record);
      //return record.map(function(value) {
      //  return value;
      //});
      return toObject(record);
    }))
    .pipe(JSONStream.stringify())
    //.pipe(csv.stringify())
    //.pipe(process.stdout);)
    .pipe(res);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
