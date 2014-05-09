var db = require('../config/database');

module.exports.getUsers = function(req, res) {
  db.users.find({}, function(err, users) {
    res.send(users);
  });
};