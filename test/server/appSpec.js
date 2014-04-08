var chai = require('chai');
var ServerApp = require('../../server/app');

var app;
describe('ServerApp', function() {
  beforeEach(function() {
    app = new ServerApp();
  });

  it('Builds', function() {
    chai.expect(app).to.not.be.null;
  });
});