# Visual Snapshot Testing Guide (Playwright) — Placeholders Only

This document provides guidance and placeholders for setting up Playwright-based visual snapshot tests for this Next.js frontend. It does not add or run any tests by itself. Follow these steps when you decide to enable visual regression testing.

Note: Keep all commands non-interactive in CI. Do not commit sensitive configuration or environment variables.

--------------------------------------------------------------------------------
1) Recommended tooling and install commands (manual steps)
--------------------------------------------------------------------------------

Tools:
- Playwright test runner: @playwright/test
- Browsers: Playwright-supported browsers (Chromium, WebKit, Firefox)
- Optional helpers: per-route fixtures, motion/animation helper, network stubbing

Suggested install commands (run manually when enabling tests):
- npm i -D @playwright/test
- npx playwright install --with-deps
- Optionally add tooling:
  - npm i -D @types/node ts-node

Project scripts (package.json) suggestion:
- "test:visual": "playwright test --project=chromium --config=tests/visual/playwright.config.ts --reporter=line"
- "test:visual:ci": "CI=true playwright test --config=tests/visual/playwright.config.ts --reporter=dot --timeout=60000"
- "test:visual:update": "playwright test --config=tests/visual/playwright.config.ts --update-snapshots"
- "test:visual:debug": "PWDEBUG=1 playwright test --config=tests/visual/playwright.config.ts"

Do not run these until you are ready to add actual tests and CI configuration.

--------------------------------------------------------------------------------
2) Recommended folder structure (placeholders)
--------------------------------------------------------------------------------

tests/
  visual/
    README.md                 <-- this file
    playwright.config.ts      <-- placeholder config (create when enabling)
    helpers/
      motion.ts               <-- helper to disable animations (placeholder)
      selectors.ts            <-- central selectors (placeholder)
      test-ids.md             <-- agreed test id strategy (placeholder)
      network.ts              <-- route stubs & request blocking (placeholder)
    fixtures/
      routes.ts               <-- per-page route metadata (placeholder)
      viewports.ts            <-- viewport matrix definitions (placeholder)
      baseline/
        chromium/             <-- auto-created by Playwright (snapshots)
        firefox/              <-- auto-created by Playwright (snapshots)
        webkit/               <-- auto-created by Playwright (snapshots)
    specs/
      home.spec.ts            <-- placeholder for homepage snapshots
      chat.spec.ts            <-- placeholder for /chat snapshots
      materials.spec.ts       <-- placeholder for /materials snapshots
      analytics.spec.ts       <-- placeholder for /analytics snapshots

Important:
- Do not add actual spec files until requested.
- Keep snapshots out of git initially; decide whether to commit baseline images based on team policy.

--------------------------------------------------------------------------------
3) Suggested Playwright config (placeholder)
--------------------------------------------------------------------------------

Create tests/visual/playwright.config.ts when enabling tests. Example scaffolding:

/*
  Placeholder only — do not commit until enabling visual tests
  - Picks up specs from tests/visual/specs
  - Stores snapshots per browser under tests/visual/fixtures/baseline
*/
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/visual/specs',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'dot' : 'list',
  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'off',
    trace: 'off',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01, // Tight for UI regressions; adjust as needed
      threshold: 0.2,           // Per-pixel color delta; adjust per flake
    },
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['iPad (gen 7)'],
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
  // webServer: {
  //   command: 'npm run start', // or 'npm run dev' in local only
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

Do not commit this file until you intend to run tests.

--------------------------------------------------------------------------------
4) Suggested baseline routes and navigations
--------------------------------------------------------------------------------

Focus on pages that are core to the product:
- Homepage: /
- Chat: /chat
- Materials: /materials
- Analytics: /analytics
- Additional candidate routes: /student, /upload, /mentor, /admin, /login, /register

Scaffold for routes metadata (tests/visual/fixtures/routes.ts, placeholder):
export const ROUTES = {
  home: '/',
  chat: '/chat',
  materials: '/materials',
  analytics: '/analytics',
  student: '/student',
  upload: '/upload',
  mentor: '/mentor',
  admin: '/admin',
  login: '/login',
  register: '/register',
};

--------------------------------------------------------------------------------
5) Key selectors and stable hooks
--------------------------------------------------------------------------------

Use deterministic selectors for stable snapshots. Prefer:
- data-testid="..." on structural elements (cards, charts, panels, headers)
- Role-based queries when meaningful (getByRole)
- Stable container selectors (e.g., [data-testid="chat-panel"])

Candidate selectors based on current codebase structure:
- Header: [data-testid="header"] or role="banner"
- Sidebar: [data-testid="sidebar"]
- Chat area: [data-testid="chat-panel"], [data-testid="composer"], [data-testid="message-list"]
- Materials grid/list: [data-testid="materials-grid"] or [data-testid="materials-list"]
- Analytics cards/charts: [data-testid^="analytics-"], [data-testid="analytics-card"], [data-testid="line-chart"], [data-testid="bar-chart"]
- Upload panel: [data-testid="upload-panel"], [data-testid="dropzone"]
- Cookie/consent modals: [data-testid="cookie-banner"], [data-testid="consent-modal"]

Action items before enabling snapshots:
- Add data-testid attributes to key components if missing.
- Consolidate selectors in tests/visual/helpers/selectors.ts (placeholder file).

