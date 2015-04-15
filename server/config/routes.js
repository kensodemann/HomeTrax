'use strict';

var authentication = require('../services/authentication');
var redirect = require('../services/redirect');

module.exports = function(app) {
  require('../repositories/accounts')(app);
  require('../repositories/eventCategories')(app);
  require('../repositories/events')(app);
  require('../repositories/households')(app);
  require('../repositories/users')(app);
  require('../repositories/versions')(app);

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