var gulp = require('gulp');
var browserSync = require("browser-sync");
var watch = require('gulp-watch');

// Start the server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: paths.destDir
    },
    files: paths.destDir + "/**/*"
  });
});
