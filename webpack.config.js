
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
      }
    ]
  },
  plugins: [ new HMRPlugin ],
  devServer: {
    contentBase: './client',
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000/'
      }
    }
  }
}
