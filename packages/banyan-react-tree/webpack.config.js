const path = require("path");

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
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            rootDir: null,
                            rootDirs: ["src", "examples"]
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"]
            }
        ]
    },
    devtool: "source-map"
};
