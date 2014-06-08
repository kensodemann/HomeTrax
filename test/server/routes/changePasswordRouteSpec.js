var expect = require('chai').expect;
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('supertest');
var proxyquire = require('proxyquire');
var db = require('../../../server/config/database');
var encryption = require('../../../server/services/encryption');

describe('api/changepassword Route', function() {
  var app;

  beforeEach(function() {
    app = express();
    var fakeViewPath = path.normalize(__dirname + '/../mockViews/server/views');
    app.set('view engine', 'jade');
    app.set('views', fakeViewPath);
    app.use(bodyParser());
  });

  describe('PUT', function() {
    var testUser;

    function loadUsers(done) {
      var salt = encryption.createSalt();
      var hash = encryption.hash(salt, 'ThisIsFreaky');
      db.users.remove({}, function() {
        db.users.save({
          firstName: 'Ken',
          lastName: 'Sodemann',
          username: 'kws@email.com',
          salt: salt,
          hashedPassword: hash
        });
        salt = encryption.createSalt();
        hash = encryption.hash(salt, 'IAmSexyBee');
        db.users.save({
          firstName: 'Lisa',
          lastName: 'Buerger',
          username: 'llb@email.com',
          salt: salt,
          hashedPassword: hash
        }, function() {
          db.users.findOne({
            username: 'kws@email.com'
          }, function(err, user) {
            testUser = user;
            done();
          });
        });
      });
    }

    beforeEach(function(done) {
      loadUsers(done);
      authStub = {
        requiresRoleOrIsCurrentUser: function(role) {
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

    afterEach(function(done) {
      db.users.remove(function() {
        done();
      });
    });

    it('Requires admin or matching current user', function(done) {
      var passwordData = new Object();
      passwordData.password = 'ThisIsFreaky';
      passwordData.newPassword = 'SomethingValid';
      request(app)
        .put('/api/changepassword/' + testUser._id)
        .send(passwordData)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(calledWith).to.equal('admin');
          done();
        });
    });

    it('Requires a valid user _id', function(done) {
      var passwordData = new Object();
      passwordData.password = 'ThisIsFreaky';
      passwordData.newPassword = 'SomethingValid';
      request(app)
        .put('/api/changepassword/123456789009876543211234')
        .send(passwordData)
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('Will not allow password change if the old password is invalid', function(done) {
      var passwordData = new Object();
      passwordData.password = 'SomethingBogus';
      passwordData.newPassword = 'SomethingValid';
      request(app)
        .put('/api/changepassword/' + testUser._id)
        .send(passwordData)
        .end(function(err, res) {
          expect(res.status).to.equal(403);
          expect(res.body.reason).to.equal('Invalid Password');
          done();
        });
    });

    it('Will not allow password change if the new password is invalid', function(done) {
      var passwordData = new Object();
      passwordData.password = 'ThisIsFreaky';
      passwordData.newPassword = 'Short';
      request(app)
        .put('/api/changepassword/' + testUser._id)
        .send(passwordData)
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('New Password must be at least 8 characters long');
          done();
        });
    });

    it('Sets new salt', function(done) {
      var passwordData = new Object();
      passwordData.password = 'ThisIsFreaky';
      passwordData.newPassword = 'SomethingValid';
      request(app)
        .put('/api/changepassword/' + testUser._id)
        .send(passwordData)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          db.users.findOne({
            _id: testUser._id
          }, function(err, user) {
            expect(user.salt).to.not.equal(testUser.salt);
            done();
          });
        });
    });

    it('Sets the password', function(done) {
      var passwordData = new Object();
      passwordData.password = 'ThisIsFreaky';
      passwordData.newPassword = 'SomethingValid';
      request(app)
        .put('/api/changepassword/' + testUser._id)
        .send(passwordData)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          db.users.findOne({
            _id: testUser._id
          }, function(err, user) {
          	var hash = encryption.hash(user.salt, 'SomethingValid');
            expect(user.hashedPassword).to.equal(hash);
            done();
          });
        });
    });
  });
})