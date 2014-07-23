'use strict'

var authentication = require('../services/authentication');
var users = require('../controllers/users');
var events = require('../controllers/events');

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

  app.get('/api/users', redirectToHttps, authentication.requiresRole('admin'), users.get);
  app.get('/api/users/:id', redirectToHttps, authentication.requiresRoleOrIsCurrentUser('admin'), users.getById);
  app.post('/api/users', authentication.requiresRole('admin'), users.add);
  app.put('/api/users/:id', authentication.requiresRoleOrIsCurrentUser('admin'), users.update);

  app.put('/api/changepassword/:id', authentication.requiresRoleOrIsCurrentUser('admin'), users.changePassword);

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
}