'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var eventCategoriesController = require('../../../server/repositories/eventCategories');
var db = require('../../../server/config/database');
var ObjectId = require('mongojs').ObjectId;

describe('eventCategories Controller', function() {
  var myFavoriteCategory;

  beforeEach(function(done) {
    loadData(done);
  });

  afterEach(function(done) {
    removeData(done);
  });

  it('exists', function() {
    expect(eventCategoriesController).to.not.be.undefined;
    expect(eventCategoriesController).to.not.be.null;
  });


  describe('get', function() {
    it('returns all event categories', function(done) {
      eventCategoriesController.get({}, {
        send: function(eventCats) {
          expect(eventCats.length).to.equal(4);
          eventCats.forEach(function(e, idx) {
            expect(e.name).to.be.a('String');
          });
          done();
        }
      });
    });
  });


  describe('save', function() {
    it('Adds new data to the event categories collection', function(done) {
      var req = {
        body: {
          name: 'whatever'
        }
      };
      eventCategoriesController.save(req, {
        send: function(e) {
          expect(e._id).to.not.be.undefined;
          db.eventCategories.count(function(err, cnt) {
            expect(cnt).to.equal(5);
            done();
          });
        }
      });
    });

    it('Saves changes to existing items', function(done) {
      var req = {
        body: myFavoriteCategory
      };
      myFavoriteCategory.name = 'some other name';
      eventCategoriesController.save(req, {
        send: function(e) {
          db.eventCategories.findOne({
            _id: myFavoriteCategory._id
          }, function(err, cat) {
            expect(cat.name).to.equal('some other name');
            db.eventCategories.count(function(err, cnt) {
              expect(cnt).to.equal(4);
              done();
            });
          });
        }
      });
    });
  });


  function loadData(done) {
    db.eventCategories.remove(function() {
      db.eventCategories.insert([{
        name: 'Test'
      }, {
        name: 'Health & Fitness'
      }, {
        name: 'Sexual Relations'
      }, {
        name: 'Family & Friends'
      }], function(error, value) {
        db.eventCategories.findOne({
          name: 'Sexual Relations'
        }, function(err, e) {
          myFavoriteCategory = e;
          done();
        });
      });
    });
  }

  function removeData(done) {
    db.eventCategories.remove(function() {
      done();
    });
  }
});