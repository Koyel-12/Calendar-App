const path = require('path');
const webpack = require('webpack');


module.exports = {
  // Other webpack configuration options...
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/(fs|vm|path|module|child_process)$/,
    }),
  ],
  resolve: {
    fallback: {
        "fs": false, // or require.resolve("fs")
        "path": false, // or require.resolve("path-browserify")
        "module": false, // or require.resolve("module")
        "child_process": false, // or require.resolve("child_process")
        "vm": require.resolve("vm-browserify"), 
    },
  },
};

  