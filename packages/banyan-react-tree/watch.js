var broccoli = require('broccoli');
var browserSync = require('browser-sync');


var builder = new broccoli.Builder(broccoli.loadBrocfile());

var browser_sync = browserSync.create();


function runBroccoli() {
    var serve_options = {host: 'localhost', port: 4200};
    var server = broccoli.server.serve(builder, serve_options);

    server.watcher.on('change', function() {
        // todo: Report to browsersync which files are changed;
        // at this moment we cannot do this because broccoli does not expose this information
        browser_sync.reload();
    });
}

browser_sync.init(
    {
        open: false,
        proxy: 'http://localhost:4200',
    },
    runBroccoli
);
