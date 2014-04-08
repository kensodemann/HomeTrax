module.exports = function(app, config) {
  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');
  });
}