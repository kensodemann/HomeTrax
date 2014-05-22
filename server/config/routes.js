var authentication = require('../services/authentication');
var usersController = require('../controllers/users');

function redirectSec(req, res, next) {
  if (req.headers['x-forwarded-proto'] == 'http') {
    res.redirect('https://' + req.headers.host + req.path);
  } else {
    return next();
  }
}

module.exports = function(app) {
  app.get('/api/users', redirectSec, authentication.requiresRole('admin'), usersController.getUsers);
  app.get('/api/users/:id', redirectSec, authentication.requiresRoleOrIsCurrentUser('admin'), usersController.getUserById);
  app.post('/api/users', authentication.requiresRole('admin'), usersController.addUser);
  app.put('/api/users/:id', authentication.requiresRoleOrIsCurrentUser('admin'), usersController.updateUser);

  app.post('/login', redirectSec, authentication.authenticate);
  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });

  app.get('/partials/*', redirectSec, function(req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.get('*', redirectSec, function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
}