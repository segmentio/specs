
'use strict';

const webpack = require('webpack');
const HMRPlugin = webpack.HotModuleReplacementPlugin;
const DefinePlugin = webpack.DefinePlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path');

const env = process.env.NODE_ENV || 'development';

const config = module.exports = {
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
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    })
  ],
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
        loader: env === 'production'
          ? ExtractTextPlugin.extract('style-loader', 'css-loader?module!postcss-loader', {
              publicPath: '/'
            })
          : 'style!css?module&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss'
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

if (env == 'production') {
  delete config.entry.html
  config.plugins.push(new ExtractTextPlugin('bundle.css'))
}
