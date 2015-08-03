/* browserify pipe for gulp

return gulp.src('./src/main.jsx')
    .pipe(bundler())
    .pipe(gulp.dest('./build'));
*/
var browserify = require('browserify');
var through2 = require('through2');
var vinyl = require('vinyl');


function bundler(debug, transforms) {
    if (debug == undefined) {
        debug = true;
    }

    var b, stream;

    function transformStream(file, enc, next) {
        b.add(file.path);
        next();
    }

    function flushStream(next) {
        function bundleStream(err, src) {
            if (err) {
                console.log(chalk.red(err));
            }

            stream.push(
                new vinyl({
                    path: 'bundle.js',
                    contents: src
                })
            );
            next();
        }

        function addTransform(t) {
            b = b.transform(t);
        }

        if (transforms) {
            transforms.forEach(addTransform);
        }

        b.bundle(bundleStream);
    }

    b = browserify({debug: debug});

    stream = through2.obj(transformStream, flushStream);

    return stream;
}

module.exports = bundler;
