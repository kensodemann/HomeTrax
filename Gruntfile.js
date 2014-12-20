'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Housekeeping
    clean: ["public/dist", "server/includes/layout.jade", "server/includes/scripts.jade", "public/app/**/*.html",
      "server/**/*.html"],

    // Code Quality Checks
    jshint: {
      options: {
        strict: true
      },
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
      },
      server: {
        src: ['server/**/*.js', 'Gruntfile.js'],
        options: {
          node: true
        }
      },
      clientTest: {
        src: ['test/client/**/*.js'],
        options: {
          expr: true,
          globals: {
            afterEach: true,
            angular: true,
            beforeEach: true,
            describe: true,
            expect: true,
            inject: true,
            it: true,
            module: true,
            sinon: true
          }
        }
      },
      serverTest: {
        src: ['test/server/**/*.js'],
        options: {
          expr: true,
          globals: {
            afterEach: true,
            beforeEach: true,
            describe: true,
            it: true
          },
          node: true
        }
      }
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
    mochaTest: {
      options: {
        reporter: 'min'
      },
      src: ['test/server/**/*Spec.js']
    },

    // Build
    preprocess: {
      dev: {
        options: {
          context: {
            DEBUG: true
          }
        },
        files: {
          'server/includes/scripts.jade': 'server/includes/scripts.tpl.jade',
          'server/includes/layout.jade': 'server/includes/layout.tpl.jade'
        }
      },
      dist: {
        files: {
          'server/includes/scripts.jade': 'server/includes/scripts.tpl.jade',
          'server/includes/layout.jade': 'server/includes/layout.tpl.jade'
        }
      }
    },
    concat: {
      js: {
        options: {
          sourceMap: true
        },
        src: ['public/app/app.js', 'public/**/app.*.js', 'public/app/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      },
      css: {
        src: ['public/css/**/*.css'],
        dest: 'public/dist/<%= pkg.name %>.css'
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.js': ['public/dist/<%= pkg.name %>.js']
        }
      }
    },
    uglify: {
      dist: {
        src: 'public/dist/<%= pkg.name %>.js',
        dest: 'public/dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.min.css': ['public/dist/<%= pkg.name %>.css']
        }
      }
    },

    // Grunt functional
    watch: {
      src: {
        files: ['Gruntfile.js',
          'server.js',
          'public/app/**/*.js',
          'server/**/*.js',
          'server/includes/layout.tpl.jade',
          'server/includes/scripts.tpl.jade',
          'test/**/*.js'],
        tasks: ['devBuild']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-preprocess');

  // Tasks
  grunt.registerTask('default', ['openShiftBuild', 'karma', 'mochaTest', 'jshint']);
  grunt.registerTask('openShiftBuild', ['clean', 'preprocess:dist', 'concat', 'ngAnnotate', 'cssmin', 'uglify']);
  grunt.registerTask('devBuild', ['clean', 'preprocess:dev', 'karma', 'mochaTest', 'jshint', 'concat']);
  grunt.registerTask('dev', ['devBuild', 'watch']);
};
