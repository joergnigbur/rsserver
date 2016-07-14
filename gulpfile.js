
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

gulp.task('build', function () {



    gulp.src('./*.*')
        .pipe(gulp.dest('C:\\xampp\\htdocs\\recspec\\node'));

    gulp.src('./controller/*.*')
        .pipe(gulp.dest('C:\\xampp\\htdocs\\recspec\\node\\controller'));

    gulp.src(['./RsMobile/www/**/*.*'])
        .pipe(gulp.dest('C:\\xampp\\htdocs\\recspec'));

    return gulp.src('./RsMobile/www/index.html')
        .pipe(gulp.dest('C:\\xampp\\htdocs\\recspec\\build'));


})