'use strict';

var error = require('../services/error');
var fs = require("fs");

module.exports.get = function(req, res) {
  fs.readFile("./server/data/versions.json", "utf8", function(err, data) {
    if (err) {
      return error.send(err, res);
    }
    var output = JSON.parse(data);
    res.status(200).json(output);
  });
};