const schedule = require('../src/schedule');
const jsdom = require("jsdom");
const FakeXMLHttpRequest = require('fakexmlhttprequest');

describe('index', function() {
  it('test1', function() {
    // mock window
    const dom = new jsdom.jsdom(`<!DOCTYPE html><p>Hello world</p>`);
    global.window = dom;

    // Mock XMLHttpRequest 
    const xhr = FakeXMLHttpRequest;
    global.XMLHttpRequest = xhr;

    schedule();
  });
});
