const path = require('path');

module.exports = {
  entry: './src/popup.js',
  output: {
    filename: 'popup.js',
    path: path.resolve(__dirname,'dist'),
  libraryTarget: 'var',
  library: 'GetToken'
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    fs:'empty'
  }
};