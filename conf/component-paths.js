/*jshint node: true */

module.exports = {
  bower_components: 'bower_components',
  scss: 'scss/manifests/penta.app.scss',
  css: 'css',
  test: 'test',
  src: 'src',
  lib: {
    jquery: {
      dev: 'bower_components/jquery/dist/jquery.js',
      release: 'bower_components/jquery/dist/jquery.min.js'
    },
    angular: {
      dev: 'bower_components/angular/angular.js',
      release: 'bower_components/angular/angular.min.js'
    },
    angularBootstrap: {
      dev: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      release: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
    },
    angularUiRouter: {
      dev: 'bower_components/angular-ui-router/release/angular-ui-router.js',
      release: 'bower_components/angular-ui-router/release/angular-ui-router.min.js'
    },
    bootstrap: {
      dev: 'bower_components/bootstrap/bootstrap.js',
      release: 'bower_components/bootstrap/bootstrap.min.js'
    },
    angularMessages: {
      dev: 'bower_components/angular-messages/angular-messages.js',
      release: 'bower_components/angular-messages/angular-messages.min.js'
    },
    angularResource: {
      dev: 'bower_components/angular-resource/angular-resource.js',
      release: 'bower_components/angular-resource/angular-resource.min.js'
    },
    angularMocks: {
      dev: 'bower_components/angular-mocks/angular-mocks.js'
    },
    angularUuidService: {
      dev: 'bower_components/angular-uuid-service/angular-uuid-service.js',
      release: 'bower_components/angular-uuid-service/angular-uuid-service.min.js'
    },
    moments: {
      dev: 'bower_components/moment/min/moment-with-locales.js',
      release: 'bower_components/moment/min/moment-with-locales.min.js'
    },
    toastr: {
      dev: 'bower_components/toastr/toastr.js',
      release: 'bower_components/toastr/toastr.min.js'
    },
    underscore: {
      dev: 'bower_components/underscore/underscore.js',
      release: 'bower_components/underscore/underscore-min.js'
    }
  },
  fonts: {
    fontAwesome: 'bower_components/font-awesome/fonts',
    bootstrap: 'bower_components/bootstrap-sass/assets/fonts'
  }
};
