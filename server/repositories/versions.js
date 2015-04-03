'use strict';

var fs = require("fs");

module.exports.get = function(req, res) {
  fs.readFile("./server/data/versions.json", "utf8", function(err, data) {
    if (err) {
      return sendError(err, res);
    }
    var output = JSON.parse(data);
    res.status(200).json(output);
  });
};

function sendError(err, res) {
  res.status(400);
  res.send({
    reason: err.toString()
  });
}