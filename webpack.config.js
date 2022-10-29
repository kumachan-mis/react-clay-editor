const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const packageJson = require('./package.json');
const envVars = createEnvVars();

const isProduction = envVars.NODE_ENV === 'production';

module.exports = {
  entry: envVars.ENTRY,
  target: 'web',
  mode: isProduction ? 'production' : 'development',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    katex: 'katex',
  },
  output: {
    path: envVars.OUTPUT_PATH,
    filename: '[name].bundle.[chunkhash].js',
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: { modules: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(envVars),
    new HtmlWebpackPlugin({
      template: envVars.TEMPLATE_PATH,
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
    port: envVars.DEVSERVER_PORT,
    open: envVars.DEVSERVER_OPEN,
  },
};

function createEnvVars() {
  switch (process.env.ENVIRONMENT) {
    case 'development':
      return {
        ENVIRONMENT: process.env.ENVIRONMENT,
        NODE_ENV: 'development',
        ENTRY: path.resolve('sample', 'src', 'index.tsx'),
        TEMPLATE_PATH: path.resolve('sample', 'src', 'index.ejs'),
        OUTPUT_PATH: path.resolve('sample', 'dist'),
        DEVSERVER_PORT: 8081,
        DEVSERVER_OPEN: true,
      };
    case 'test':
      return {
        ENVIRONMENT: process.env.ENVIRONMENT,
        NODE_ENV: 'development',
        ENTRY: path.resolve('tests', 'target', 'index.tsx'),
        TEMPLATE_PATH: path.resolve('tests', 'target', 'index.ejs'),
        OUTPUT_PATH: path.resolve('tests', 'dist'),
        DEVSERVER_PORT: 8082,
        DEVSERVER_OPEN: false,
      };
    case 'production':
      return {
        ENVIRONMENT: process.env.ENVIRONMENT,
        NODE_ENV: 'production',
        ENTRY: path.resolve('sample', 'src', 'index.tsx'),
        TEMPLATE_PATH: path.resolve('sample', 'src', 'index.ejs'),
        OUTPUT_PATH: path.resolve('sample', 'dist'),
      };
    default:
      throw Error(`unknown environment: ${process.env.ENVIRONMENT}`);
  }
}
