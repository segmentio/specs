
'use strict';

const webpack = require('webpack');
const HMRPlugin = webpack.HotModuleReplacementPlugin;
const DefinePlugin = webpack.DefinePlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

const env = process.env.NODE_ENV || 'development';

const config = module.exports = {
  context: path.join(__dirname, 'client'),
  devtool: 'source-map',
  entry: {
    main: './index.js',
  },
  output: {
    path: './build',
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body'
    })
  ],
  module: {
    loaders: [
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
  config.plugins.push(new ExtractTextPlugin('bundle.css'))
}
