module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname + "/public/js",
        filename: "bundle.js",
        publicPath: "/js/"
    },
    devServer: {
        contentBase: "./public/",
    }
};
