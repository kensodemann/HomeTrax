var expect = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('database config', function() {
  var mongojsStub;
  var expectedCollections = ['message', 'users'];
  beforeEach(function() {
    mongojsStub = sinon.stub();
  });

  afterEach(function() {
    // Just enough to keep us using the test database in our tests.
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD = '';
    process.env.NODE_ENV = '';
  });

  it('connects to the test database by default', function() {
    proxyquire('../../../server/config/database', {
      'mongojs': mongojsStub
    });
    expect(mongojsStub.calledWith('127.0.0.1:27017/HomeAppTest', expectedCollections)).to.be.true;
  });

  it('connects to the development database if this is development', function() {
    process.env.NODE_ENV = 'development';
    proxyquire('../../../server/config/database', {
      'mongojs': mongojsStub
    });
    expect(mongojsStub.calledWith('127.0.0.1:27017/HomeApp', expectedCollections)).to.be.true;
  });

  it('connects to the openshift database if the openshift password is given', function() {
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD = 'fred';
    proxyquire('../../../server/config/database', {
      'mongojs': mongojsStub
    });
    expect(mongojsStub.calledWith(openShiftConnectString(), expectedCollections)).to.be.true;
  });

  it('formats the openshift connect string properly', function() {
    process.env.OPENSHIFT_MONGODB_DB_USERNAME = 'wilma';
    process.env.OPENSHIFT_MONGODB_DB_HOST = 'barney';
    process.env.OPENSHIFT_MONGODB_DB_PORT = 9132;
    process.env.OPENSHIFT_APP_NAME = 'betty'
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD = 'fred';
    proxyquire('../../../server/config/database', {
      'mongojs': mongojsStub
    });
    expect(mongojsStub.calledWith(openShiftConnectString(), expectedCollections)).to.be.true;
  });

  function openShiftConnectString() {
    return process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
  }
})