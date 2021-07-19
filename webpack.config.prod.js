const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.config.common');
const packageJson = require('./package.json');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('sample', 'src', 'index.ejs'),
      templateParameters: {
        mode: 'production',
        reactVersion: packageJson.devDependencies.react,
        katexVersion: packageJson.devDependencies.katex,
      },
    }),
  ],
});
