var chai = require('chai');
var ServerApp = require('../../server/serverApp');

var app;
describe('ServerApp', function() {
  beforeEach(function() {
    app = new ServerApp();
  });

  it('Builds', function() {
    chai.expect(app).to.not.be.null;
  });

  describe('Server and Port setup', function() {
    var previousEnv;

    beforeEach(function() {
      previousEnv = process.env;
    });

    afterEach(function() {
      process.env = previousEnv;
    });

    it('Defaults to localhost:8080', function() {
      process.env = {};

      app.setupVariables();

      chai.expect(app.ipaddress).to.equal('127.0.0.1');
      chai.expect(app.port).to.equal(8080);
    });

    it('Uses OPENSHIFT parameters if specified', function() {
      process.env = {
        OPENSHIFT_NODEJS_IP: '1.2.3.4',
        OPENSHIFT_NODEJS_PORT: 3030
      };

      app.setupVariables();

      chai.expect(app.ipaddress).to.equal('1.2.3.4');
      chai.expect(app.port).to.equal(3030);
    });

  });
});