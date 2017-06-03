var path = require("path");
var nodeExternals = require("webpack-node-externals");

var isCoverage = process.env.NODE_ENV === "coverage";

var loaders = [];

if (isCoverage) {
    loaders.push({
        test: /\.(js|tsx?)/,
        include: path.resolve("src"),
        loader: "istanbul-instrumenter-loader",
        query: {
            esModules: true
        }
    });
}

loaders.push({
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/
});

module.exports = {
    target: "node",
    externals: [nodeExternals()],
    devtool: "inline-cheap-module-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    output: {
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
    },
    module: {
        loaders: loaders
    }
};
