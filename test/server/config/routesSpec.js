var expect = require('chai').expect;
var express = require('express');
var path = require('path');
var request = require('supertest');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var db = require('../../../server/config/database');

describe('routes', function() {
  var app;

  beforeEach(function() {
    app = express();
    var fakeViewPath = path.normalize(__dirname + '/../mockViews/server/views');
    app.set('view engine', 'jade');
    app.set('views', fakeViewPath);
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
        .expect(200)
        .end(function(err, res) {
          expect(authCalled).to.be.true;
          done();
        });
    });
  });

  describe('api/users', function() {
    var authStub;
    var calledWith = '';

    function loadUsers() {
      db.users.remove({}, function() {
        db.users.save({
          firstName: 'Ken',
          lastName: 'Sodemann'
        });
        db.users.save({
          firstName: 'Lisa',
          lastName: 'Buerger'
        });
        db.users.save({
          firstName: 'Geoff',
          lastName: 'Jones'
        });
      });
    }

    beforeEach(function() {
      loadUsers();
      authStub = {
        requiresRole: function(role) {
          return function(req, res, next) {
            calledWith = role;
            next();
          }
        }
      };
      proxyquire('../../../server/config/routes', {
        '../services/authentication': authStub
      })(app);
    });

    afterEach(function(){
      db.users.remove();
    });

    it('Requires Admin User', function(done) {
      request(app)
        .get('/api/users')
        .expect(200)
        .end(function(err, res) {
          expect(calledWith).to.equal('admin');
          done();
        });
    });

    it('Returns User Data', function(done) {
      request(app)
        .get('/api/users')
        .expect(200)
        .end(function(err, res) {
          expect(res.body.length).to.equal(3);
          done();
        });
    });
  });
});