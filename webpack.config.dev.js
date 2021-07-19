const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.config.common');
const packageJson = require('./package.json');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: common.output.path,
    historyApiFallback: true,
    port: 8081,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('sample', 'src', 'index.ejs'),
      templateParameters: {
        mode: 'development',
        reactVersion: packageJson.devDependencies.react,
        katexVersion: packageJson.devDependencies.katex,
      },
    }),
  ],
});
