const dev = process.env.NODE_ENV === 'development';

const presets = [
  '@babel/preset-env',
  '@babel/preset-typescript',
  '@babel/preset-react',
];

const plugins = [
  '@babel/plugin-transform-runtime',
  '@babel/plugin-proposal-class-properties',
];

module.exports = { presets, plugins };
