const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./demo/src/index.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(mov|mp4)$/,
        loader: "file-loader",
        options: {
          outputPath: "assets",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: path.join(__dirname, "..", "/demo"),
    publicPath: "/",
    filename: "bundle.js",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.join(__dirname, "..", "/demo"),
    hot: true,
    port: 3000,
  },
};
