var webpack = require('webpack');
var path = require('path');

var commonConfig = {
  resolve: {
    extensions: ['', '.ts', '.js', '.json']
  },
  module: {
    loaders: [
      // TypeScript
      { test: /\.ts$/, loaders: ['ts-loader', 'angular2-template-loader'] },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.json$/, loader: 'raw-loader' }
    ],
  },
  plugins: [
  ]

};


var clientConfig = {
  target: 'web',
  entry: './RsDesktop/src/client',
  output: {
    path: root('RsDesktop/dist/client')
  },
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};


var serverConfig = {
  target: 'node',
  entry: './server', // use the entry file of the node server if everything is ts rather than es5
  output: {
    path: root('./RsDesktop/dist/server'),
    libraryTarget: 'commonjs2',
    filename: 'index.js'
  },
  externals: checkNodeImport,
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};



// Default config
var defaultConfig = {
  context: __dirname,
  resolve: {
    root: root('/RsDesktop/www')
  },
  output: {
    publicPath: path.resolve(__dirname),
    filename: 'index.js'
  }
}



var webpackMerge = require('webpack-merge');
module.exports = [
  // Client
  webpackMerge({}, defaultConfig, commonConfig, clientConfig),

  // Server
  webpackMerge({}, defaultConfig, commonConfig, serverConfig)
]

// Helpers
function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request); return;
  }
  cb();
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
