/* global afterEach beforeEach describe it */
'use strict';

var expect = require('chai').expect;
var express = require('express');
var bodyParser = require('body-parser');
var request = require('supertest');
var proxyquire = require('proxyquire');
var db = require('../../../server/config/database');
var ObjectId = require("mongojs").ObjectId;

describe('api/events Routes', function() {
  var app;
  var myPublicEvent;
  var myPrivateEvent;
  var otherUserPublicEvent;
  var otherUserPrivateEvent;

  var requiresApiLoginCalled;
  var authStub = {
    requiresApiLogin: function(req, res, next) {
      req.user = {
        _id: '53a4dd887c6dc30000bee3af'
      };
      requiresApiLoginCalled = true;
      next();
    }
  };

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
        .get('/api/events')
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('returns events for logged in user and non-private events for other users', function(done) {
      request(app)
        .get('/api/events')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          res.body.forEach(function(e) {
            if (e.private) {
              expect(e.userId.toString()).to.equal('53a4dd887c6dc30000bee3af');
            }
          });
          done();
        });
    });
  });

  describe('POST', function() {
    it('requires an API login', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: 'this is a title'
        })
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('Saves new events', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: 'This is a new one',
          allDay: true,
          start: '2014-06-22',
          private: true,
          color: 'blue',
          category: 'whatever'
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(201);
          db.events.find(function(err, events) {
            expect(events.length).to.equal(5);
            done();
          });
        });
    });

    it('Sets userId to logged in user when saving new data', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: 'This is a new one',
          allDay: true,
          start: '2014-06-22',
          private: true,
          color: 'blue',
          category: 'whatever'
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(201);
          db.events.findOne({title: 'This is a new one'}, function(err, evt) {
            expect(evt.userId.toString()).to.equal('53a4dd887c6dc30000bee3af');
            done();
          });
        });
    });
    
    it('returns the _id when saving new data', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: 'This is a new one',
          allDay: true,
          start: '2014-06-22',
          private: true,
          color: 'blue',
          category: 'whatever'
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(201);
          expect(res.body._id).to.not.be.undefined;
          done();
        });
    });

    it('Saves changes to existing items', function(done) {
      request(app)
        .post('/api/events/' + myPublicEvent._id.toString())
        .send({
          title: 'Do Something Else',
          allDay: false,
          start: '2014-06-20T12:00:00',
          end: '2014-06-20T13:00:00',
          category: 'Health & Fitness',
          private: false,
          userId: new ObjectId('53a4dd887c6dc30000bee3af')
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          db.events.findOne({_id: myPublicEvent._id}, function(err, evt) {
            expect(evt.title).to.equal('Do Something Else');
            db.events.find(function(err, evts) {
              expect(evts.length).to.equal(4);
              done();
            });
          });
        });
    });

    it("Does not allow modifications to other user's events", function(done) {
      request(app)
        .post('/api/events/' + otherUserPublicEvent._id.toString())
        .send({
          title: 'Do Something Else',
          allDay: false,
          start: '2014-06-20T12:00:00',
          end: '2014-06-20T13:00:00',
          category: 'Health & Fitness',
          private: false,
          userId: new ObjectId('53a4dd887c6dc30000bee3af')
        })
        .end(function(err, res) {
          expect(res.status).to.equal(403);
          db.events.findOne({_id: otherUserPublicEvent._id}, function(err, evt) {
            expect(evt.title).to.equal('Have Sex');
            db.events.find(function(err, evts) {
              expect(evts.length).to.equal(4);
              done();
            });
          });
        });
    });

    it("does not allow modifications to non existent events", function(done) {
      request(app)
        .post('/api/events/53a4dd887c6dc30000bee3af')
        .send({
          title: 'Do Something Else',
          allDay: false,
          start: '2014-06-20T12:00:00',
          end: '2014-06-20T13:00:00',
          category: 'Health & Fitness',
          private: false,
          userId: new ObjectId('53a4dd887c6dc30000bee3af')
        })
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          db.events.find(function(err, evts) {
            expect(evts.length).to.equal(4);
            done();
          });
        });
    });

    it('does not allow the start date to be greater than the end date', function(done) {
      request(app)
        .post('/api/events/' + myPublicEvent._id.toString())
        .send({
          title: 'Do Something Else',
          allDay: false,
          start: '2014-06-20T12:00:00',
          end: '2014-06-20T11:00:00',
          category: 'Health & Fitness',
          private: false,
          userId: new ObjectId('53a4dd887c6dc30000bee3af')
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Start date must be on or before the end date.');
          done();
        });
    });

    it('does not allow the start date to be greater than the end date', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: '',
          allDay: false,
          start: '2014-06-20T12:00:00',
          end: '2014-06-20T13:00:00',
          category: 'Health & Fitness',
          private: false
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Events must have a title.');
          done();
        });
    });

    it('does not allow saving an event without a start date', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: 'Do Something Else',
          allDay: false,
          start: '',
          end: '2014-06-20T13:00:00',
          category: 'Health & Fitness',
          private: false
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Events must have a start date.');
          done();
        });
    });

    it('does not allow saving an event without a category', function(done) {
      request(app)
        .post('/api/events')
        .send({
          title: 'Do Something Else',
          allDay: false,
          start: '2014-06-20T12:00:00',
          end: '2014-06-20T13:00:00',
          category: '',
          private: false
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.reason).to.equal('Error: Events must have a category.');
          done();
        });
    });
  });

  describe('DELETE', function() {
    it('requires an API login', function(done) {
      request(app)
        .delete('/api/events/123456789012345678901234')
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('removes the specified item', function(done) {
      request(app)
        .delete('/api/events/' + myPrivateEvent._id.toString())
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          db.events.find(function(err, evts) {
            expect(evts.length).to.equal(3);
            db.events.findOne({_id: myPrivateEvent._id}, function(err, evt) {
              expect(!!evt).to.be.false;
              done();
            });
          });
        });
    });

    it('retuns 404 if item does not exist', function(done) {
      request(app)
        .delete('/api/events/53a4dd887c6dc30000bee3af')
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          db.events.find(function(err, evts) {
            expect(evts.length).to.equal(4);
            done();
          });
        });
    });

    it('returns 403 if item belongs to someone else', function(done) {
      request(app)
        .delete('/api/events/' + otherUserPublicEvent._id.toString())
        .end(function(err, res) {
          expect(res.status).to.equal(403);
          db.events.find(function(err, evts) {
            expect(evts.length).to.equal(4);
            done();
          });
        });
    });
  });

  function loadData(done) {
    db.events.remove({}, function() {
      db.events.insert([{
        title: 'Eat Something',
        allDay: false,
        start: '2014-06-20T12:00:00',
        end: '2014-06-20T13:00:00',
        category: 'Health & Fitness',
        private: false,
        userId: new ObjectId('53a4dd887c6dc30000bee3af')
      }, {
        title: 'Fart',
        allDay: false,
        start: '2014-06-20T13:01:00',
        end: '2014-06-20T13:05:00',
        category: 'Health & Fitness',
        private: true,
        userId: new ObjectId('53a4dd887c6dc30000bee3af')
      }, {
        title: 'Have Sex',
        allDay: false,
        start: '2014-06-22T16:00:00',
        end: '2014-06-22T18:45:00',
        category: 'Recreation',
        userId: new ObjectId('53a4dd887c6dc30000bee3ae')
      }, {
        title: 'Sleep',
        allDay: false,
        start: '2014-06-23T12:00:00',
        end: '2014-06-20T13:00:00',
        category: 'Health & Fitness',
        private: true,
        userId: new ObjectId('53a4dd887c6dc30000bee3ae')
      }], function(err, events) {
        myPublicEvent = events[0];
        myPrivateEvent = events[1];
        otherUserPublicEvent = events[2];
        otherUserPrivateEvent = events[3];
        done();
      });
    });
  }

  function removeData(done) {
    db.events.remove(function() {
      done();
    });
  }
})
;