'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./database');
var authentication = require('../services/authentication');
var ObjectId = require("mongojs").ObjectId;

module.exports = function() {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      db.users.findOne({
          username: username
        },
        function(err, user) {
          if (user && authentication.passwordIsValid(user, password)) {
            return done(null, {
              _id: user._id,
              username: user.username,
              roles: user.roles,
              color: user.color
            });
          }
          else {
            return done(null, false);
          }
        });
    }
  ));

  passport.serializeUser(function(user, done) {
    if (user) {
      done(null, user._id);
    }
  });

  passport.deserializeUser(function(id, done) {
    db.users.findOne({
      _id: new ObjectId(id)
    }, {
      salt: 0,
      hashedPassword: 0
    }, function(err, user) {
      if (user) {
        return done(null, user);
      }
      else {
        return done(null, false);
      }
    });
  });
};