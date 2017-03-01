var gulp = require('gulp');
var compass = require('gulp-compass');
var browserSync = require('browser-sync');

gulp.task('app-css', function() {
  return gulp.src(paths.appScss + '/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      sass: paths.appScss,
      css: paths.appCss
    }))
    .on('error', errorAlert)
    .pipe(gulp.dest(paths.appCss))
    .pipe(browserSync.stream());

});

gulp.task('game-css', function() {
  return gulp.src(paths.gameScss + '/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      sass: paths.gameScss,
      css: paths.gameCss
    }))
    .on('error', errorAlert)
    .pipe(gulp.dest(paths.gameCss))
    .pipe(browserSync.stream());
});
