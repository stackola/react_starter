// TODO: Delete old js/css files

const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = env => {
  const extractLess = new ExtractTextPlugin({
    filename: "css/[name]-[hash].css",
    disable: env.NODE_ENV === "local"
  });

  const createHtml = new HtmlWebpackPlugin({
    inject: "body",
    template: __dirname + "/src/templates/index.ejs",
    disable: env.NODE_ENV === "local"
  });

  const envPlugin = new webpack.EnvironmentPlugin({
    NODE_ENV: "development", // use 'development' unless process.env.NODE_ENV is defined
    DEBUG: false
  });

  return {
    mode: "development", // This gets overwritten by console argument
    entry: {
      app: ["babel-polyfill", "./src/index"]
    },
    devtool: "source-map",
    plugins: [envPlugin, extractLess, createHtml],
    module: {
      rules: [
        {
          test: /\.js(x?)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.less$/,
          use: extractLess.extract({
            use: [
              {
                loader: "css-loader"
              },
              {
                loader: "less-loader"
              }
            ],
            // use style-loader in development
            fallback: "style-loader"
          })
        }
      ]
    },
    optimization:{
        splitChunks:{
            cacheGroups:{
                vendor: {
                    chunks: 'initial',
                    test: __dirname + '/node_modules',
                    filename: "js/vendors-[contentHash].js",
                    name: 'vendors',
                    enforce: true,
                },
            }, 
        }
    },
    resolve: {
      extensions: ["*", ".js", ".jsx"]
    },
    output: {
      path: __dirname + "/public/",
      publicPath: "",
      filename: "js/main-[hash].js"
    }
  };
};