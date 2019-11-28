const path = require('path');
const webpack = require('webpack');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = (nodeEnv !== 'production');
const config = {
  entry: {
    dist: './src/ResourceList.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'h5p-resource-list.js'
  },
  resolve: {
      modules: [
          path.resolve(__dirname, 'src'),
          'node_modules'
      ],
      alias: {
        '@assets': path.resolve(__dirname, 'assets/')
      }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test:/\.(s*)css$/,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'assets'),
        ],
        loader: 'url-loader?limit=100000'
      }
    ]
  }
};

if (isDev) {
  config.devtool = 'inline-source-map';
}

module.exports = config;
