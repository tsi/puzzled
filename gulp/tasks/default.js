var gulp = require('gulp');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

// Default task to be run with `gulp`
// This will run tasks in order, so they can wait for each other to finish.
gulp.task('default', function() {
  runSequence(
    'app-css',
    'game-css',
    'browser-sync',
    function() {
      gulp.watch([paths.appScss + '/*.scss'], ['app-css']);
      gulp.watch([paths.gameScss + '/*.scss'], ['game-css']);
      gulp.watch([paths.appJs + '/*.js', paths.gameJs + '/*.js'], ['reload']);
    }
  );
});

gulp.task('reload', function() {
  browserSync.reload()
});
