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
    const original = Date;
    Date = function() {
      return new original(original.parse("2017-06-06T12:34:56.000Z"));
    };
    Date.parse = original.parse;

    const input = MemoryStream.createReadStream("Tid,Space,Talare,Tab,Talare\n08:00-09:00,a,b,c,d");
    const output = new MemoryStream();
    streamToString(output, function(str) {
      console.log(str);
      const actual = JSON.parse(str);
      const expected = [
        {"start":"2017-06-06T06:00:00.000Z","stop":"2017-06-06T07:00:00.000Z","space":{"title":"a","speaker":"b"},"tab":{"title":"c","speaker":"d"}}
      ];
      assert.deepEqual(actual, expected);
      done();
    });
    //output.on('data', console.log);
    agilaSverige.cvs2json(input, output);
  });
});
