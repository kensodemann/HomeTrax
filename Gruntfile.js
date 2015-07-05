'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Housekeeping
    clean: ["public/dist", "./public/style/*.css*"],

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

    // Build
    sass: {
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.css': 'public/style/homeApp.scss'
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
          'public/index.html': 'public/index.tpl.html'
        }
      },
      dist: {
        files: {
          'public/index.html': 'public/index.tpl.html'
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
          'public/css/**/*.scss',
          'public/index.tpl.html',
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
