
'use strict';

const HMRPlugin = require('webpack').HotModuleReplacementPlugin;
const path = require('path');

module.exports = {
  context: path.join(__dirname, 'client'),
  devtool: 'source-map',
  entry: {
    js: './index.js',
    html: './index.html',
  },
  output: {
    path: './build',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot',
          'babel'
        ]
      },
      {
        test: /\.css$/,
        include: /client/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.css$/,
        exclude: /client/,
        loader: 'style!css'
      },
      {
        test: /\.svg$/,
        loader: 'url'
      },
    ]
  },
  devServer: {
    contentBase: './client',
    historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000/'
      }
    }
  }
}
