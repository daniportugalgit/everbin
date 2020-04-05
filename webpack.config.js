const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./app/javascripts/app.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "app.js"
    },
    plugins: [
        // Copy our app"s index.html to the build folder.
        new CopyWebpackPlugin([
            { from: "./app/index.html", to: "index.html" },
            { from: "./app/img", to: "img/" },
        ])
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ]
            }
        ]
    },
    stats: {
        warnings: false
    },
    devServer: {
        host: "0.0.0.0",
        port: 8000,
    }
};
