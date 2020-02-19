const dev = process.env.NODE_ENV === 'development';

const presets = [
  '@babel/preset-env',
  '@babel/preset-typescript',
  '@babel/preset-react',
];

const plugins = [
  '@babel/plugin-transform-runtime',
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-syntax-dynamic-import',
];

module.exports = { presets, plugins };
