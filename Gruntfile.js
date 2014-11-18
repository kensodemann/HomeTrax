'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        expand: true,
        cwd: 'public',
        src: 'app/**/*.js',
        dest: 'build/js'
      }
    },
    clean: ["build/js/**/*.js", "public/app/**/*.html"],
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
      devl:{
        configFile: 'karma.conf.js',
        singleRun: false,
        browsers: ['PhantomJS']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Tasks
  grunt.registerTask('default', ['clean', 'uglify']);
  grunt.registerTask('dev', ['clean', 'karma:devl']);
};