var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var serveStatic = require('serve-static');
var session = require('express-session');
var stylus = require('stylus');

function compile(str, path) {
  return stylus(str).set('filename', path);
}

module.exports = function(app, config) {
  app.set('view engine', 'jade');
  app.set('views', config.rootPath + '/server/views');

  app.use(stylus.middleware({
    src: config.rootPath + '/public',
    compile: compile
  }));

  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(cookieParser());

  app.use(session({
    secret: 'HomeTraxer Secret PopCorn'
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(serveStatic(config.rootPath + '/public'));
}