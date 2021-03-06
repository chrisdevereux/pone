var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'cheap-module',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [/node_modules/, /web_modules/]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|woff\d?|eot|jpe?g|svg|ttf)$/,
        loader: 'url-loader?limit=50000'
      }
    ]
  },
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'normalize.css',
    './src/toolkit/theme.css',
    './demo/style.css',
    './demo/main.js'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
