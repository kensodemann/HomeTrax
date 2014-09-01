'use strict'

var expect = require('chai').expect;
var express = require('express');
var request = require('supertest');
var proxyquire = require('proxyquire');

describe('api/events Routes', function() {
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
    var eventsRepositoryStub = {
      get: function(req, res, next) {
        eventsRepositoryGetCalled = true;
        res.send();
      }
    }
    var requiresApiLoginCalled;
    var eventsRepositoryGetCalled;

    beforeEach(function() {
      requiresApiLoginCalled = false;
      eventsRepositoryGetCalled = false;
      proxyquire('../../../server/config/routes', {
        '../services/authentication': authStub,
        '../controllers/events': eventsRepositoryStub
      })(app);
    });

    it('requires an API login', function(done) {
      request(app)
        .get('/api/events')
        .end(function(err, res) {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('returns events', function(done) {
      request(app)
        .get('/api/events')
        .end(function(err, res) {
          expect(eventsRepositoryGetCalled).to.be.true;
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
    var eventsRepositoryStub = {
      save: function(req, res, next) {
        eventsRepositorySaveCalled = true;
        res.send();
      }
    }
    var requiresApiLoginCalled;
    var eventsRepositorySaveCalled;

    beforeEach(function() {
      requiresApiLoginCalled = false;
      eventsRepositorySaveCalled = false;
      proxyquire('../../../server/config/routes', {
        '../services/authentication': authStub,
        '../controllers/events': eventsRepositoryStub
      })(app);
    });

    it('requires an API login', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: 'this is a title'
        })
        .end(function(err, res) {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('saves the event', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: 'this is a title'
        })
        .end(function(err, res) {
          expect(eventsRepositorySaveCalled).to.be.true;
          done();
        });
    });

    it('saves specified event', function(done) {
      request(app)
        .post('/api/events/1')
        .send({
          _id: 1,
          title: 'this is a title'
        })
        .end(function(err, res) {
          expect(eventsRepositorySaveCalled).to.be.true;
          done();
        });
    });
  });
});