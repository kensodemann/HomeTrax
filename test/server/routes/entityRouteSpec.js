'use strict';

var expect = require('chai').expect;
var express = require('express');
var bodyParser = require('body-parser');
var request = require('supertest');
var proxyquire = require('proxyquire');
var db = require('../../../server/config/database');
var ObjectId = require('mongojs').ObjectId;

describe('api/entities routes', function() {
  var app;
  var authStub = {
    requiresApiLogin: function(req, res, next) {
      requiresApiLoginCalled = true;
      next();
    }
  };
  var myFavoriteEntity;
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
    proxyquire('../../../server/repositories/entities', {
      '../services/authentication': authStub
    })(app);
  });

  afterEach(function(done) {
    removeData(done);
  });

  describe('GET', function() {
    it('requires an API login', function(done) {
      request(app)
        .get('/api/entities')
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('returns all of the entities', function(done) {
      request(app)
        .get('/api/entities')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(6);
          done();
        });
    });

    it('returns just the specified entities', function(done) {
      request(app)
        .get('/api/entities?entityType=household')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
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
        name: 'Kia Rio',
        year: 2008,
        vin: '19948803-385',
        entityType: 'vehicle'
      }, {
        name: 'Refridgerator',
        manufacturer: 'Samsung',
        purchasePrice: 1994.49,
        entityType: 'appliance'
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
          myFavoriteEntity = e;
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