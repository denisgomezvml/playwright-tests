# Playwright Tests

End-to-end test suite written with Playwright and TypeScript. It runs against a static HTML site included in the repository, so it needs no external services. The site has a page per testing topic (forms, tables, dialogs, iframes, uploads, new tabs, drag and drop...). Tests cover three areas: desktop (Chromium), mobile (iPhone 13 emulation on WebKit) and accessibility (WCAG) audits with axe-core.

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Playwright is pinned to `~1.64.1` in `package.json`

## Installation

```bash
# From the repository root
# Install dependencies
npm install

# Download the browsers Playwright uses
npx playwright install chromium webkit
```

## Running tests

`npm test` first builds the site with webpack (`pretest`), then Playwright starts the local server (http-server) on `site/`. The UI and headed scripts also build first. If you run `npx playwright test` directly, run `npm run build` beforehand after changing anything in `src/`.

```bash
# All tests, headless
npm test

# Interactive UI mode
npm run test:ui

# Visible browser
npm run test:headed

# Against the dev server (no build step, live-reload server on port 3000)
npm run test:dev

# A single file
npx playwright test tests/form/accessibility.spec.ts

# All tests of one page
npx playwright test tests/hero

# A single project (device or browser)
npx playwright test --project=mobile

# A single test by title
npx playwright test -g "success message"
```

Available projects (defined in `playwright.config.ts`): `desktop` (runs `desktop.spec.ts` and `accessibility.spec.ts`) and `mobile` (runs `mobile.spec.ts`).

## Pages

| Page | Practice topic |
|---|---|
| `index.html` | Home with a button per page, responsive navigation |
| `hero.html` | Hero banner, call to action, show/hide details |
| `contact.html` | Contact form with validation |
| `form.html` | Registration form with `aria-invalid` handling |
| `table.html` | Pagination, column sorting and text filter |
| `async.html` | Delayed result and intermittent failures (auto-waiting, `expect.toPass`, `page.clock`) |
| `dialogs.html` | Native `alert`/`confirm`/`prompt` and an HTML modal |
| `frames.html` | Iframe form (`frame-form.html`) and a Shadow DOM component |
| `files.html` | File upload input and CSV download link |
| `tabs.html` | `target="_blank"` link and `window.open` (`new-tab.html`) |
| `dnd.html` | Drag and drop list and hover menu |

`frame-form.html` and `new-tab.html` are helper pages: they have no navigation entry or home button.

## Adding a page

Pages are discovered automatically; there is no list to update.

1. Create `src/pages/<name>.html`. Put `<%= nav %>` where the navigation goes.
2. Optional `<meta>` tags in its `<head>`: `nav-label` and `nav-order` (show it in the navigation), `home-button` (add a button for it on the home page).
3. Optional `src/scripts/<name>.js` is loaded only on that page. It can import its own stylesheet from `src/styles/` (shared styles live in `styles.css`).
4. Add its specs in `tests/<name>/` (`desktop`, `mobile` and `accessibility`).

Restart `npm run dev` after adding a page.

## Building the site

Edit the files in `src/`. `site/` is generated, cleaned on every build and not committed; CI builds it before running the tests.

```bash
npm run build
```

## Dev preview

To see the site while you work, start the dev server. It serves the pages from memory at http://localhost:3000, opens the browser and reloads on every change in `src/`. It does not touch `site/`. `npm run test:dev` runs the Playwright suite against this server, starting it automatically (or reusing it if `npm run dev` is already running). Extra flags work too, e.g. `npm run test:dev -- --ui`.

```bash
npm run dev
```

## Reports

After a run, open the HTML report. Traces are recorded on the first retry.

```bash
npx playwright show-report
```

## Project structure

```text
.
├── src/                   # Site sources
│   ├── pages/             # HTML pages (see the Pages table)
│   ├── scripts/           # JavaScript entry points
│   └── styles/            # CSS
├── site/                  # Webpack build output, served by the tests
├── tests/                 # One folder per page, each with desktop, mobile and accessibility specs
│   ├── home/              # index.html
│   ├── hero/              # hero.html (hero banner)
│   ├── contact/           # contact.html
│   ├── form/              # form.html (registration form)
│   ├── table/             # table.html
│   ├── async/             # async.html
│   ├── dialogs/           # dialogs.html
│   ├── frames/            # frames.html (and frame-form.html)
│   ├── files/             # files.html
│   ├── tabs/              # tabs.html (and new-tab.html)
│   └── dnd/               # dnd.html
├── webpack.config.js      # Builds src/ into site/
├── playwright.config.ts   # Projects, devices, web server, reporters
├── tsconfig.json
└── package.json
```

## What the tests check

- Desktop (1280x720): navigation between pages, the hero banner, the contact and registration forms (happy paths and validation errors), table pagination/sorting/filtering, delayed and flaky content, native dialogs and the HTML modal, iframe and shadow DOM interaction, file upload and CSV download, new tabs (`context.waitForEvent('page')`), drag and drop and the hover menu.
- Mobile (iPhone 13, using `.tap()`): `.hidden-mobile` content hidden, hamburger menu toggling with `aria-expanded`, no horizontal overflow, and the touch equivalent of each page's main flow.
- Accessibility: automated axe-core scans against WCAG rules on every page, including states such as an open modal, validation errors or an open menu. Explicit tests check image `alt` text, label `for`/`id` association, ARIA attributes, live regions, focus management and keyboard navigation with Tab. They do not replace manual testing with a screen reader or keyboard.

## Tech stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Test runner and browser automation |
| [TypeScript](https://www.typescriptlang.org/) | Typed test code |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) | Accessibility audits |
| [webpack](https://webpack.js.org/) | Bundles `src/` into `site/` |
| [http-server](https://www.npmjs.com/package/http-server) | Serves the static site locally |

## Troubleshooting

- Browsers missing or outdated: run `npx playwright install` again.
- Port already in use: the server runs on port 8080. Stop whatever is using it, or change it in `playwright.config.ts` (`baseURL` and `webServer`).
- Linux without system libraries: run `npx playwright install --with-deps`.
