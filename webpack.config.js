/* eslint-disable */
'use strict';

var webpack = require('webpack')

var config = {
  externals: {
    react: {
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
    new webpack.DefinePlugin({
      '__DEV__': process.env.NODE_ENV === 'production',
    }),
  ],
};

module.exports = config
