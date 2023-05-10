const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.argv.includes('--mode=production') ?
  'production' : 'development';
const libraryName = process.env.npm_package_name;

module.exports = {
  mode: mode === 'production',
  entry: {
    dist: './src/ResourceList.js'
  },
  output: {
    filename: `${libraryName}.js`,
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  target: ['browserslist'],
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${libraryName}.css`
    })
  ],
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
        test: /\.(s[ac]ss|css)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'assets'),
        ],
        type: 'asset/resource'
      }
    ]
  },
  ...(mode !== 'production' && { devtool: 'eval-cheap-module-source-map' })
};
