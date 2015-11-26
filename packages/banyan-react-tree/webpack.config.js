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
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function() {
        return [require("postcss-nested")];
    },
    devtool: "source-map"
};
