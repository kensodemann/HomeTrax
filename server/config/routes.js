'use strict';

var authentication = require('../services/authentication');

var accounts = require('../repositories/accounts');
var events = require('../repositories/events');
var eventCategories = require('../repositories/eventCategories');
var households = require('../repositories/households');
var users = require('../repositories/users');
var versions = require('../repositories/versions');

function redirectToHttps(req, res, next) {
  if (req.headers['x-forwarded-proto'] == 'http') {
    res.redirect('https://' + req.headers.host + req.path);
  } else {
    return next();
  }
}

module.exports = function(app) {
  app.get('/api/accounts', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {accounts.get(req, res);});
  app.get('/api/accounts/:id', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {accounts.getOne(req, res);});
  app.post('/api/accounts/:id?', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {accounts.save(req, res);});
  app.delete('/api/accounts/:id', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {accounts.remove(req, res);});

  app.get('/api/events', redirectToHttps, authentication.requiresApiLogin, function(req, res) {events.get(req, res);});
  app.post('/api/events/:id?', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {events.save(req, res);});
  app.delete('/api/events/:id', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {events.remove(req, res);});

  app.get('/api/eventCategories', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {eventCategories.get(req, res);});
  app.post('/api/eventCategories/:id?', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {eventCategories.save(req, res);});

  app.get('/api/households', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {households.get(req, res);});
  app.post('/api/households/:id?', redirectToHttps, authentication.requiresApiLogin,
    function(req, res) {households.save(req, res);});

  app.get('/api/users', redirectToHttps, authentication.requiresRole('admin'),
    function(req, res) {users.get(req, res);});
  app.get('/api/users/:id', redirectToHttps, authentication.requiresRoleOrIsCurrentUser('admin'),
    function(req, res) {users.getById(req, res);});
  app.post('/api/users', authentication.requiresRole('admin'), function(req, res) {users.add(req, res);});
  app.put('/api/users/:id', authentication.requiresRoleOrIsCurrentUser('admin'),
    function(req, res) {users.update(req, res);});

  app.put('/api/changepassword/:id', authentication.requiresRoleOrIsCurrentUser('admin'),
    function(req, res) {users.changePassword(req, res);});

  app.get('/api/versions', redirectToHttps, function(req, res) {versions.get(req, res);});

  app.post('/login', redirectToHttps, function(req, res) {authentication.authenticate(req, res);});
  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });

  app.get('/partials/*', redirectToHttps, function(req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.get('*', redirectToHttps, function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
};