'use strict'

var expect = require('chai').expect;
var sinon = require('sinon');
var eventsController = require('../../../server/controllers/events');
var db = require('../../../server/config/database');
var ObjectId = require('mongojs').ObjectId;

describe('events controller', function() {
  var myPublicEvent;
  var myPrivateEvent;
  var otherUserPublicEvent;
  var otherUserPrivateEvent;

  beforeEach(function(done) {
    loadEvents(done);
  });

  afterEach(function(done) {
    db.events.remove(function() {
      done();
    });
  });

  describe('get', function() {
    var req;

    beforeEach(function() {
      req = sinon.stub({
        user: {
          _id: '53a4dd887c6dc30000bee3af'
        }
      });
    });

    it('returns events for user and non-private events for other users', function(done) {
      eventsController.get(req, {
        send: function(events) {
          expect(events.length).to.equal(3);
          events.forEach(function(e, idx) {
            expect(e.private).to.be.a('Boolean');
            if (e.private) {
              expect(e.userId.toString()).to.equal('53a4dd887c6dc30000bee3af');
            }
          });
          done();
        }
      });
    });
  });

  describe('getById', function() {
    var req;

    beforeEach(function() {
      req = sinon.stub({
        user: {
          _id: '53a4dd887c6dc30000bee3af'
        },
        params: {}
      });
    });

    it('returns a status of 404 if the event does not exist', function(done) {
      var status;
      req.params.id = '53a4dd887c6dc30000bee3af';
      eventsController.getById(req, {
        status: function(s) {
          status = s;
        },
        send: function(e) {
          expect(e).to.be.undefined;
          expect(status).to.equal(404);
          done();
        }
      });
    });

    it('returns the event if the event exists and is mine', function(done) {
      req.params.id = myPrivateEvent._id.toString();
      eventsController.getById(req, {
        send: function(e) {
          expect(e).to.deep.equal(myPrivateEvent);
          done();
        }
      });
    });

    it('returns the event if the event exists, is not mine, but is public', function(done) {
      req.params.id = otherUserPublicEvent._id.toString();
      eventsController.getById(req, {
        send: function(e) {
          expect(e).to.deep.equal(otherUserPublicEvent);
          done();
        }
      });
    });

    it('returns a status of 403 if the event exists, is not mine and is private', function(done) {
      var status;
      req.params.id = otherUserPrivateEvent._id.toString();
      eventsController.getById(req, {
        status: function(s){
          status = s;
        },
        send: function(e) {
          expect(e).to.be.undefined;
          expect(status).to.equal(403);
          done();
        }
      });
    });

  });

  function loadEvents(done) {
    db.events.remove({}, function() {
      db.events.save({
        title: 'Eat Something',
        allDay: false,
        start: '2014-06-20T12:00:00',
        end: '2014-06-20T13:00:00',
        category: 'Health & Fitness',
        private: false,
        userId: ObjectId('53a4dd887c6dc30000bee3af')
      }, function(error, value) {
        myPublicEvent = value;
        db.events.save({
          title: 'Fart',
          allDay: false,
          start: '2014-06-20T13:01:00',
          end: '2014-06-20T13:05:00',
          category: 'Health & Fitness',
          private: true,
          userId: ObjectId('53a4dd887c6dc30000bee3af')
        }, function(error, value) {
          myPrivateEvent = value;
          db.events.save({
            title: 'Have Sex',
            allDay: false,
            start: '2014-06-22T16:00:00',
            end: '2014-06-22T18:45:00',
            category: 'Recreation',
            private: false,
            userId: ObjectId('53a4dd887c6dc30000bee3ae')
          }, function(error, value) {
            otherUserPublicEvent = value
            db.events.save({
              title: 'Sleep',
              allDay: false,
              start: '2014-06-23T12:00:00',
              end: '2014-06-20T13:00:00',
              category: 'Health & Fitness',
              private: true,
              userId: ObjectId('53a4dd887c6dc30000bee3ae')
            }, function(error, value) {
              otherUserPrivateEvent = value;
              done();
            });
          });
        });
      });
    });
  }
});