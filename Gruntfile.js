/*jshint node: true */

'use strict';

module.exports = function(grunt) {
  var componentPaths = require('./conf/component-paths');

  var paths = {
    lib: [
      componentPaths.lib.jquery.dev,
      componentPaths.lib.bootstrap.dev,
      componentPaths.lib.toastr.dev,
      componentPaths.lib.angular.dev,
      componentPaths.lib.angularLocalStorage.dev,
      componentPaths.lib.angularMessages.dev,
      componentPaths.lib.angularResource.dev,
      componentPaths.lib.angularUiRouter.dev,
      componentPaths.lib.angularBootstrapUI.dev,
      componentPaths.lib.moment.dev,
      componentPaths.lib.angularAnimate.dev,
      componentPaths.lib.underscore.dev
    ],
    libRelease: [
      componentPaths.lib.jquery.release,
      componentPaths.lib.bootstrap.release,
      componentPaths.lib.toastr.release,
      componentPaths.lib.angular.release,
      componentPaths.lib.angularLocalStorage.release,
      componentPaths.lib.angularMessages.release,
      componentPaths.lib.angularResource.release,
      componentPaths.lib.angularUiRouter.release,
      componentPaths.lib.angularBootstrapUI.release,
      componentPaths.lib.moment.release,
      componentPaths.lib.angularAnimate.release,
      componentPaths.lib.underscore.release
    ]
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Housekeeping
    clean: ['www/'],

    // Code Quality Checks
    jshint: {
      options: {
        strict: true,
        jshintrc: true
      },
      src: ['Gruntfile.js', 'karma.conf.js', 'src/app/**/*.js', 'server/**/*.js', 'test/client/**/*.js']
    },

    jscs: {
      src: '**/*.js',
      options: {
        config: true
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
          'www/<%= pkg.name %>.css': 'src/style/homeApp.scss'
        }
      }
    },

    preprocess: {
      cloud9: {
        options: {
          context: {
            CLOUD9: true
          }
        },
        files: {
          'src/app/common/core/config.js': 'src/preprocessedSources/config.js'
        }
      },
      local: {
        options: {
          context: {
            LOCAL: true
          }
        },
        files: {
          'src/app/common/core/config.js': 'src/preprocessedSources/config.js'
        }
      },
      openShift: {
        options: {
          context: {
            OPENSHIFT: true
          }
        },
        files: {
          'src/app/common/core/config.js': 'src/preprocessedSources/config.js'
        }
      }
    },

    concat: {
      lib: {
        src: paths.lib,
        dest: 'www/libs.js'
      },
      libRelease: {
        src: paths.libRelease,
        dest: 'www/libs.js'
      },
      homeTrax: {
        options: {
          sourceMap: true
        },
        src: ['src/app/app.js', 'src/**/module.js', 'src/app/**/*.js'],
        dest: 'www/<%= pkg.name %>.js'
      }
    },

    copy: {
      bootstrapFonts: {
        expand: true,
        cwd: componentPaths.fonts.bootstrap,
        src: '**/*',
        dest: 'www/fonts'
      },
      fontawesomeFonts: {
        expand: true,
        cwd: componentPaths.fonts.fontAwesome,
        src: '**/*',
        dest: 'www/fonts'
      },
      views: {
        expand: true,
        cwd: 'src/',
        src: ['favicon.ico', 'index.html', 'app/**/*.html'],
        dest: 'www/'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: {
          'www/<%= pkg.name %>.js': ['www/<%= pkg.name %>.js']
        }
      }
    },

    uglify: {
      dist: {
        src: 'www/<%= pkg.name %>.js',
        dest: 'www/<%= pkg.name %>.js'
      }
    },

    cssmin: {
      dist: {
        files: {
          'www/<%= pkg.name %>.css': ['www/<%= pkg.name %>.css']
        }
      }
    },

    // Grunt functional
    watch: {
      src: {
        files: ['Gruntfile.js',
          'server.js',
          'src/app/**/*.js',
          'src/style/**/*.scss',
          'src/**/*.html',
          'src/preprocessedSources/config.js',
          '!src/app/common/core/config.js',
          'test/**/*.js'],
        tasks: ['local']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-preprocess');

  // Tasks
  grunt.registerTask('testAndBuild', [
    'karma',
    'jshint',
    'jscs',
    'copy',
    'sass',
    'concat:lib',
    'concat:homeTrax',
    'ngAnnotate'
  ]);
  grunt.registerTask('default', [
    'clean',
    'preprocess:cloud9',
    'testAndBuild'
  ]);
  grunt.registerTask('local', [
    'clean',
    'preprocess:local',
    'testAndBuild'
  ]);
  grunt.registerTask('build', ['openShiftBuild', 'karma', 'jshint']);
  grunt.registerTask('openShiftBuild', [
    'clean',
    'copy',
    'preprocess:openShift',
    'sass',
    'concat:libRelease',
    'concat:homeTrax',
    'ngAnnotate',
    'cssmin',
    'uglify'
  ]);
  grunt.registerTask('dev', ['local', 'watch']);
};
