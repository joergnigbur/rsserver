
// Load plugins
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();
  

gulp.task('scripts', function () {
    
    
    
    gulp.src('./tominify/*.js')
    //    .pipe($.stripComments())    
    .pipe($.ngAnnotate({
        // true helps add where @ngInject is not used. It infers.
        // Doesn't work with resolve, so we must be explicit there
        add: true
    }))
       .pipe($.uglify())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('../resources'));
   
 
})
