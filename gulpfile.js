'use strict';

var gulp = require('gulp'),
  eslint = require('gulp-eslint');

gulp.task('eslint', function () {
  return gulp.src([
      'js/**/*.js',
      'js/**/*.jsx',
      'styles/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
