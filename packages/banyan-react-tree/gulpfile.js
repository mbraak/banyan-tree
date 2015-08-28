var gulp       = require('gulp');
var babel      = require('gulp-babel');
var babelify   = require('babelify');
var browserify = require('browserify');
var eslint     = require('gulp-eslint');
var postcss    = require('gulp-postcss');
var rename     = require('gulp-rename');

// tasks
var bundler = require('./tasks/bundler');
var runDisc = require('./tasks/run_disc');


var babel_options = { stage: 0 };

var babel_transforms = [
    babelify.configure(babel_options)
];


gulp.task('buildStyle', function() {
    return gulp.src('./css/banyan-react-tree.css')
        .pipe(postcss([require('postcss-nested')]))
        .pipe(gulp.dest('./build'));
});

gulp.task('lib', function() {
    return gulp.src(['./src/*.js', './src/*.jsx'])
        .pipe(babel(babel_options))
        .pipe(gulp.dest('./build'));
});

gulp.task('lint', function() {
    return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
        .pipe(eslint({useEslintrc: true}))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('example', function() {
    return gulp.src('./src/examples/example.jsx')
        .pipe(bundler(true, babel_transforms))
        .pipe(rename('example.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('disc', function() {
    var input_file = __dirname + '/src/tree.jsx';

    return runDisc(input_file, babel_transforms);
});

gulp.task('watch', ['default'], function() {
    gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['default']);
    gulp.watch(['less/*.less'], ['buildStyle']);
});

gulp.task('default', ['lib', 'example', 'buildStyle']);
