'use strict';

var express = require('express');
var morgan = require('morgan');
var serveStatic = require('serve-static');

module.exports = function(app, config) {
  app.use(morgan('dev'));
  app.use(serveStatic(config.rootPath + '/public'));
};