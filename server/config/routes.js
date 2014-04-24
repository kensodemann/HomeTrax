var authentication = require('../services/authentication');
var db = require('./database');

function redirectSec(req, res, next) {
  if (req.headers['x-forwarded-proto'] == 'http') {
    res.redirect('https://' + req.headers.host + req.path);
  } else {
    return next();
  }
}


module.exports = function(app) {
  // app.get('/api/users', auth.requiresRole('admin'), function(req, res) {
  //   User.find({}).exec(function(err, collection) {
  //     res.send(collection);
  //   })
  // });

  app.post('/login', redirectSec, authentication.authenticate);

  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });

  app.get('/partials/*', redirectSec, function(req, res) {
    res.render('../../public/app/' + req.params);
  });

  app.get('*', redirectSec, function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
}