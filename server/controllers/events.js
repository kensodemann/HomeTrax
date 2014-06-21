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