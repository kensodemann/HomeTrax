'use strict';

var authentication = require('../services/authentication');
var redirect = require('../services/redirect');
var users = require('../repositories/users');
var versions = require('../repositories/versions');

module.exports = function(app) {
  require('../repositories/accounts')(app);
  require('../repositories/eventCategories')(app);
  require('../repositories/events')(app);
  require('../repositories/households')(app);

  app.get('/api/users', redirect.toHttps, authentication.requiresRole('admin'),
    function(req, res) {users.get(req, res);});
  app.get('/api/users/:id', redirect.toHttps, authentication.requiresRoleOrIsCurrentUser('admin'),
    function(req, res) {users.getById(req, res);});
  app.post('/api/users', authentication.requiresRole('admin'), function(req, res) {users.add(req, res);});
  app.put('/api/users/:id', authentication.requiresRoleOrIsCurrentUser('admin'),
    function(req, res) {users.update(req, res);});

  app.put('/api/changepassword/:id', authentication.requiresRoleOrIsCurrentUser('admin'),
    function(req, res) {users.changePassword(req, res);});

  app.get('/api/versions', redirect.toHttps, function(req, res) {versions.get(req, res);});

  app.post('/login', redirect.toHttps, function(req, res) {authentication.authenticate(req, res);});
  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });

  app.get('/partials/*', redirect.toHttps, function(req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.get('*', redirect.toHttps, function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
};