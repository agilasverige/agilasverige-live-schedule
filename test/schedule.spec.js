const schedule = require('../src/schedule');
const chai = require('chai');
const sinon = require('sinon');
const jsdom = require("jsdom");

var fs = require('fs');

chai.should();
const expect = chai.expect;


function triggerEvent(element, eventName) {  
  const event = document.createEvent("HTMLEvents");
  event.initEvent(eventName, false, true);
  element.dispatchEvent(event);
}

function click(selector, doc) {
  const event = document.createEvent("HTMLEvents");
  event.initEvent("click", false, true);
  (doc || document).querySelector(selector).dispatchEvent(event);
}

var html;
describe('index', function() {
    beforeEach(function(done) {
      // load actual html
      fs.readFile('public/index.html', function (err, data) {
        if (err) {
          throw err; 
        }
        html = data.toString();
        done();
      });

      this.xhr = sinon.useFakeXMLHttpRequest();

      this.requests = [];
      this.xhr.onCreate = function(xhr) {
        this.requests.push(xhr);
      }.bind(this);

      global.XMLHttpRequest = this.xhr;

      // Mock date
      var oldDate = Date;
      Date = function(fake) {
        return new oldDate('1980-03-08 08:20');
      };
      Date.now = function() { return new oldDate('1980-03-08 08:20').getTime();};
      Date.parse = oldDate.parse;
      this.oldDate = oldDate;
    });

    afterEach(function() {
      Date = this.oldDate;
      this.xhr.restore();
    });

    it('test1', function() {
      // mock window
      const dom = new jsdom.jsdom(html);
      global.window = dom;
      global.document = dom;

      schedule();

      // trigger load event
      triggerEvent(window, 'load');

      const program_data = [
        {start: "1980-03-08 08:00:00", stop: "1980-03-08 09:00:00", space: {title: 't1', speaker: 's1'}, tab: {title: 't2', speaker: 's2'}}];
      this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(program_data));

      const description_data = [
        {'title': 't1', 'description': 'description here1'}, {'title': 't2', 'description': 'description here2'}];
      this.requests[1].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(description_data));

      expect(document.querySelector("#space .title").innerHTML).to.equal('t1');
      expect(document.querySelector("#space .speaker").innerHTML).to.equal('s1');

      expect(document.querySelector("#tab .title").innerHTML).to.equal('t2');
      expect(document.querySelector("#tab .speaker").innerHTML).to.equal('s2');

      // TODO: One assert per test
      click('#space', document);
      expect(document.querySelector("#space .description").innerHTML).to.equal('description here1');
    });
});
