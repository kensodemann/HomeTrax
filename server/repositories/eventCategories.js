'use strict';

var db = require('../config/database');
var ObjectId = require("mongojs").ObjectId;

module.exports.get = function(req, res) {
  db.eventCategories.find(function(err, cats) {
    res.send(cats);
  });
};

module.exports.save = function(req, res) {
  var cat = req.body;
  var status = 201;
  if (req.params && req.params.id) {
    cat._id = new ObjectId(req.params.id);
    status = 200;
  }
  db.eventCategories.save(req.body, function(err, cat) {
    res.status(status);
    res.send(cat);
  });
};