module.exports = {
    entry: "./src/schedule.js",
    output: {
        path: __dirname + "public/js",
        filename: "bundle.js",
        publicPath: "/js/"
    },
    devServer: {
        contentBase: "./public/",
    }
};
