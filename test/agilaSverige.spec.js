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
      console.log(str);
      const actual = JSON.parse(str);
      const expected = [
        {"start":"2017-06-08T06:00:00.000Z","stop":"2017-06-08T07:00:00.000Z","space":{"title":"a","speaker":"b"},"tab":{"title":"c","speaker":"d"}}
      ];
      assert.deepEqual(actual, expected);
      done();
    });
    //output.on('data', console.log);
    agilaSverige.cvs2json(input, output);
  });
});
