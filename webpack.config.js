import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(dirname, 'site'),
    filename: 'main.js',
    clean: true,
  },
  module: {
    rules: [{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html', scriptLoading: 'defer' }),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
  ],
};
