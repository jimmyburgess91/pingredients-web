const webpack = require('webpack');

module.exports = (env) => {
  // create a nice object from the env variable
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry:  __dirname + '/js/index.js',
    output: {
        path: __dirname + '/dist',
        publicPath: 'dist/',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    plugins: [
      new webpack.DefinePlugin({'DEV': true})
    ],
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer,
              },
            },
          ],
        }
      ]
    }
  };
};
