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
    	if (ev.private && ev.userId.toString() !== req.user._id.toString()){
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