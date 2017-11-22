const helpers = require('./helpers'),
      webpackConfig = require('./webpack.config.base'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      DefinePlugin = require('webpack/lib/DefinePlugin'),
      jsonImporter = require('node-sass-json-importer'),
      env = require('../environment/dev.env');

webpackConfig.module.rules = [...webpackConfig.module.rules,
  {
    test: /\.scss$/,
    use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        },
      },
      {
        loader: 'sass-loader',
        // Apply the JSON importer via sass-loader's options.
        options: {
          importer: jsonImporter,
        },
      },
    ]
  },
  {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader'
  }
];

webpackConfig.plugins = [...webpackConfig.plugins,
  new HtmlWebpackPlugin({
    inject: true,
    template: helpers.root('/src/index.html'),
    favicon: helpers.root('/src/fav.jpg'),
  }),
  new DefinePlugin({
    'process.env': env
  })
];

webpackConfig.devServer = {
  port: 8080,
  host: 'localhost',
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  contentBase: './src',
  open: true
};

module.exports = webpackConfig;
