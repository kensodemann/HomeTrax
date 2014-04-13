var express = require('express');
var fs = require('fs');
var config = require('./config/config');
var db = require('./config/database');

var ServerApp = function() {
  var self = this;
  var mongoMessage = "I am not ready yet!";

  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };
  };


  /*
   * Walking Skel code that is just used to get the mongo message
   */
  self.getMongoMessage = function() {
    db.message.findOne(function(err, item) {
      if (err) throw err;
      mongoMessage = item.text;
    });
  };


  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig) {
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating the app ...',
        Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
  };


  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function() {
    //  Process on exit and signals.
    process.on('exit', function() {
      self.terminator();
    });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() {
        self.terminator(element);
      });
    });
  };


  /*  ================================================================  */
  /*  App server functions (main app logic here).                       */
  /*  ================================================================  */

  /**
   *  Create the routing table entries + handlers for the application.
   *
   *  TODO: This code is not going to work long term, so remove it in favor
   *        of a strategy similar to the MEAN stack sample.
   */
  self.createRoutes = function() {
    self.routes = {};

    self.routes['/asciimo'] = function(req, res) {
      var link = "http://i.imgur.com/kmbjB.png";
      res.send("<html><body><img src='" + link + "'></body></html>");
    };

    self.routes['/partials/*'] = function(req, res) {
      res.render('../../public/app/' + req.params);
    };

    self.routes['*'] = function(req, res) {
      res.render('index', {
        mongoMessage: mongoMessage
      });
    };
  };


  self.initializeServer = function() {
    self.createRoutes();
    self.app = express();

    require('./config/express')(self.app, config);

    //  Add handlers for the app (from the routes).
    for (var r in self.routes) {
      self.app.get(r, redirectSec, self.routes[r]);
    }
  };

  function redirectSec(req, res, next) {
    if (req.headers['x-forwarded-proto'] == 'http') {
      res.redirect('https://' + req.headers.host + req.path);
    } else {
      return next();
    }
  }


  self.initialize = function() {
    self.setupVariables();
    self.getMongoMessage();
    self.setupTerminationHandlers();

    require('./config/passport')();
    require('./config/initialData')();

    self.initializeServer();
  };


  self.start = function() {
    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
        Date(Date.now()), self.ipaddress, self.port);
    });
  };

};

module.exports = ServerApp;