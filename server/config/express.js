'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var serveStatic = require('serve-static');
var session = require('express-session');

module.exports = function(app, config) {
  app.set('view engine', 'jade');
  app.set('views', config.rootPath + '/server/views');

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(session({
    secret: 'HomeTraxer Secret PopCorn',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(serveStatic(config.rootPath + '/public'));
};