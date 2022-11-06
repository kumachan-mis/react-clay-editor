const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const packageJson = require('./package.json');
const envVars = createEnvVars();

const isProduction = envVars.NODE_ENV === 'production';

module.exports = {
  entry: path.resolve('sample', 'src', 'index.tsx'),
  target: 'web',
  mode: isProduction ? 'production' : 'development',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    katex: 'katex',
  },
  output: {
    path: path.resolve('sample', 'dist'),
    filename: '[name].bundle.[chunkhash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(envVars),
    new HtmlWebpackPlugin({
      template: path.resolve('sample', 'src', 'index.ejs'),
      templateParameters: {
        mode: isProduction ? 'production' : 'development',
        reactVersion: packageJson.devDependencies.react,
        katexVersion: packageJson.devDependencies.katex,
      },
    }),
  ],
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    port: 8081,
    open: true,
  },
};

function createEnvVars() {
  switch (process.env.ENVIRONMENT) {
    case 'development':
      return { NODE_ENV: 'development', ENVIRONMENT: process.env.ENVIRONMENT };
    case 'test':
      return { NODE_ENV: 'development', ENVIRONMENT: process.env.ENVIRONMENT };
    case 'production':
      return { NODE_ENV: 'production', ENVIRONMENT: process.env.ENVIRONMENT };
    default:
      throw Error(`unknown environment: ${process.env.ENVIRONMENT}`);
  }
}
