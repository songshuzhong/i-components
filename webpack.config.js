const path = require('path');
const webpack = require('webpack');
const {VueLoaderPlugin} = require('vue-loader');
const externalDependencies = require('./externals');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const copyright = require('./copyright');

module.exports = {
  mode: 'production',
  entry: {
    Particle: './src/components/Particle/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:6].min.js',
    libraryTarget: 'umd',
    library: '[name]',
    umdNamedDefine: true
  },
  externals: externalDependencies,
  module: {
    rules: [
      {
        test: /\.(vue)$/,
        loader: 'vue-loader',
        exclude: path.join(__dirname, 'node_modules'),
        options: {
          loaders: {
            js: 'babel-loader',
          },
        },
      },
      {
        test: /\.(jsx|js)$/,
        exclude: path.join(__dirname, 'node_modules'),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
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
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.BannerPlugin(copyright),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'app.report.html',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      logLevel: 'info',
    }),
  ],
};
