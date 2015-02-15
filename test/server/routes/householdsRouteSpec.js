'use strict';

var expect = require('chai').expect;
var express = require('express');
var bodyParser = require('body-parser');
var request = require('supertest');
var proxyquire = require('proxyquire');
var db = require('../../../server/config/database');

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
          name: 'this is a name'
        })
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });
  });


  function loadData(done) {
    db.households.remove(function() {
      db.households.insert([{
        name: 'Old House',
        addressLine1: '805 South Harrison St.',
        city: 'Lancaster',
        state: 'WI',
        postal: '53813',
        phone: '(608) 723-8849'
      }, {
        name: 'Newer House',
        addressLine1: '1432 Freaky Dr.',
        city: 'Watertown',
        state: 'WI',
        postal: '53094',
        phone: '(920) 206-1234'
      }, {
        name: 'Condo Life',
        addressLine1: '1250 Wedgewood Dr.',
        addressLine2: 'Unit #T',
        city: 'Waukesha',
        state: 'WI',
        postal: '53186',
        phone: '(262) 547-2026'
      }], function() {
        db.eventCategories.findOne({
          name: 'Condo Life'
        }, function(err, e) {
          myFavoriteHousehold = e;
          done();
        });
      });
    });
  }

  function removeData(done) {
    db.households.remove(function() {
      done();
    });
  }
});
