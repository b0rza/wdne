var Browser = require('zombie');
var assert = require('chai').assert;
var browser;

suite('Cross-Page Tests', function() {

  setup(function() {
    browser = new Browser();
  });

  test('requesting a group rate quote from the hood river tour page should populate the referrer field', function(done) {
    var referrer = 'http:localhost:3000/tours/hood-river';
    browser.visit(referrer, function() {
      broser.clickLink('.requestGroupRate', function() {
        assert(browser.field('referrer').value === referrer);
        done();
      })
    })
  })
})
