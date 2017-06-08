const csv = require('csv');
const JSONStream = require('JSONStream');

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

// Parses cvs stream and converts to json usable by frontend
function cvs2json(input, output) {
  input
    .pipe(csv.parse())
    .pipe(csv.transform(toObject))
    .pipe(JSONStream.stringify())
    .pipe(output);
}

module.exports = { cvs2json };
