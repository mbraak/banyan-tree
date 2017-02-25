var nodeExternals = require('webpack-node-externals');
 
module.exports = {
    target: "node",
    externals: [nodeExternals()],
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    }
}
