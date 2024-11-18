const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/game.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.png/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin()],
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 9000,
    },
};
