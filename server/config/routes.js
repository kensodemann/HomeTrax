'use strict';

var config = require('./config');

module.exports = function(app) {
  app.all('/*', function(req, res) {
    res.sendFile(config.rootPath + '/www/index.html');
  });
};