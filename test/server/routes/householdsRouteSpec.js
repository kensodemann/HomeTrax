'use strict';

var expect = require('chai').expect;
var express = require('express');
var bodyParser = require('body-parser');
var request = require('supertest');
var proxyquire = require('proxyquire');
var db = require('../../../server/config/database');
var ObjectId = require('mongojs').ObjectId;

describe('api/household Routes', function() {
  var app;
  var myFavoriteHousehold;
  var authStub = {
    requiresApiLogin: function(req, res, next) {
      requiresApiLoginCalled = true;
      next();
    }
  };
  var requiresApiLoginCalled;

  beforeEach(function() {
    app = express();
    app.use(bodyParser());
  });

  beforeEach(function(done) {
    loadData(done);
  });

  beforeEach(function() {
    requiresApiLoginCalled = false;
    proxyquire('../../../server/config/routes', {
      '../services/authentication': authStub
    })(app);
  });

  afterEach(function(done) {
    removeData(done);
  });

  describe('GET', function() {
    it('requires an API login', function(done) {
      request(app)
        .get('/api/households')
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('returns all of the households', function(done) {
      request(app)
        .get('/api/households')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          done();
        });
    });
  });

  describe('POST', function() {
    it('requires an API login', function(done) {
      request(app)
        .post('/api/households')
        .send({
          name: 'My Other Condo',
          addressLine1: '42395 Secret St.',
          city: 'Milwaukee',
          state: 'WI',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('saves new households', function(done) {
      request(app)
        .post('/api/households')
        .send({
          name: 'My Other Condo',
          addressLine1: '42395 Secret St.',
          city: 'Milwaukee',
          state: 'WI',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function(err, res) {
          expect(!!err).to.be.false;
          expect(res.status).to.be.equal(201);
          db.entities.find({
            entityType: 'household'
          }, function(err, h) {
            expect(h.length).to.equal(4);
            done();
          });
        });
    });

    it('does not add new houses when updating existing households', function(done) {
      request(app)
        .post('/api/households/' + myFavoriteHousehold._id)
        .send({
          name: 'My Other Condo',
          addressLine1: '42395 Secret St.',
          city: 'Milwaukee',
          state: 'WI',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function(err, res) {
          expect(!!err).to.be.false;
          expect(res.status).to.be.equal(200);
          db.entities.find({
            entityType: 'household'
          }, function(err, h) {
            expect(h.length).to.equal(3);
            done();
          });
        });
    });

    it('updates the specified household', function(done) {
      request(app)
        .post('/api/households/' + myFavoriteHousehold._id)
        .send({
          name: 'My Other Condo',
          addressLine1: '42395 Secret St.',
          city: 'Milwaukee',
          state: 'WI',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function() {
          db.entities.findOne({
            _id: new ObjectId(myFavoriteHousehold._id)
          }, function(err, h) {
            expect(h.name).to.equal('My Other Condo');
            expect(h.addressLine1).to.equal('42395 Secret St.');
            done();
          });
        });
    });

    it('returns 404 if the household does not exist', function(done) {
      request(app)
        .post('/api/households/' + '54133902bc88a8241ac17f9d')
        .send({
          name: 'My Other Condo',
          addressLine1: '42395 Secret St.',
          city: 'Milwaukee',
          state: 'WI',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('requires a name', function(done) {
      request(app)
        .post('/api/households')
        .send({
          addressLine1: '42395 Secret St.',
          city: 'Milwaukee',
          state: 'WI',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Name is required');
          done();
        });
    });

    it('requires an address (line 1)', function(done) {
      request(app)
        .post('/api/households')
        .send({
          name: 'My Love Shack',
          city: 'Milwaukee',
          state: 'WI',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Address line 1 is required');
          done();
        });
    });

    it('requires city', function(done) {
      request(app)
        .post('/api/households')
        .send({
          name: 'My Love Shack',
          addressLine1: '123 Some Sexy St.',
          state: 'WI',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: City is required');
          done();
        });
    });

    it('requires state', function(done) {
      request(app)
        .post('/api/households')
        .send({
          name: 'My Love Shack',
          addressLine1: '123 Some Sexy St.',
          city: 'Hartland',
          postal: '55395',
          phone: '(414) 995-9875'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: State is required');
          done();
        });
    });

    it('requires postal code', function(done) {
      request(app)
        .post('/api/households')
        .send({
          name: 'My Love Shack',
          addressLine1: '123 Some Sexy St.',
          state: 'WI',
          city: 'Hartland',
          phone: '(414) 995-9875'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Postal code is required');
          done();
        });
    });
  });


  function loadData(done) {
    db.entities.remove(function() {
      db.entities.insert([{
        name: 'Old House',
        addressLine1: '805 South Harrison St.',
        city: 'Lancaster',
        state: 'WI',
        postal: '53813',
        phone: '(608) 723-8849',
        entityType: 'household'
      }, {
        name: 'Scion Xb',
        year: 2010,
        vin: '1885940059-293',
        entityType: 'vehicle'
      }, {
        name: 'Newer House',
        addressLine1: '1432 Freaky Dr.',
        city: 'Watertown',
        state: 'WI',
        postal: '53094',
        phone: '(920) 206-1234',
        entityType: 'household'
      }, {
        name: 'Condo Life',
        addressLine1: '1250 Wedgewood Dr.',
        addressLine2: 'Unit #T',
        city: 'Waukesha',
        state: 'WI',
        postal: '53186',
        phone: '(262) 547-2026',
        entityType: 'household'
      }], function() {
        db.entities.findOne({
          name: 'Condo Life'
        }, function(err, e) {
          myFavoriteHousehold = e;
          done();
        });
      });
    });
  }

  function removeData(done) {
    db.entities.remove(function() {
      done();
    });
  }
});