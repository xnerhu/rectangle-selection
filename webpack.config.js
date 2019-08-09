module.exports = {
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
  },
};
