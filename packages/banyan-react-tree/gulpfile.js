var gulp       = require('gulp');
var babel      = require('gulp-babel');
var babelify   = require('babelify');
var browserify = require('browserify');
var eslint     = require('gulp-eslint');
var rename     = require('gulp-rename');
var source     = require('vinyl-source-stream');


function swallowError(error) {
    console.log(error.toString());

    this.emit('end');
}

function runBrowserify(filename) {
    var bundler = browserify({debug: true});

    return bundler
        .add(filename)
        .transform(babelify)
        .bundle()
        .on('error', swallowError)
        .pipe(source(filename));
}


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

gulp.task('example', function() {
    return runBrowserify('./src/examples/example.jsx')
        .pipe(rename('example.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', ['default'], function() {
    gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['default']);
});

gulp.task('default', ['lib', 'example']);
