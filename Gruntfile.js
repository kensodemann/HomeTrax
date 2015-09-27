/*jshint node: true */

'use strict';

module.exports = function(grunt) {
  var componentPaths = require('./conf/component-paths');

  var paths = {
    css: [
      componentPaths.css.angularMotion.dev,
      componentPaths.css.bootstrapAdditions.dev,
      componentPaths.css.fullcalendar.dev
    ],
    cssRelease: [
      componentPaths.css.angularMotion.release,
      componentPaths.css.bootstrapAdditions.release,
      componentPaths.css.fullcalendar.release
    ],
    lib: [
      componentPaths.lib.jquery.dev,
      componentPaths.lib.bootstrap.dev,
      componentPaths.lib.toastr.dev,
      componentPaths.lib.angular.dev,
      componentPaths.lib.angularLocalStorage.dev,
      componentPaths.lib.angularMessages.dev,
      componentPaths.lib.angularResource.dev,
      componentPaths.lib.angularRoute.dev,
      componentPaths.lib.angularStrap.dev,
      componentPaths.lib.angularStrapTpl.dev,
      componentPaths.lib.moment.dev,
      componentPaths.lib.angularAnimate.dev
    ],
    libRelease: [
      componentPaths.lib.jquery.release,
      componentPaths.lib.bootstrap.release,
      componentPaths.lib.toastr.release,
      componentPaths.lib.angular.release,
      componentPaths.lib.angularLocalStorage.release,
      componentPaths.lib.angularMessages.release,
      componentPaths.lib.angularResource.release,
      componentPaths.lib.angularRoute.release,
      componentPaths.lib.angularStrap.release,
      componentPaths.lib.angularStrapTpl.release,
      componentPaths.lib.moment.release,
      componentPaths.lib.angularAnimate.release
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
      dev: {
        options: {
          context: {
            DEBUG: true
          }
        },
        files: {
          'src/app/common/core/config.js': 'src/preprocessedSources/config.js'
        }
      },
      dist: {
        files: {
          'src/app/common/core/config.js': 'src/preprocessedSources/config.js'
        }
      }
    },

    concat: {
      css: {
        src: paths.css,
        dest: 'www/libs.css'
      },
      cssRelease: {
        src: paths.cssRelease,
        dest: 'www/libs.css'
      },
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
          'src/index.html',
          'src/preprocessedSources/config.js',
          '!src/app/common/core/config.js',
          'test/**/*.js'],
        tasks: ['default']
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
  grunt.registerTask('default', [
    'clean',
    'karma',
    'jshint',
    'jscs',
    'copy',
    'preprocess:dev',
    'sass',
    'concat:css',
    'concat:lib',
    'concat:homeTrax',
    'ngAnnotate'
  ]);
  grunt.registerTask('build', ['openShiftBuild', 'karma', 'jshint']);
  grunt.registerTask('openShiftBuild', [
    'clean',
    'copy',
    'preprocess:dist',
    'sass',
    'concat:cssRelease',
    'concat:libRelease',
    'concat:homeTrax',
    'ngAnnotate',
    'cssmin',
    'uglify'
  ]);
  grunt.registerTask('dev', ['default', 'watch']);
};
