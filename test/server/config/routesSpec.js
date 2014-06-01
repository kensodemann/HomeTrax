var expect = require('chai').expect;
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('supertest');
var proxyquire = require('proxyquire');

describe('Basic Routes', function() {
  var app;

  beforeEach(function() {
    app = express();
    var fakeViewPath = path.normalize(__dirname + '/../mockViews/server/views');
    app.set('view engine', 'jade');
    app.set('views', fakeViewPath);
    app.use(bodyParser());
  });

  describe('default path', function() {
    beforeEach(function() {
      require('../../../server/config/routes')(app);
    });

    it('Goes to the inedex view for the root route', function(done) {
      request(app)
        .get('/')
        .expect('<index></index>')
        .expect(200, done);
    });

    it('Goes to the inedex view for unkown routes', function(done) {
      request(app)
        .get('/i_dont_exist')
        .expect('<index></index>')
        .expect(200, done);
    });
  });

  describe('partials', function() {
    beforeEach(function() {
      require('../../../server/config/routes')(app);
    });

    it('Loads valid partials', function(done) {
      request(app)
        .get('/partials/main')
        .expect('<main></main>')
        .expect(200, done);
    });
  });

  describe('login', function() {
    var authCalled;
    var authStub = {
      authenticate: function(req, res, next) {
        authCalled = true;
        res.send({
          success: true
        });
      }
    };
    beforeEach(function() {
      authCalled = false;
      proxyquire('../../../server/config/routes', {
        '../services/authentication': authStub
      })(app);
    });

    it('calls authenticate', function(done) {
      request(app)
        .post('/login')
        .end(function(err, res) {
          expect(res.status).to.equal(200)
          expect(authCalled).to.be.true;
          done();
        });
    });
  });
});