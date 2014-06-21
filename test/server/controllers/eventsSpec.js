'use strict'

var expect = require('chai').expect;
var sinon = require('sinon');
var eventsController = require('../../../server/controllers/events');
var db = require('../../../server/config/database');
var ObjectId = require('mongojs').ObjectId;

describe('events controller', function() {
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
    }, function() {
      db.events.save({
        title: 'Fart',
        allDay: false,
        start: '2014-06-20T13:01:00',
        end: '2014-06-20T13:05:00',
        category: 'Health & Fitness',
        private: true,
        userId: ObjectId('53a4dd887c6dc30000bee3af')
      }, function() {
        db.events.save({
          title: 'Have Sex',
          allDay: false,
          start: '2014-06-22T16:00:00',
          end: '2014-06-22T18:45:00',
          category: 'Recreation',
          private: false,
          userId: ObjectId('53a4dd887c6dc30000bee3ae')
        }, function() {
          db.events.save({
            title: 'Sleep',
            allDay: false,
            start: '2014-06-23T12:00:00',
            end: '2014-06-20T13:00:00',
            category: 'Health & Fitness',
            private: true,
            userId: ObjectId('53a4dd887c6dc30000bee3ae')
          }, function() {
            done();
          });
        });
      });
    });
  });
}