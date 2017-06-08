const MemoryStream = require('memorystream');
const assert = require('assert');
const agilaSverige = require('../agilaSverige');

var streamToString = function(stream, callback) {
  var str = '';
  stream.on('data', function(chunk) {
    str += chunk;
  });
  stream.on('end', function() {
    callback(str);
  });
}

describe('cvs2json', function() {
  it('test1', function(done) {
    // Override Date
    const originalDate = Date;
    Date = function() {
      return new originalDate(originalDate.parse("2017-06-06T12:34:56.000Z"));
    };
    Date.parse = originalDate.parse;

    const input = MemoryStream.createReadStream("Tid,Space,Talare,Tab,Talare\n08:00-09:00,a,b,c,d");
    const output = new MemoryStream();
    streamToString(output, function(str) {
      const actual = JSON.parse(str);
      const expected = [
        {
          "start": new originalDate("2017-06-06 08:00:00").toISOString(),
          "stop":  new originalDate("2017-06-06 09:00:00").toISOString(),
          "space": {"title": "a", "speaker": "b"},
          "tab":   {"title": "c", "speaker": "d"}
        }
      ];
      assert.deepEqual(actual, expected);
      done();
    });
    //output.on('data', console.log);
    agilaSverige.cvs2json(input, output);
  });
});
