var db = require('./database');
var encryption = require('../services/encryption');

// NOTE: this is mostly just for use in development.  Some of this may stay,
//       but most of it should be removed before the first real realease.

function createDefaultUsers() {
  db.users.find(function(err, users) {
    if (users.length === 0) {
      var salt = encryption.createSalt();
      var hash = encryption.hash(salt, 'ken');
      db.users.save({
        firstName: 'Ken',
        lastName: 'Sodemann',
        username: 'ken',
        salt: salt,
        hashedPassword: hash,
        roles: ['admin']
      });
      salt = encryption.createSalt();
      hash = encryption.hash(salt, 'lisa');
      db.users.save({
        firstName: 'Lisa',
        lastName: 'Sodemann',
        username: 'lisa',
        salt: salt,
        hashedPassword: hash,
        roles: []
      });
    }
  });
};

module.exports = function() {
  createDefaultUsers();
}