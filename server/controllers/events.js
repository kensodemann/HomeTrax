'use strict'

var db = require('../config/database');
var ObjectId = require("mongojs").ObjectId;

module.exports.get = function(req, res) {
  db.events.find({
    $or: [{
      userId: ObjectId(req.user._id)
    }, {
      private: false
    }]
  }, function(err, events) {
    res.send(events);
  });
};

module.exports.getById = function(req, res) {
  db.events.findOne({
    _id: ObjectId(req.params.id)
  }, function(err, ev) {
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

module.exports.save = function(req, res) {
  var e = req.body;

  if (req.params && req.params.id) {
    e._id = ObjectId(req.params.id);
  }
  if (!e.userId) {
    e.userId = ObjectId(req.user._id);
  }
  if (e.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    return res.send();
  }

  db.events.save(e, function(err, ev) {
    res.send(ev);
  });
};

module.exports.remove = function(req, res) {
  db.events.findOne({
    _id: ObjectId(req.body._id)
  }, function(err, e) {
    if (!e) {
      res.status(404);
      return res.send();
    }

    if (e.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      return res.send();
    }

    db.events.remove({
      _id: req.body._id
    }, true, function(err, e) {
      res.send(e);
    });
  });
}