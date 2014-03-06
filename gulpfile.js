var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename')
	ngmin = require('gulp-ngmin');	


// Concatenate & Minify JS
gulp.task('scripts', function() {

    return gulp.src(['public/js/underscore-min.js', 'public/ng/**/*.js'])
    	.pipe(concat('all.js'))
        .pipe(ngmin())
        .pipe(gulp.dest('public/js/'));

/*
    return gulp.src(['public/ng/app.js','public/ng/controllers/*.js', 'public/ng/models/*.js', 'public/ng/services/*.js', 'public/ng/directives/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/js/'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/'));
*/
});

gulp.task('default', ['scripts']);
