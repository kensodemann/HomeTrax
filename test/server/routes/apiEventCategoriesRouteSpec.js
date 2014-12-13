'use strict'

var expect = require('chai').expect;
var express = require('express');
var request = require('supertest');
var proxyquire = require('proxyquire');

describe('api/eventCategories Routes', function() {
  var app;

  beforeEach(function() {
    app = express();
  });

  describe('GET', function() {
    var authStub = {
      requiresApiLogin: function(req, res, next) {
        requiresApiLoginCalled = true;
        next();
      }
    }
    var eventCategoriesRepositoryStub = {
      get: function(req, res, next) {
        eventCategoriesRepositoryGetCalled = true;
        res.send();
      }
    }
    var requiresApiLoginCalled;
    var eventCategoriesRepositoryGetCalled;

    beforeEach(function() {
      requiresApiLoginCalled = false;
      eventCategoriesRepositoryGetCalled = false;
      proxyquire('../../../server/config/routes', {
        '../services/authentication': authStub,
        '../repositories/eventCategories': eventCategoriesRepositoryStub
      })(app);
    });

    it('requires an API login', function(done) {
      request(app)
        .get('/api/eventCategories')
        .end(function(err, res) {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('returns event categories', function(done) {
      request(app)
        .get('/api/eventCategories')
        .end(function(err, res) {
          expect(eventCategoriesRepositoryGetCalled).to.be.true;
          done();
        });
    });
  });

  describe('POST', function() {
    var authStub = {
      requiresApiLogin: function(req, res, next) {
        requiresApiLoginCalled = true;
        next();
      }
    }
    var eventCategoriesRepositoryStub = {
      save: function(req, res, next) {
        eventCategoriesRepositorySaveCalled = true;
        res.send();
      }
    }
    var requiresApiLoginCalled;
    var eventCategoriesRepositorySaveCalled;

    beforeEach(function() {
      requiresApiLoginCalled = false;
      eventCategoriesRepositorySaveCalled = false;
      proxyquire('../../../server/config/routes', {
        '../services/authentication': authStub,
        '../repositories/eventCategories': eventCategoriesRepositoryStub
      })(app);
    });

    it('requires an API login', function(done) {
      request(app)
        .post('/api/eventCategories')
        .send({
          name: 'this is a name'
        })
        .end(function(err, res) {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('saves the event category', function(done) {
      request(app)
        .post('/api/eventCategories')
        .send({
          name: 'this is a name'
        })
        .end(function(err, res) {
          expect(eventCategoriesRepositorySaveCalled).to.be.true;
          done();
        });
    });

    it('saves specified event category', function(done) {
      request(app)
        .post('/api/eventCategories/1')
        .send({
          _id: 1,
          name: 'this is a name'
        })
        .end(function(err, res) {
          expect(eventCategoriesRepositorySaveCalled).to.be.true;
          done();
        });
    });
  });
});