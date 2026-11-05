# Playwright Tests

End-to-end test suite written with Playwright and TypeScript. It runs against a static HTML site included in the repository, so it needs no external services. Tests cover three areas: desktop (Chromium), mobile (iPhone 13 emulation on WebKit) and accessibility (WCAG) audits with axe-core.

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

## Adding a page

Pages are discovered automatically; there is no list to update.

1. Create `src/pages/<name>.html`. Put `<%= nav %>` where the navigation goes.
2. Optional `<meta>` tags in its `<head>`: `nav-label` and `nav-order` (show it in the navigation), `home-button` (add a button for it on the home page).
3. Optional `src/scripts/<name>.js` is loaded only on that page.
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
│   ├── pages/             # HTML pages (index, hero, contact, form)
│   ├── scripts/           # JavaScript entry points
│   └── styles/            # CSS
├── site/                  # Webpack build output, served by the tests
├── tests/                 # One folder per page, each with desktop, mobile and accessibility specs
│   ├── home/              # index.html
│   ├── hero/              # hero.html (hero banner)
│   ├── contact/           # contact.html
│   └── form/              # form.html (registration form)
├── webpack.config.js      # Builds src/ into site/
├── playwright.config.ts   # Projects, devices, web server, reporters
├── tsconfig.json
└── package.json
```

## What the tests check

- Desktop (1280x720): navigation between pages, the hero banner (content, call to action, show/hide details), the contact form (`/contact.html`) and the registration form (`/form.html`): happy paths and validation errors.
- Mobile (iPhone 13, using `.tap()`): `.hidden-mobile` content hidden, hamburger menu toggling with `aria-expanded`, hero banner without horizontal overflow, and form submissions and validation on both forms.
- Accessibility: automated axe-core scans against WCAG rules. Besides the axe scan, explicit tests check image `alt` text, label `for`/`id` association, ARIA attributes and keyboard navigation with Tab, and `aria-invalid` handling on the registration form, and the hero banner's region label and `aria-expanded` toggle. They do not replace manual testing with a screen reader or keyboard.

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
