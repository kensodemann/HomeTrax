'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Housekeeping
    clean: ["www/dist", "./www/style/*.css*", "www/index.html", "www/app/common/core/config.js"],

    // Code Quality Checks
    jshint: {
      options: {
        strict: true,
        jshintrc: true
      },
      src: ['www/app/**/*.js', 'server/**/*.js', 'test/client/**/*.js']
    },

    // Tests
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browserNoActivityTimeout: 30000,
        browsers: ['PhantomJS'],
        reporters: 'dots'
      }
    },

    // Build
    sass: {
      dist: {
        files: {
          'www/dist/<%= pkg.name %>.css': 'www/style/homeApp.scss'
        }
      }
    },

    preprocess: {
      dev: {
        options: {
          context: {
            DEBUG: true
          }
        },
        files: {
          'www/index.html': 'www/preprocessedSources/index.html',
          'www/app/common/core/config.js': 'www/preprocessedSources/config.js'
        }
      },
      dist: {
        files: {
          'www/index.html': 'www/preprocessedSources/index.html',
          'www/app/common/core/config.js': 'www/preprocessedSources/config.js'
        }
      }
    },
    concat: {
      js: {
        options: {
          sourceMap: true
        },
        src: ['www/app/app.js', 'www/**/app.*.js', 'www/app/**/*.js'],
        dest: 'www/dist/<%= pkg.name %>.js'
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: {
          'www/dist/<%= pkg.name %>.js': ['www/dist/<%= pkg.name %>.js']
        }
      }
    },
    uglify: {
      dist: {
        src: 'www/dist/<%= pkg.name %>.js',
        dest: 'www/dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      dist: {
        files: {
          'www/dist/<%= pkg.name %>.min.css': ['www/dist/<%= pkg.name %>.css']
        }
      }
    },

    // Grunt functional
    watch: {
      src: {
        files: ['Gruntfile.js',
          'server.js',
          'www/app/**/*.js',
          'www/css/**/*.scss',
          'www/preprocessedSources/index.html',
          '!www/index.html',
          'www/preprocessedSources/config.js',
          '!www/app/common/core/config.js',
          'test/**/*.js'],
        tasks: ['default']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-preprocess');

  // Tasks
  grunt.registerTask('default', ['clean', 'preprocess:dev', 'sass', 'karma', 'jshint', 'concat']);
  grunt.registerTask('build', ['openShiftBuild', 'karma', 'jshint']);
  grunt.registerTask('openShiftBuild',
    ['clean', 'preprocess:dist', 'sass', 'concat', 'ngAnnotate', 'cssmin', 'uglify']);
  grunt.registerTask('dev', ['default', 'watch']);
};
