const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'site-base': './assets/site-base.js',  // base styles shared between frameworks
    'site-tailwind': './assets/site-tailwind.js',  // required for tailwindcss styles
    app: './assets/javascript/app.js',
    pegasus: './assets/javascript/pegasus/pegasus.js',
    'react-object-lifecycle': './assets/javascript/pegasus/examples/react/react-object-lifecycle.js',
    'vue-object-lifecycle': './assets/javascript/pegasus/examples/vue/vue-object-lifecycle.js',
  },
  output: {
    path: path.resolve(__dirname, './static'),
    filename: 'js/[name]-bundle.js',
    library: ["SiteJS", "[name]"],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      'filename': 'css/[name].css',
    }),
    new VueLoaderPlugin(),
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,  // disable generation of license.txt files
    })],
  },
};
