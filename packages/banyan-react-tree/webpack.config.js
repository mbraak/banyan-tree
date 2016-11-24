var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: ["./src/examples/example.js"]
    },
    output: {
        path: __dirname + "/build",
        filename: "bundle.js",
        publicPath: "http://localhost:8080/build/"
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
                //loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    plugins: [
        new DashboardPlugin(),
        new ExtractTextPlugin("[name].css")
    ],
    postcss: function() {
        return [require("postcss-nested")];
    },
    devtool: "source-map"
};
