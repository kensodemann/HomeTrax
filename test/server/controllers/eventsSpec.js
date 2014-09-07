'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var eventsController = require('../../../server/controllers/events');
var db = require('../../../server/config/database');
var ObjectId = require('mongojs').ObjectId;

describe('events controller', function (){
  var myPublicEvent;
  var myPrivateEvent;
  var otherUserPublicEvent;
  var otherUserPrivateEvent;

  beforeEach(function (done){
    loadEvents(done);
  });

  afterEach(function (done){
    db.events.remove(function (){
      done();
    });
  });

  describe('get', function (){
    var req;

    beforeEach(function (){
      req = sinon.stub({
        user: {
          _id: '53a4dd887c6dc30000bee3af'
        }
      });
    });

    it('returns events for user and non-private events for other users', function (done){
      eventsController.get(req, {
        send: function (events){
          expect(events.length).to.equal(3);
          events.forEach(function (e){
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

  describe('getById', function (){
    var req;

    beforeEach(function (){
      req = sinon.stub({
        user: {
          _id: '53a4dd887c6dc30000bee3af'
        },
        params: {}
      });
    });

    it('returns a status of 404 if the event does not exist', function (done){
      var status;
      req.params.id = '53a4dd887c6dc30000bee3af';
      eventsController.getById(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(e).to.be.undefined;
          expect(status).to.equal(404);
          done();
        }
      });
    });

    it('returns the event if the event exists and is mine', function (done){
      req.params.id = myPrivateEvent._id.toString();
      eventsController.getById(req, {
        send: function (e){
          expect(e).to.deep.equal(myPrivateEvent);
          done();
        }
      });
    });

    it('returns the event if the event exists, is not mine, but is public', function (done){
      req.params.id = otherUserPublicEvent._id.toString();
      eventsController.getById(req, {
        send: function (e){
          expect(e).to.deep.equal(otherUserPublicEvent);
          done();
        }
      });
    });

    it('returns a status of 403 if the event exists, is not mine and is private', function (done){
      var status;
      req.params.id = otherUserPrivateEvent._id.toString();
      eventsController.getById(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(e).to.be.undefined;
          expect(status).to.equal(403);
          done();
        }
      });
    });
  });

  describe('save', function (){
    var req;

    beforeEach(function (){
      req = sinon.stub({
        user: {
          _id: '53a4dd887c6dc30000bee3af'
        },
        params: {}
      });
    });


    it('Adds new data to the events collection', function (done){
      req.body = {
        title: 'This is a new one',
        allDay: true,
        start: '2014-06-22',
        private: true,
        color: 'blue',
        category: 'whatever'
      };
      eventsController.save(req, {
        send: function (e){
          expect(e._id).to.not.be.undefined;
          db.events.count(function (err, cnt){
            expect(cnt).to.equal(5);
            done();
          });
        }
      });
    });

    it('Saves changes to existing items', function (done){
      req.body = myPrivateEvent;
      myPrivateEvent.private = false;
      myPrivateEvent.title = 'some other title';
      eventsController.save(req, {
        send: function (){
          db.events.findOne({
            _id: myPrivateEvent._id
          }, function (err, ev){
            expect(ev.private).to.be.false;
            expect(ev.title).to.equal('some other title');
            done();
          });
        }
      })
    });

    it('Sets userId to logged in user when saving new data', function (done){
      req.body = {
        title: 'This is a new one',
        allDay: true,
        start: '2014-06-22',
        private: true,
        color: 'blue',
        category: 'whatever'
      };
      eventsController.save(req, {
        send: function (e){
          expect(e.userId.toString()).to.equal(req.user._id.toString());
          done();
        }
      });
    });

    it('forbids users from modifying other users events', function (done){
      var status;
      req.body = otherUserPublicEvent;
      eventsController.save(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(status).to.equal(403);
          expect(e).to.be.undefined;
          done();
        }
      });
    });

    it('does not allow the start date to be greater than the end date', function(done){
      var status;
      myPublicEvent.start = '2014-09-03T12:00:00.000Z';
      myPrivateEvent.end = '2014-09-02T12:00:00.000Z';
      req.body = myPublicEvent;
      eventsController.save(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(status).to.equal(400);
          expect(e.reason).to.equal('Error: Start date must be on or before the end date.');
          done();
        }
      });
    });

    it('does not allow the start time to be greater than the end date', function(done){
      var status;
      myPublicEvent.start = '2014-09-03T12:00:01.000Z';
      myPrivateEvent.end = '2014-09-03T12:00:00.000Z';
      req.body = myPublicEvent;
      eventsController.save(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(status).to.equal(400);
          expect(e.reason).to.equal('Error: Start date must be on or before the end date.');
          done();
        }
      });
    });

    it('does not allow saving an event without a title', function(done){
      var status;
      myPublicEvent.title = '';
      req.body = myPublicEvent;
      eventsController.save(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(status).to.equal(400);
          expect(e.reason).to.equal('Error: Events must have a title.');
          done();
        }
      });
    });

    it('does not allow saving an event without a start date', function(done){
      var status;
      myPublicEvent.start = '';
      req.body = myPublicEvent;
      eventsController.save(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(status).to.equal(400);
          expect(e.reason).to.equal('Error: Events must have a start date.');
          done();
        }
      });
    });
  });

  describe('remove', function (){
    var req;

    beforeEach(function (){
      req = sinon.stub({
        user: {
          _id: '53a4dd887c6dc30000bee3af'
        },
        params: {}
      });
    });

    it('removes the specified item', function (done){
      req.params.id = myPrivateEvent._id.toString();
      eventsController.remove(req, {
        send: function (){
          db.events.count(function (err, cnt){
            expect(cnt).to.equal(3);
            db.events.count({
              _id: myPrivateEvent._id
            }, function (err, cnt){
              expect(cnt).to.equal(0);
              done();
            });
          });
        }
      });
    });

    it('retuns 404 if item does not exist', function (done){
      var status;
      req.body = {
        _id: ObjectId('53a4dd887c6dc30000bee3a1'),
        title: 'I do not exist',
        userId: ObjectId(req.user._id)
      };
      eventsController.remove(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(status).to.equal(404);
          expect(e).to.be.undefined;
          db.events.count(function (err, cnt){
            expect(cnt).to.equal(4);
            done();
          });
        }
      });
    });

    it('returns 403 if item belongs to someone else', function (done){
      var status;
      req.params = {
        id: otherUserPublicEvent._id.toString()
      };
      eventsController.remove(req, {
        status: function (s){
          status = s;
        },
        send: function (e){
          expect(status).to.equal(403);
          expect(e).to.be.undefined;
          db.events.count(function (err, cnt){
            expect(cnt).to.equal(4);
            done();
          });
        }
      });
    });
  });

  function loadEvents(done){
    db.events.remove({}, function (){
      db.events.save({
        title: 'Eat Something',
        allDay: false,
        start: '2014-06-20T12:00:00',
        end: '2014-06-20T13:00:00',
        category: 'Health & Fitness',
        private: false,
        userId: ObjectId('53a4dd887c6dc30000bee3af')
      }, function (error, value){
        myPublicEvent = value;
        db.events.save({
          title: 'Fart',
          allDay: false,
          start: '2014-06-20T13:01:00',
          end: '2014-06-20T13:05:00',
          category: 'Health & Fitness',
          private: true,
          userId: ObjectId('53a4dd887c6dc30000bee3af')
        }, function (error, value){
          myPrivateEvent = value;
          db.events.save({
            title: 'Have Sex',
            allDay: false,
            start: '2014-06-22T16:00:00',
            end: '2014-06-22T18:45:00',
            category: 'Recreation',
            private: false,
            userId: ObjectId('53a4dd887c6dc30000bee3ae')
          }, function (error, value){
            otherUserPublicEvent = value;
            db.events.save({
              title: 'Sleep',
              allDay: false,
              start: '2014-06-23T12:00:00',
              end: '2014-06-20T13:00:00',
              category: 'Health & Fitness',
              private: true,
              userId: ObjectId('53a4dd887c6dc30000bee3ae')
            }, function (error, value){
              otherUserPrivateEvent = value;
              done();
            });
          });
        });
      });
    });
  }
});