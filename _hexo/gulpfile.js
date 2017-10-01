var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            collapseWhitespace: true,
        }))
        .pipe(htmlclean())
        .pipe(gulp.dest('./public'))
});
gulp.task('default', [
  'minify-html'
]);