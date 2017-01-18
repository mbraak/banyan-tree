var path = require('path');
var DashboardPlugin = require("webpack-dashboard/plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AnyBarWebpackPlugin = require('anybar-webpack');

module.exports = {
    entry: {
        app: ["./src/examples/example.js"]
    },
    output: {
        path: path.join(__dirname, "/build"),
        filename: "bundle.js",
        publicPath: "http://localhost:8080/build/"
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    loader: "css-loader!postcss-loader"
                })
            }
        ]
    },
    plugins: [
        new DashboardPlugin(),
        new ExtractTextPlugin("[name].css"),
        new AnyBarWebpackPlugin(process.env.ANYBAR_PORT || 1738, '127.0.0.1', {enableNotifications: true})
    ],
    devtool: "source-map"
};
