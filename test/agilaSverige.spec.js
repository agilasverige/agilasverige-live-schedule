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
    const input = MemoryStream.createReadStream("Tid,Space,Talare,Tab,Talare\n08:00-09:00,a,b,c,d");
    const output = new MemoryStream();
    streamToString(output, function(str) {
      const actual = JSON.parse(str);
      const expected = [
        {
          "start": new Date("2017-06-06 08:00:00").toISOString(),
          "stop":  new Date("2017-06-06 09:00:00").toISOString(),
          "space": {"title": "a", "speaker": "b"},
          "tab":   {"title": "c", "speaker": "d"}
        }
      ];
      assert.deepEqual(expected, actual);
      done();
    });
    agilaSverige.cvs2json(input, output, {startDay: new Date("2017-06-06")});
  });
  
  it('two days', function(done) {
    const input = MemoryStream.createReadStream([
      "skräp,,,,",
      "Tid,Space,Talare,Tab,Talare",
      "08:00-09:00,a,b,c,d",
      "Tid,Space,Talare,Tab,Talare",
      "08:00-09:00,e,f,g,h"].join('\n'));
    const output = new MemoryStream();
    streamToString(output, function(str) {
      const actual = JSON.parse(str);
      const expected = [
        {
          "start": new Date("2017-06-06 08:00:00").toISOString(),
          "stop":  new Date("2017-06-06 09:00:00").toISOString(),
          "space": {"title": "a", "speaker": "b"},
          "tab":   {"title": "c", "speaker": "d"}
        },
          {
          "start": new Date("2017-06-07 08:00:00").toISOString(),
          "stop":  new Date("2017-06-07 09:00:00").toISOString(),
          "space": {"title": "e", "speaker": "f"},
          "tab":   {"title": "g", "speaker": "h"}
        }

      ];
      assert.deepEqual(expected, actual);
      done();
    });
    //output.on('data', console.log);
    agilaSverige.cvs2json(input, output, {startDay: new Date("2017-06-06")});
  });
});