Example placeholder for helpers/selectors.ts:
export const SELECTORS = {
  header: '[data-testid="header"]',
  sidebar: '[data-testid="sidebar"]',
  chatPanel: '[data-testid="chat-panel"]',
  composer: '[data-testid="composer"]',
  messageList: '[data-testid="message-list"]',
  materialsGrid: '[data-testid="materials-grid"]',
  analyticsCard: '[data-testid="analytics-card"]',
  lineChart: '[data-testid="line-chart"]',
  barChart: '[data-testid="bar-chart"]',
  uploadPanel: '[data-testid="upload-panel"]',
  dropzone: '[data-testid="dropzone"]',
  cookieBanner: '[data-testid="cookie-banner"]',
  consentModal: '[data-testid="consent-modal"]',
};

--------------------------------------------------------------------------------
6) Handling dynamic and animated content
--------------------------------------------------------------------------------

To minimize flakiness in visual diffs:
- Disable CSS animations and transitions
- Freeze time-dependent UI (e.g., clocks, random seeds)
- Stub network calls returning non-deterministic data
- Ensure charts/graphs render deterministically (fixed data or seed)

Create a motion helper (tests/visual/helpers/motion.ts, placeholder):
export async function disableAnimations(page) {
  await page.addStyleTag({
    content: `
      * {
        transition: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
      html {
        scroll-behavior: auto !important;
      }
    `,
  });
}

Consider application-level motion control:
- The repository has src/lib/motion.ts. If it supports toggling reduced motion, set prefers-reduced-motion in Playwright context or env:
  - page.emulateMedia({ reducedMotion: 'reduce' })

Network stubbing (tests/visual/helpers/network.ts, placeholder):
export async function stabilizeNetwork(page) {
  // Example: block analytics beacons, 3rd-party calls
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.includes('analytics') || url.includes('beacon') || url.includes('metrics')) {
      return route.abort();
    }
    return route.continue();
  });
}

Cookie banners / modals:
- Programmatically dismiss or pre-set a cookie to avoid first-run UI changes:
  - await page.context().addCookies([{ name: 'cookie_consent', value: 'accepted', domain: 'localhost', path: '/' }]);

Charts:
- If charts fetch dynamic data, set deterministic mock or use static datasets.

--------------------------------------------------------------------------------
7) Viewports matrix (placeholder)
--------------------------------------------------------------------------------

Start with a small, representative matrix:
- Desktop: 1280x800 (chromium)
- Tablet: iPad (gen 7) preset
- Mobile: Pixel 5 preset

Optional matrix expansion:
- Add 1440x900 desktop
- Add dark mode variant (emulate prefers-color-scheme: dark)
- Test multiple browsers (chromium, webkit, firefox) selectively

Example viewport definitions (tests/visual/fixtures/viewports.ts, placeholder):
export const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  desktopWide: { width: 1440, height: 900 },
};

--------------------------------------------------------------------------------
8) Example spec patterns (placeholders only)
--------------------------------------------------------------------------------

Homepage snapshot flow (not committed; for reference only):
test('homepage baseline', async ({ page }) => {
  await stabilizeNetwork(page);
  await page.goto(ROUTES.home);
  await disableAnimations(page);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('main')).toHaveScreenshot('home-main.png');
});

Chat page snapshot flow (e.g., side panels collapsed/expanded):
- Snapshot with empty chat
- Snapshot after sending a seeded message (mock the response)
- Snapshot of composer focused
- Snapshot of sidebar collapsed

Materials page snapshot flow:
- Snapshot with empty state
- Snapshot with a few seeded uploaded items (mocked data)

Analytics page snapshot flow:
- Snapshot with charts loaded using fixed dataset

--------------------------------------------------------------------------------
9) CI hints and baseline management
--------------------------------------------------------------------------------

Baselines:
- Decide whether to commit baseline images. Pros: reproducible review. Cons: repo size growth.
- If not committed, store baselines in an artifact bucket (e.g., S3) via CI job steps.

CI considerations:
- Use CI=true to enforce non-interactive mode
- Limit to chromium in CI initially to reduce flake
- Configure retries for flaky diffs:
  - set expect.toHaveScreenshot.retries or test retries
- Cache node_modules and playwright browsers if your CI supports it
- When diffs occur, upload diff artifacts for review

Example CI step (generic):
- npm ci
- npx playwright install --with-deps
- npm run test:visual:ci
- Archive: playwright-report, test-results, and diff images

--------------------------------------------------------------------------------
10) Environment and data setup
--------------------------------------------------------------------------------

Environment variables:
- Ensure NEXT_PUBLIC_SITE_URL is set for baseURL in config
- If authentication is required for routes under test, provide test credentials via env and use a login helper or route mocking

Seed data:
- Prefer deterministic mocks over live backend calls in visual tests
- If backend is required, run in a stable seeded mode

--------------------------------------------------------------------------------
11) Next steps checklist (when enabling)
--------------------------------------------------------------------------------

- [ ] Decide on baseline storage strategy (commit vs artifacts)
- [ ] Add data-testid attributes to stabilize selectors
- [ ] Create tests/visual/playwright.config.ts from the placeholder
- [ ] Implement helpers (motion, network, selectors, viewports)
- [ ] Add initial specs under tests/visual/specs (home, chat, materials, analytics)
- [ ] Add npm scripts for local and CI execution
- [ ] Wire up CI workflow
- [ ] Run once locally to generate baselines, review, and commit if desired
- [ ] Document review process for diffs (who approves, thresholds)

--------------------------------------------------------------------------------
References
--------------------------------------------------------------------------------

- Playwright Visual Comparisons: https://playwright.dev/docs/test-snapshots
- Playwright Test Configuration: https://playwright.dev/docs/test-configuration
- Emulate reduced motion: https://playwright.dev/docs/api/class-page#page-emulate-media

This file is documentation-only and includes placeholders. No tests are added or executed by this change.
