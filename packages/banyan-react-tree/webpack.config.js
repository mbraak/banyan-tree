const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: ["./examples/example.tsx"]
    },
    output: {
        path: path.join(__dirname, "/build"),
        filename: "bundle.js",
        publicPath: "http://localhost:8080/build/"
    },
    watch: true,
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader"]
                })
            }
        ]
    },
    plugins: [new ExtractTextPlugin("[name].css")],
    devtool: "source-map"
};
