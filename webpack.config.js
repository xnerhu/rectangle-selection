const { resolve } = require('path');

const INCLUDE = resolve(__dirname, 'src');

const config = {
  entry: {
    main: './src/index.ts',
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build'),
    library: '',
    libraryTarget: 'commonjs',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx|ts$/,
        loader: 'babel-loader',
        include: INCLUDE,
      },
    ],
  },

  node: {
    __dirname: false,
    __filename: false,
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '~': INCLUDE,
    },
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};

module.exports = config;
