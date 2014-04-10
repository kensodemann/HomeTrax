var expect = require('chai').expect;
var sinon = require('sinon');

var ServerApp = require('../../server/serverApp');
var path = require('path');

var serverApp;
describe('ServerApp', function() {
  beforeEach(function() {
    serverApp = new ServerApp();
  });

  it('Builds', function() {
    expect(serverApp).to.not.be.null;
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

      expect(serverApp.ipaddress).to.equal('127.0.0.1');
      expect(serverApp.port).to.equal(8080);
    });

    it('Uses OPENSHIFT parameters if specified', function() {
      process.env = {
        OPENSHIFT_NODEJS_IP: '1.2.3.4',
        OPENSHIFT_NODEJS_PORT: 3030
      };

      serverApp.initialize();

      expect(serverApp.ipaddress).to.equal('1.2.3.4');
      expect(serverApp.port).to.equal(3030);
    });
  });

  describe('View Configuration', function() {
    var rootPath = path.normalize(__dirname + "/../../");

    it('Sets the view path correctly', function() {
      serverApp.initialize();
      expect(serverApp.app.get('views')).to.equal(rootPath + '/server/views');
    });

    it('Uses Jade as the view engine', function() {
      serverApp.initialize();
      expect(serverApp.app.get('view engine')).to.equal('jade');
    });
  });

  describe('Mongo Configuration', function() {
    var previousEnv;

    beforeEach(function() {
      previousEnv = process.env;
    });

    afterEach(function() {
      process.env = previousEnv;
    });

    it('Uses localhost and default port if not in process env', function() {
      serverApp.initialize();
      expect(serverApp.connectString).to.equal('127.0.0.1:27017/HomeApp');
    });
  });
});