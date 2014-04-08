var chai = require('chai');
var ServerApp = require('../../server/serverApp');

var serverApp;
describe('ServerApp', function() {
  beforeEach(function() {
    serverApp = new ServerApp();
  });

  it('Builds', function() {
    chai.expect(serverApp).to.not.be.null;
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

      serverApp.initialize();

      chai.expect(serverApp.ipaddress).to.equal('127.0.0.1');
      chai.expect(serverApp.port).to.equal(8080);
    });

    it('Uses OPENSHIFT parameters if specified', function() {
      process.env = {
        OPENSHIFT_NODEJS_IP: '1.2.3.4',
        OPENSHIFT_NODEJS_PORT: 3030
      };

      serverApp.initialize();

      chai.expect(serverApp.ipaddress).to.equal('1.2.3.4');
      chai.expect(serverApp.port).to.equal(3030);
    });

  });
});