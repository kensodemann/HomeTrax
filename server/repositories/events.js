'use strict';

var db = require('../config/database');
var Q = require('q');
var ObjectId = require("mongojs").ObjectId;

module.exports.get = function(req, res) {
  db.events.find({
    $or: [
      {userId: new ObjectId(req.user._id)},
      {private: false},
      {private: null}
    ]
  }, function(err, events) {
    res.send(events);
  });
};

module.exports.save = function(req, res) {
  var e = req.body;
  assignIdFromRequest(req, e);
  assignUserId(e, req);
  if (isValid(e, res)) {
    determineIfActionIsValid(req).done(yes, no);
  }

  function yes() {
    db.events.save(e, function(err, ev) {
      if (!req.params || !req.params.id) {
        res.status(201);
      }
      res.send(ev);
    });
  }

  function no(stat) {
    res.status(stat);
    res.end();
  }
};

module.exports.remove = function(req, res) {
  determineIfActionIsValid(req).done(yes, no);

  function yes() {
    db.events.remove({
      _id: new ObjectId(req.params.id)
    }, true, function(err, e) {
      res.send(e);
    });
  }

  function no(stat){
    res.status(stat);
    res.end();
  }
};

function assignIdFromRequest(req, e) {
  if (req.params && req.params.id) {
    e._id = new ObjectId(req.params.id);
  }
}

function assignUserId(e, req) {
  e.userId = new ObjectId(req.user._id);
}

function determineIfActionIsValid(req) {
  var dfd = Q.defer();
  if (!req.params || !req.params.id) {
    dfd.resolve(true);
  } else {
    db.events.findOne({_id: new ObjectId(req.params.id)}, function(err, evt) {
      if (!evt) {
        return dfd.reject(404);
      }
      if (evt.userId.toString() !== req.user._id.toString()) {
        return dfd.reject(403);
      }
      dfd.resolve(true);
    });
  }

  return dfd.promise;
}

function isValid(evt, res) {
  if (!evt.title) {
    sendError(new Error('Events must have a title.'), res);
    return false;
  }
  if (!evt.category) {
    sendError(new Error('Events must have a category.'), res);
    return false;
  }
  if (!evt.start) {
    sendError(new Error('Events must have a start date.'), res);
    return false;
  }
  if (evt.end && evt.end < evt.start) {
    sendError(new Error('Start date must be on or before the end date.'), res);
    return false;
  }
  return true;
}

function sendError(err, res) {
  res.status(400);
  res.send({
    reason: err.toString()
  });
}