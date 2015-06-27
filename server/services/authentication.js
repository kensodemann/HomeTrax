'use strict';

var passport = require('passport');
var encryption = require('./encryption');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

module.exports.passwordIsValid = function(user, enteredPassword) {
  var hashedPassword = encryption.hash(user.salt, enteredPassword);
  return user.hashedPassword === hashedPassword;
};

exports.authenticate = function(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  var auth = passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.send({
        success: false
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      var token = jwt.sign(user, secret.jwtCertificate);
      res.send({
        success: true,
        user: user,
        token: token
      });
    });
  });
  auth(req, res, next);
};

exports.requiresApiLogin = function(req, res, next) {
  if (userIsAuthenticated(req)) {
    next();
  } else {
    res.status(403);
    res.end();
  }
};

exports.requiresRole = function(role) {
  return function(req, res, next) {
    if (userIsAuthenticated(req) && userIsInRole(req, role)) {
      next();
    } else {
      res.status(403);
      res.end();
    }
  };
};

exports.requiresRoleOrIsCurrentUser = function(role) {
  return function(req, res, next) {
    if (userIsAuthenticated(req) && (userIsInRole(req, role) || req.user._id == req.params.id)) {
      next();
    } else {
      res.status(403);
      res.end();
    }
  };
};

function userIsAuthenticated(req) {
  var token = getAuthToken(req);
  try {
    req.user = jwt.verify(token, secret.jwtCertificate);
  } catch (err) {
    return false;
  }
  return true;
}

function getAuthToken(req) {
  if (!req.headers.authorization) {
    return undefined;
  }
  return req.headers.authorization.split(' ')[1];
}

function userIsInRole(req, role) {
  return req.user.roles.indexOf(role) !== -1;
}