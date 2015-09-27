/*jshint node: true */

module.exports = function(config) {
  var componentPaths = require('./conf/component-paths');

  config.set({
    basePath: '',

    frameworks: ['mocha', 'chai', 'sinon-chai'],

    files: [
      componentPaths.lib.jquery.dev,
      componentPaths.lib.angular.dev,
      componentPaths.lib.angularResource.dev,
      componentPaths.lib.angularRoute.dev,
      componentPaths.lib.angularStrap.dev,
      componentPaths.lib.angularMocks.dev,
      componentPaths.lib.moment.dev,

      'test/test-app.js',
      'src/app/**/module.js',
      'src/app/**/*.js',
      'src/app/**/*.html',
      'test/**/*Spec.js'
    ],

    exclude: [
      'src/app/app.js'
    ],

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/'
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false
  });
};