const schedule = require('../src/schedule');
const chai = require('chai');
const sinon = require('sinon');
const jsdom = require("jsdom");

chai.should();

describe('index', function() {
    beforeEach(function() {
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

        global.XMLHttpRequest = this.xhr;
    });

    afterEach(function() {
        this.xhr.restore();
    });

    it('test1', function() {
      // mock window
      const dom = new jsdom.jsdom(`<!DOCTYPE html><input type="range" id="now-slider"><span id="now-display"></span>`);
      global.window = dom;
      global.document = dom;

      schedule();
      const data = [{start: "123", stop: "456"}];
      this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(data));
  });
    
});
