const csv = require('csv');
const JSONStream = require('JSONStream');

// Parses cvs stream and converts to json usable by frontend
function cvs2json(input, output, options) {
  options = options || {};
  // keep track of day as we parse csv
  const startDay = new Date((options.startDay || new Date()).getTime());
  var offset = null;

  function toObject(row) {
    function parseTime(s) {
      const parts = s.split(':');
      var result = new Date(startDay.getTime());
      result.setDate(startDay.getDate() + offset);
      result.setHours(parts[0], parts[1], 0, 0);
      return result
    }

    function parseDuration(s) {
      const parts = s.trim().split('-');
      if (parts.length < 2) return null;
      return {'start': parseTime(parts[0]), 'stop': parseTime(parts[1])};
    }

    if (row[0].trim() == "Tid") {
      offset = (offset === null) ? 0 : offset + 1;
    }
    if (offset === null) {
      // Skip everything before first "Tid"
      return null;
    }
    var obj = parseDuration(row[0]);
    if (!obj) return null;
    obj.space = {'title': row[1], 'speaker': row[2]};
    obj.tab =   {'title': row[3], 'speaker': row[4]};
    return obj;
  }

  input
    .pipe(csv.parse())
    .pipe(csv.transform(toObject))
    .pipe(JSONStream.stringify())
    .pipe(output);
}

function description2json(input, output) {
  function toObject(row) {
    return {title: row[3], description: row[4]};
  }
  input
    .pipe(csv.parse())
    .pipe(csv.transform(toObject))
    .pipe(JSONStream.stringify())
    .pipe(output);
}

module.exports = { cvs2json, description2json };
