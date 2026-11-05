import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  entry: {
    main: './src/scripts/main.js',
    contact: './src/scripts/contact.js',
    form: './src/scripts/form.js',
  },
  output: {
    path: path.resolve(dirname, 'site'),
    filename: 'js/[name].js',
    clean: true,
  },
  module: {
    rules: [{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/index.html',
      filename: 'index.html',
      chunks: ['main', 'contact'],
      scriptLoading: 'defer',
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/form.html',
      filename: 'form.html',
      chunks: ['main', 'form'],
      scriptLoading: 'defer',
    }),
    new MiniCssExtractPlugin({ filename: 'css/styles.css' }),
  ],
};
