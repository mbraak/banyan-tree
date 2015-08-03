var gulp = require('gulp');
var browserify = require('browserify');
var disc = require('disc');
var source = require('vinyl-source-stream');


function runDisc(input_file, transforms) {
    var b;

    function addTransform(t) {
        b = b.transform(t);
    }

    b = browserify({fullPaths: true, debug: true});

    b.add(input_file);

    if (transforms) {
        transforms.forEach(addTransform);
    }

    return b.bundle()
        .pipe(disc())
        .pipe(source('disc.html'))
        .pipe(gulp.dest('./'));
}

module.exports = runDisc;
