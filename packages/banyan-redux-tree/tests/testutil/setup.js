const JSDOM = require("jsdom").JSDOM;

const dom = new JSDOM("");
const { window } = dom;
window.console = global.console;

Object.keys(window).forEach(property => {
    if (typeof global[property] === "undefined") {
        global[property] = window[property];
    }
});

global.navigator = {
    userAgent: "node.js"
};
