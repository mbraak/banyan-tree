var gulp   = require('gulp');
var babel  = require('gulp-babel');
var eslint = require('gulp-eslint');


gulp.task('lib', function() {
    return gulp.src(['./src/*.js', './src/*.jsx'])
        .pipe(babel())
        .pipe(gulp.dest('./build'));
});

gulp.task('lint', function() {
    return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
        .pipe(eslint({useEslintrc: true}))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('watch', ['default'], function() {
    gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['default']);
});

gulp.task('default', ['lib']);
