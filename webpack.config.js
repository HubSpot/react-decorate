/* eslint-disable */
'use strict';

var webpack = require('webpack')

var isProd = process.env.NODE_ENV === 'production'
var config = {
  externals: {
    'react': {
      amd: 'react',
      commonjs2: 'react',
      commonjs: 'react',
      root: 'React',
    },
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
    }],
  },
  output: {
    library: 'ReactDecorate',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      '__DEV__': !isProd,
    }),
  ],
};

if (isProd) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false,
      }
    })
  )
}

module.exports = config
