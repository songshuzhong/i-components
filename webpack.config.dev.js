const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.join(__dirname, 'example/index.js'),
  mode: 'development',
  devtool: 'source-map',
  output: {
    publicPath: '',
    path: path.join(__dirname, 'dist/sample'),
    filename: 'js/[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(vue)$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          },
        },
      },
      {
        test: /\.(jsx|js)$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'postcss-loader',
          },
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jpg|gif|ttf|woff|woff2|eot|svg)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets',
          limit: 6000,
        }
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.join(__dirname, '/example/index.html'),
      imgPath: 'assets'
    })
  ],
  devServer: {
    historyApiFallback: true,
    compress: true,
    noInfo: false,
    disableHostCheck: true,
  },
};
