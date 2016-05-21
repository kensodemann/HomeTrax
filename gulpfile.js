/* jshint node: true */

var gulp = require('gulp');
var gutil = require('gulp-util');

var componentPaths = require('./conf/component-paths');
var concat = require('gulp-concat');
var copy = require('gulp-copy');
var del = require('del');
var minifyCss = require('gulp-minify-css');
var preprocess = require('gulp-preprocess');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  fonts: {
    fontAwesome: componentPaths.fonts.fontAwesome + '/**/*',
    bootstrap: componentPaths.fonts.bootstrap + '/**/*'
  },
  images: [
    componentPaths.src + '/img/**/*'
  ],
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
  ],
  main: componentPaths.src + '/main.js',
  package: 'package.json',
  sass: [
    componentPaths.homeTraxSccs
  ],
  src: [
    componentPaths.src + '/app/**/module.js',
    componentPaths.src + '/app/app.js',
    componentPaths.src + '/app/**/*.js',
    '!' + componentPaths.src + '/app/**/*.spec.js'
  ],
  views: [
    componentPaths.src + '/**/*.html'
  ],
  watch: [
    componentPaths.src + '/**/*.scss',
    componentPaths.src + '/**/*.js',
    componentPaths.src + '/**/*.html'
  ]
};

function isReleaseBuild() {
  return gutil.env.type === 'release';
}

function useCloud9() {
  return gutil.env.dataSource === 'c9';
}

function useOpenShift() {
  return gutil.env.dataSource === 'openshift';
}

function getBuildContext() {
  var build = {
    context: {}
  };

  if (isReleaseBuild()) {
    build.context.RELEASE = true;
  } else {
    build.context.DEVELOPMENT = true;
  }

  if (useCloud9()) {
    build.context.CLOUD9 = true;
  } else if (useOpenShift()) {
    build.context.OPENSHIFT = true;
  } else {
    build.context.LOCAL = true;
  }

  return build;
}

// Quality Tasks (linting, testing, etc)
gulp.task('deleteLintLog', function(done) {
  del(['jshint-output.log']).then(function() {
    done();
  });
});

gulp.task('lint', ['deleteLintLog', 'clean'], function() {
  var jshint = require('gulp-jshint');
  return gulp
    .src(__dirname + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('gulp-jshint-file-reporter'));
});

gulp.task('style', ['clean'], function() {
  var jscs = require('gulp-jscs');
  return gulp
    .src(__dirname + '/**/*.js')
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('test', function(done) {
  var Karma = require('karma').Server;
  var karma = new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS'],
    reporters: 'dots'
  }, done);
  karma.start();
});

// Build Tasks
gulp.task('clean', function(done) {
  del(['./www']).then(function() {
    done();
  });
});

gulp.task('copyFonts', ['clean'], function() {
  gulp.src(paths.fonts.bootstrap).pipe(copy('./www/css/fonts', {prefix: 4}));
  gulp.src(paths.fonts.fontAwesome).pipe(copy('./www/css/fonts', {prefix: 3}));
});

gulp.task('copyImages', ['clean'], function() {
  gulp.src(paths.images)
    .pipe(copy('./www/img', {prefix: 2}));
});

gulp.task('copyViews', ['clean'], function() {
  var build = getBuildContext();
  return gulp.src(paths.views)
    .pipe(preprocess(build))
    .pipe(gulp.dest('./www', {prefix: 1}));
});

gulp.task('buildCss', ['clean'], function() {
  var release = gutil.env.type === 'release';
  return gulp
    .src(paths.sass)
    .pipe(sass())
    .pipe(release ? minifyCss({keepSpecialComments: 0}) : gutil.noop())
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('buildJs', ['clean'], function() {
  var annotate = require('gulp-ng-annotate');
  var uglify = require('gulp-uglify');
  var release = isReleaseBuild();
  var build = getBuildContext();

  return gulp
    .src(paths.src)
    .pipe(release ? gutil.noop() : sourcemaps.init())
    .pipe(preprocess(build))
    .pipe(concat('homeTrax.js'))
    .pipe(annotate())
    .pipe(release ? gutil.noop() : sourcemaps.write())
    .pipe(release ? uglify() : gutil.noop())
    .pipe(gulp.dest('./www/'));
});

gulp.task('buildLibs', ['clean'], function() {
  var release = gutil.env.type === 'release';
  return gulp
    .src(gutil.env.type === 'release' ? paths.libRelease : paths.lib)
    .pipe(release ? gutil.noop() : sourcemaps.init())
    .pipe(concat('libs.js'))
    .pipe(release ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest('./www/'));
});

// End user tasks
gulp.task('default', ['lint', 'style', 'test', 'buildCss', 'buildJs', 'buildLibs', 'copyFonts', 'copyImages', 'copyViews']);

gulp.task('dev', ['default'], function() {
  return gulp.watch(paths.watch, ['default']);
});
