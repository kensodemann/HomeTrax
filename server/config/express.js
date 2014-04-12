var express = require('express');
var stylus = require('stylus');

function compile(str, path) {
  return stylus(str).set('filename', path);
}

module.exports = function(app, config) {
  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');

    app.use(stylus.middleware({
      src: config.rootPath + '/public',
      compile: compile
    }));

    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    
    // app.use(express.session({
    //   secret: 'HomeTraxer Secret PopCorn'
    // }));
    
    // app.use(passport.initialize());
    // app.use(passport.session());

    app.use(express.static(config.rootPath + '/public'));
  });
}