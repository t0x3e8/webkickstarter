var gulp = require('gulp');
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');
 
gulp.task('default', function () {
    'use strict'

    return gulp.src('./public/less/*.less').
        pipe(watchLess('./public/less/*.less')).
        pipe(less()).
        pipe(gulp.dest('./public/stylesheets/'));
});