'use strict'

var db = require('../config/database');
var ObjectId = require("mongojs").ObjectId;

module.exports.get = function(req, res) {
  db.eventCategories.find(function(err, cats) {
    res.send(cats);
  });
};

module.exports.save = function(req, res) {
  db.eventCategories.save(req.body, function(err, cat) {
    res.send(cat);
  });
};