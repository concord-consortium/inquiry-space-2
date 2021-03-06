var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    app: './js/index.js',
    carcrash: './js/carcrash.js',
    phonedrop: './js/phonedrop.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        // Config based on:
        // https://github.com/react-toolbox/react-toolbox-example/blob/master/webpack.config.js
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]--[local]--[hash:base64:8]'
            }
          },
          'postcss-loader' // has separate config, see postcss.config.js nearby
        ]
      },
      {
        // Local .less files.
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]--[local]--[hash:base64:8]'
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        // inline base64 URLs for <=100k images, direct URLs for the rest
        loader: 'url-loader?limit=102400'
      },
      {
        // Support ?123 suffix, e.g. ../fonts/m4d-icons.eot?3179539#iefix
        test: /\.(eot|ttf|woff|woff2|svg)((\?|#).*)?$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'public' }
    ])
  ]
}
