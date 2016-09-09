const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'src/client/app'),
  build: path.join(__dirname, 'src/client/build')
};

console.log(TARGET);

process.env.BABEL_ENV = TARGET;

const config = {
  entry: {
    app: PATHS.app + '/index'
  },
  resolve: { 
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        //loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
        loaders: ['style', 'css', 'sass'],
        include: PATHS.app
      },
      {
        test: /\.scss$/,
        //loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      },
      {
        test: /\.json?$/,
        loaders: ['json'],
        include: PATHS.app
      }
    ]
  }
}

// var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
// var APP_DIR = path.resolve(__dirname, 'src/client/app');

// var config = {
//   entry: APP_DIR + '/index.jsx',
//   output: {
//     path: BUILD_DIR,
//     filename: 'bundle.js'
//   },
  
//     module : {
//     loaders : [
//       {
//         test : /\.jsx?/,
//         include : APP_DIR,
//         loader : 'babel'
//       }
//     ]
//   }
// };


//module.exports = config;

if(TARGET ==='start' || !TARGET) {
  module.exports = merge(config, { 
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      //display only errors to reduce the amount of output
      stats: 'errors-only',

      //parse host and port from env so this is 
      //easy to customize
      host: process.env.HOST,
      port: process.env.port
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin ({
        save: true //--save
      })
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(config, {});
}