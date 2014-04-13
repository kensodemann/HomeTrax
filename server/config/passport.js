var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./database');
var authentication = require('../services/authentication')

module.exports = function() {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      db.users.findOne({
          username: username
        },
        function(err, user) {
          if (user && authentication.passwordIsValid(user, password)) {
            return done(null, {
              username: user.username
            });
          } else {
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
    User.findOne({
      _id: id
    }).exec(function(err, user) {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  })

}