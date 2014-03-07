var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename')
	ngmin = require('gulp-ngmin');	


// Concatenate & (ng)Minify JS
// there is a problem running uglify() because there two functions in 
// favlocations.module.config that are not correctly DI 
gulp.task('scripts', function() {

    return gulp.src(['public/js/underscore-min.js', 'public/ng/**/*.js'])
    	.pipe(concat('all.js'))
        .pipe(ngmin())
        //.pipe(uglify())
        .pipe(gulp.dest('public/js/'));
});

gulp.task('default', ['scripts']);
