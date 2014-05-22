var expect = require('chai').expect;
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('supertest');
var proxyquire = require('proxyquire');
var db = require('../../../server/config/database');

describe('api/users Routes', function() {
  var app;

  beforeEach(function() {
    app = express();
    var fakeViewPath = path.normalize(__dirname + '/../mockViews/server/views');
    app.set('view engine', 'jade');
    app.set('views', fakeViewPath);
    app.use(bodyParser());
  });

  describe('GET', function() {
    var authStub;
    var roleCalledWith;
    var roleOrCurrentCalledWith;

    function loadUsers(done) {
      db.users.remove({}, function() {
        db.users.save({
          firstName: 'Ken',
          lastName: 'Sodemann',
          salt: 'NaCl',
          hashedPassword: 'GoldenCrisp'
        });
        db.users.save({
          firstName: 'Lisa',
          lastName: 'Buerger',
          salt: 'CaCl2',
          hashedPassword: 'BlackGold'
        });
        db.users.save({
          firstName: 'Geoff',
          lastName: 'Jones',
          salt: 'CH3COONa',
          hashedPassword: 'BlackStickyTar'
        });
        done();
      });
    }

    beforeEach(function(done) {
      loadUsers(done);
      authStub = {
        requiresRole: function(role) {
          return function(req, res, next) {
            roleCalledWith = role;
            next();
          }
        },
        requiresRoleOrIsCurrentUser: function(role) {
          return function(req, res, next) {
            roleOrCurrentCalledWith = role;
            next();
          }
        }
      };
      roleCalledWith = '';
      roleOrCurrentCalledWith = '';
      proxyquire('../../../server/config/routes', {
        '../services/authentication': authStub
      })(app);
    });

    afterEach(function(done) {
      db.users.remove(function() {
        done();
      });
    });

    it('Requires Admin User', function(done) {
      request(app)
        .get('/api/users')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(roleCalledWith).to.equal('admin');
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

    it('Strips the salt and hashedPassword', function(done) {
      request(app)
        .get('/api/users')
        .expect(200)
        .end(function(err, res) {
          var data = res.body;
          for (var i = 0; i < data.length; i++) {
            var user = data[i];
            expect(user.salt).to.be.undefined;
            expect(user.hashedPassword).to.be.undefined;
          }
          done();
        });
    });

    describe('by Id', function() {
      it('Requires Admin or Current User', function(done) {
        request(app)
          .get('/api/users/123456789012345678901234')
          .end(function(err, res) {
            expect(roleOrCurrentCalledWith).to.equal('admin');
            done();
          });
      });

      it('Gets the specified user if it exists', function(done) {
        db.users.findOne({
          firstName: 'Lisa'
        }, function(err, user) {
          request(app)
            .get('/api/users/' + user._id.toString())
            .end(function(err, res) {
              expect(res.status).to.equal(200);
              expect(res.body.lastName).to.equal('Buerger');
              expect(res.body.firstName).to.equal('Lisa');
              expect(res.body.salt).to.be.undefined;
              expect(res.body.hashedPassword).to.be.undefined;
              done();
            });
        });
      });

      it('Returns 404 if specified user does not exist', function(done) {
        db.users.remove({}, function(err) {
          request(app)
            .get('/api/users/123456789012345678901234')
            .end(function(err, res) {
              expect(res.status).to.equal(404);
              done();
            });
        });
      });
    });
  });

  describe('POST', function() {
    var authStub;
    var calledWith = '';

    function loadUsers(done) {
      db.users.remove({}, function() {
        db.users.save({
          firstName: 'Ken',
          lastName: 'Sodemann',
          username: 'kws@email.com'
        });
        done();
      });
    }

    beforeEach(function(done) {
      loadUsers(done);
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

    afterEach(function(done) {
      db.users.remove(function() {
        done();
      });
    });


    it('Requires admin user', function(done) {
      request(app)
        .post('/api/users')
        .send({
          firstName: 'Fred',
          lastName: 'Flintstone',
          username: 'lls@email.com'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(calledWith).to.equal('admin');
          done();
        });
    });

    it('Does not allow multiple users with the same username', function(done) {
      request(app)
        .post('/api/users')
        .send({
          firstName: 'Fred',
          lastName: 'Flintstone',
          username: 'kws@email.com'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: User kws@email.com already exists');
          done();
        });
    });

    it('Does not allow username to be empty', function(done) {
      request(app)
        .post('/api/users')
        .send({
          firstName: 'Fred',
          lastName: 'Flintstone',
          username: ''
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Username is required');
          done();
        });
    });

    it('Does not allow firstName to be empty', function(done) {
      request(app)
        .post('/api/users')
        .send({
          firstName: '',
          lastName: 'Flintstone',
          username: 'lls@email.com'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: First Name is required');
          done();
        });
    });

    it('Does not allow lastName to be empty', function(done) {
      request(app)
        .post('/api/users')
        .send({
          firstName: 'Fred',
          lastName: '',
          username: 'lls@email.com'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Last Name is required');
          done();
        });
    });

    it('Saves a new user if valid', function(done) {
      request(app)
        .post('/api/users')
        .send({
          firstName: 'Fred',
          lastName: 'Flintstone',
          username: 'lls@email.com'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          db.users.findOne({
              username: 'lls@email.com'
            },
            function(err, user) {
              expect(user.firstName).to.equal('Fred');
              expect(user.lastName).to.equal('Flintstone');
              expect(user._id.toString()).to.equal(res.body._id);
              done();
            });
        });
    });
  });

  describe('PUT', function() {
    var calledWith = '';
    var testUser;

    function loadUsers(done) {
      db.users.remove({}, function() {
        db.users.save({
          firstName: 'Ken',
          lastName: 'Sodemann',
          username: 'kws@email.com',
          salt: 'NH4Cl',
          password: 'ThisIsFreaky'
        });
        db.users.save({
          firstName: 'Lisa',
          lastName: 'Buerger',
          username: 'llb@email.com',
          salt: 'CaCl2',
          password: 'IAmSexyBee'
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
      request(app)
        .put('/api/users/' + testUser._id)
        .send(testUser)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(calledWith).to.equal('admin');
          done();
        });
    });

    it('Does not allow multiple users with the same username', function(done) {
      testUser.username = 'llb@email.com';
      request(app)
        .put('/api/users/' + testUser._id)
        .send(testUser)
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: User llb@email.com already exists');
          done();
        });
    });

    it('Does not allow username to be empty', function(done) {
      testUser.username = '';
      request(app)
        .put('/api/users/' + testUser._id)
        .send(testUser)
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Username is required');
          done();
        });
    });

    it('Does not allow firstName to be empty', function(done) {
      testUser.firstName = '';
      request(app)
        .put('/api/users/' + testUser._id)
        .send(testUser)
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: First Name is required');
          done();
        });
    });

    it('Does not allow lastName to be empty', function(done) {
      testUser.lastName = '';
      request(app)
        .put('/api/users/' + testUser._id)
        .send(testUser)
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Last Name is required');
          done();
        });
    });

    it('Saves changes to user if valid', function(done) {
      testUser.firstName = 'Fred';
      testUser.lastName = 'Flintstone';
      testUser.username = 'ff@email.com';
      request(app)
        .put('/api/users/' + testUser._id)
        .send(testUser)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          db.users.findOne({
              _id: testUser._id
            },
            function(err, user) {
              expect(user.firstName).to.equal('Fred');
              expect(user.lastName).to.equal('Flintstone');
              expect(user.username).to.equal('ff@email.com');
              done();
            });
        });
    });

    it('Does not effect the salt or password', function(done) {
      var origSalt = testUser.salt;
      var origPassword = testUser.password;
      testUser.firstName = 'Fred';
      testUser.lastName = 'Flintstone';
      testUser.username = 'ff@email.com';
      testUser.salt = 'NaCl';
      testUser.password = 'SomethingElse';
      request(app)
        .put('/api/users/' + testUser._id)
        .send(testUser)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          db.users.findOne({
              _id: testUser._id
            },
            function(err, user) {
              expect(user.salt).to.equal(origSalt);
              expect(user.password).to.equal(origPassword);
              done();
            });
        });
    });
  });
});