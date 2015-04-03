'use strict';

var authentication = require('../services/authentication');
var users = require('../repositories/users');
var events = require('../repositories/events');
var eventCategories = require('../repositories/eventCategories');
var households = require('../repositories/households');
var versions = require('../repositories/versions');

function redirectToHttps(req, res, next) {
  if (req.headers['x-forwarded-proto'] == 'http') {
    res.redirect('https://' + req.headers.host + req.path);
  } else {
    return next();
  }
}

module.exports = function(app) {
  app.get('/api/events', redirectToHttps, authentication.requiresApiLogin, events.get);
  app.post('/api/events/:id?', redirectToHttps, authentication.requiresApiLogin, events.save);
  app.delete('/api/events/:id', redirectToHttps, authentication.requiresApiLogin, events.remove);

  app.get('/api/eventCategories', redirectToHttps, authentication.requiresApiLogin, eventCategories.get);
  app.post('/api/eventCategories/:id?', redirectToHttps, authentication.requiresApiLogin, eventCategories.save);

  app.get('/api/households', redirectToHttps, authentication.requiresApiLogin, households.get);
  app.post('/api/households/:id?', redirectToHttps, authentication.requiresApiLogin, households.save);

  app.get('/api/users', redirectToHttps, authentication.requiresRole('admin'), users.get);
  app.get('/api/users/:id', redirectToHttps, authentication.requiresRoleOrIsCurrentUser('admin'), users.getById);
  app.post('/api/users', authentication.requiresRole('admin'), users.add);
  app.put('/api/users/:id', authentication.requiresRoleOrIsCurrentUser('admin'), users.update);

  app.put('/api/changepassword/:id', authentication.requiresRoleOrIsCurrentUser('admin'), users.changePassword);

  app.get('/api/versions', redirectToHttps, versions.get);

  app.post('/login', redirectToHttps, authentication.authenticate);
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