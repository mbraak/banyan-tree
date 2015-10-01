const broccoli = require("broccoli");
const browserSync = require("browser-sync");


const builder = new broccoli.Builder(broccoli.loadBrocfile());

const browser_sync = browserSync.create();


function runBroccoli() {
    const serve_options = {host: "localhost", port: 4200};
    const server = broccoli.server.serve(builder, serve_options);

    server.watcher.on("change", function() {
        // todo: Report to browsersync which files are changed;
        // at this moment we cannot do this because broccoli does not expose this information
        browser_sync.reload();
    });
}

browser_sync.init(
    {
        open: false,
        proxy: "http://localhost:4200",
    },
    runBroccoli
);
