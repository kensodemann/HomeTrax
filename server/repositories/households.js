'use strict';

var db = require('../config/database');
var ObjectId = require("mongojs").ObjectId;

module.exports.get = function(req, res) {
  db.households.find(function(err, h) {
    res.send(h);
  });
};

module.exports.save = function(req, res) {};