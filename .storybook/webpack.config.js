const path = require('path')

module.exports = {
  module: {
    loaders: {
      [{
        test: /\.jsx?$/,
        loader: 'babel'
      }, {
        test: /\.tsx?$/,
        loader: 'ts'
      }]
    }
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx']
  }
}