'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Housekeeping
    clean: ["build"],

    // Code Quality Checks
    jshint: {
      client: {
        src: ['public/app/**/*.js'],
        options: {
          globals: {
            '$': true,
            angular: true,
            inject: true,
            moment: true
          }
        }
      }
    },

    // Tests
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: 'dots'
      }
    },
    mochaTest: {
      options: {
        reporter: 'min'
      },
      src: ['test/server/**/*Spec.js']
    },

    // Build
    concat: {
      dist: {
        src: ['public/app/**/*.js'],
        dest: 'public/dist/build.js'
      }
    },

    // Grunt functional
    watch: {
      src: {
        files: ['Gruntfile.js',
          'server.js',
          'public/app/**/*.js',
          'server/**/*.js',
          'test/**/*.js'],
        tasks: ['devBuild']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-ng-annotate');

  // Tasks
  grunt.registerTask('default', ['devBuild']);
  grunt.registerTask('openShiftBuild', ['clean']);
  grunt.registerTask('devBuild', ['clean', 'karma', 'mochaTest', 'jshint']);
  grunt.registerTask('dev', ['devBuild', 'watch']);
};