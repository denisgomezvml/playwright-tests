import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(dirname, 'src/pages');
const scriptsDir = path.resolve(dirname, 'src/scripts');

const readMeta = (html, name) => html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`))?.[1];

// Every src/pages/<name>.html is a page. It may declare in <meta> tags:
//   nav-label / nav-order: show it in the main navigation
//   home-button: show a button for it on the home page
// An optional src/scripts/<name>.js becomes that page's script.
const pages = fs
  .readdirSync(pagesDir)
  .filter((file) => file.endsWith('.html'))
  .map((file) => {
    const name = path.basename(file, '.html');
    const html = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    return {
      name,
      file,
      navLabel: readMeta(html, 'nav-label'),
      navOrder: Number(readMeta(html, 'nav-order') ?? 1000),
      homeButton: readMeta(html, 'home-button'),
      hasScript: fs.existsSync(path.join(scriptsDir, `${name}.js`)),
    };
  });

const renderNav = (current) => {
  const links = pages
    .filter((page) => page.navLabel)
    .sort((a, b) => a.navOrder - b.navOrder)
    .map((page) => `      <a href="${page.file}"${page.name === current ? ' aria-current="page"' : ''}>${page.navLabel}</a>`)
    .join('\n');
  return `<nav aria-label="Main navigation">
    <a class="brand" href="index.html">VML QA</a>
    <button id="toggle-menu" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle menu">Menu</button>
    <div id="nav-links">
${links}
    </div>
  </nav>`;
};

const renderPageButtons = () =>
  pages
    .filter((page) => page.homeButton)
    .sort((a, b) => a.navOrder - b.navOrder)
    .map((page) => `        <a class="btn-secondary" href="${page.file}">${page.homeButton}</a>`)
    .join('\n');

const entry = { main: './src/scripts/main.js' };
for (const page of pages) {
  if (page.hasScript) entry[page.name] = `./src/scripts/${page.name}.js`;
}

export default {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  entry,
  output: {
    path: path.resolve(dirname, 'site'),
    filename: 'js/[name].js',
    clean: true,
  },
  module: {
    rules: [{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }],
  },
  devServer: {
    port: 3000,
    open: true,
    hot: false,
    liveReload: true,
    watchFiles: ['src/**/*'],
  },
  plugins: [
    ...pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `./src/pages/${page.file}`,
          filename: page.file,
          chunks: page.hasScript ? ['main', page.name] : ['main'],
          scriptLoading: 'defer',
          templateParameters: { nav: renderNav(page.name), pageButtons: renderPageButtons() },
        }),
    ),
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
  ],
};
