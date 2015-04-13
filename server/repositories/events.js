'use strict';

var authentication = require('../services/authentication');
var _ = require('underscore');
var db = require('../config/database');
var ObjectId = require("mongojs").ObjectId;
var redirect = require('../services/redirect');
var RepositoryBase = require('./RepositoryBase');
var util = require('util');

function Events() {
  RepositoryBase.call(this);
  this.collection = db.events;
}

util.inherits(Events, RepositoryBase);

Events.prototype.get = function(req, res) {
  db.events.find({
    $or: [{
      userId: new ObjectId(req.user._id)
    }, {
      private: false
    }, {
      private: null
    }]
  }, function(err, events) {
    res.send(events);
  });
};

Events.prototype.preSaveAction = function(req, done) {
  req.body.userId = new ObjectId(req.user._id);

  for (var p in req.body) {
    if (req.body.hasOwnProperty(p)) {
      if (p.match(/^_.*/) && p !== '_id') {
        delete req.body[p];
      }
    }
  }

  done(null);
};

Events.prototype.preCheckStatus = function(req, done) {
  var my = this;

  if (!req.params || !req.params.id) {
    done(null, 200);
  }
  else {
    var criteria = _.extend({}, my.criteria);
    criteria._id = new ObjectId(req.params.id);
    my.collection.findOne(criteria, function(err, item) {
      var status = 404;
      if (!!item) {
        status = item.userId.toString() !== req.user._id.toString() ? 403 : 200;
      }
      done(err, status);
    });
  }
};

Events.prototype.validate = function(req, done) {
  if (!req.body) {
    return done(null, new Error('Request is empty.'));
  }
  if (!req.body.title) {
    return done(null, new Error('Events must have a title.'));
  }
  if (!req.body.category) {
    return done(null, new Error('Events must have a category.'));
  }
  if (!req.body.start) {
    return done(null, new Error('Events must have a start date.'));
  }
  if (req.body.end && req.body.end < req.body.start) {
    return done(null, new Error('Start date must be on or before the end date.'));
  }
  done(null, null);
};

var repository = new Events();

module.exports = function(app){
  app.get('/api/events', redirect.toHttps, authentication.requiresApiLogin, function(req, res) {repository.get(req, res);});
  app.post('/api/events/:id?', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {repository.save(req, res);});
  app.delete('/api/events/:id', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {repository.remove(req, res);});
};