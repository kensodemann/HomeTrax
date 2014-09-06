'use strict';

var db = require('../config/database');
var ObjectId = require("mongojs").ObjectId;

module.exports.get = function (req, res){
  db.events.find({
    $or: [
      {
        userId: ObjectId(req.user._id)
      },
      {
        private: false
      }
    ]
  }, function (err, events){
    res.send(events);
  });
};

module.exports.getById = function (req, res){
  db.events.findOne({
    _id: ObjectId(req.params.id)
  }, function (err, ev){
    if (ev) {
      if (ev.private && ev.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        return res.send();
      }
      res.send(ev);
    } else {
      res.status(404);
      res.send();
    }
  });
};

module.exports.save = function (req, res){
  var e = req.body;
  assignIdFromRequest(req, e);
  assignUserId(e, req);
  if (userIsAuthorized(e.userId, req, res) && isValid(e, res)) {
    db.events.save(e, function (err, ev){
      res.send(ev);
    });
  }
};

module.exports.remove = function (req, res){
  db.events.findOne({
    _id: ObjectId(req.params.id)
  }, function (err, e){
    if (!e) {
      res.status(404);
      return res.send();
    }

    if (userIsAuthorized(e.userId, req, res)) {
      db.events.remove({
        _id: ObjectId(req.params.id)
      }, true, function (err, e){
        res.send(e);
      });
    }
  });
};

function assignIdFromRequest(req, e){
  if (req.params && req.params.id) {
    e._id = ObjectId(req.params.id);
  }
}

function assignUserId(e, req){
  if (!e.userId) {
    e.userId = ObjectId(req.user._id);
  } else {
    e.userId = ObjectId(e.userId);
  }
}

function userIsAuthorized(userId, req, res){
  if (userId.toString() !== req.user._id.toString()) {
    res.status(403);
    res.send();
    return false;
  }
  return true;
}

function isValid(evt, res){
  if(!evt.title){
    sendError(new Error('Events must have a title.'), res);
    return false;
  }
  if(!evt.start){
    sendError(new Error('Events must have a start date.'), res);
    return false;
  }
  if(evt.end && evt.end < evt.start){
    sendError(new Error('Start date must be on or before the end date.'), res);
    return false;
  }
  return true;
}

function sendError(err, res){
  res.status(400);
  res.send({
    reason: err.toString()
  });
}