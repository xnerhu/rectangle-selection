const { resolve } = require('path');

const INCLUDE = resolve(__dirname, 'src');

const config = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: __dirname + '/build',
    library: '',
    libraryTarget: 'commonjs',
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '~': INCLUDE,
    },
  },

  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/i,
        loader: 'awesome-typescript-loader',
      },
    ],
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};

module.exports = config;
