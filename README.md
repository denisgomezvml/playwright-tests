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

Playwright starts the local server (http-server) before the run, so no manual setup is needed.

```bash
# All tests, headless
npm test

# Interactive UI mode
npm run test:ui

# Visible browser
npm run test:headed

# A single file
npx playwright test tests/accessibility.spec.ts

# A single project (device or browser)
npx playwright test --project=mobile

# A single test by title
npx playwright test -g "success message"
```

Available projects (defined in `playwright.config.ts`): `desktop` (runs `desktop.spec.ts` and `accessibility.spec.ts`) and `mobile` (runs `mobile.spec.ts`).

## Reports

After a run, open the HTML report. Traces are recorded on the first retry.

```bash
npx playwright show-report
```

## Project structure

```text
.
├── site/                  # Static HTML site under test
├── tests/
│   ├── desktop.spec.ts    # Desktop scenarios
│   ├── mobile.spec.ts     # Mobile viewport scenarios
│   └── accessibility.spec.ts  # axe-core WCAG audits
├── playwright.config.ts   # Projects, devices, web server, reporters
├── tsconfig.json
└── package.json
```

## What the tests check

- Desktop (1280x720): contact form happy path and validation errors, desktop-only content visible, hamburger menu hidden.
- Mobile (iPhone 13, using `.tap()`): `.hidden-mobile` content hidden, hamburger menu toggling with `aria-expanded`, form submission and validation.
- Accessibility: automated axe-core scans against WCAG rules. Besides the axe scan, explicit tests check image `alt` text, label `for`/`id` association, ARIA attributes and keyboard navigation with Tab. They do not replace manual testing with a screen reader or keyboard.

## Tech stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Test runner and browser automation |
| [TypeScript](https://www.typescriptlang.org/) | Typed test code |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) | Accessibility audits |
| [http-server](https://www.npmjs.com/package/http-server) | Serves the static site locally |

## Troubleshooting

- Browsers missing or outdated: run `npx playwright install` again.
- Port already in use: the server runs on port 8080. Stop whatever is using it, or change it in `playwright.config.ts` (`baseURL` and `webServer`).
- Linux without system libraries: run `npx playwright install --with-deps`.
