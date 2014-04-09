var express = require('express');

module.exports = function(app, config) {
  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');

    // app.use(stylus.middleware({
    //   src: config.rootPath + '/public',
    //   compile: compile
    // }));

    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    
    // app.use(express.session({
    //   secret: 'multi vision unicorns'
    // }));
    
    // app.use(passport.initialize());
    // app.use(passport.session());

    app.use(express.static(config.rootPath + '/public'));
  });
}