var expect = require('chai').expect;
var express = require('express');
var path = require('path');
var request = require('supertest');
var proxyquire = require('proxyquire');
var db = require('../../../server/config/database');

describe('routes', function() {
  var app;

  beforeEach(function() {
    app = express();
    var fakeViewPath = path.normalize(__dirname + '/../mockViews/server/views');
    app.set('view engine', 'jade');
    app.set('views', fakeViewPath);
    app.use(express.bodyParser());
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

  describe('api/users GET', function() {
    var authStub;
    var calledWith = '';

    function loadUsers(done) {
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

    it('Requires Admin User', function(done) {
      request(app)
        .get('/api/users')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
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

  describe('api/users POST', function() {
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

  describe('api/users PUT', function() {
    var called = false;;
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
        requiresApiLogin: function(req, res, next) {
          called = true;
          next();
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

    it('Requires logged in user', function(done) {
      request(app)
        .put('/api/users/' + testUser._id)
        .send(testUser)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(called).to.be.true;
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