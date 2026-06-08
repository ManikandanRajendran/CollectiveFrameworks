# Playwright BDD — Login Automation

End-to-end BDD test suite for the [Automation Practice Store](../automation-practice-store/) login flows. Scenarios are written in Gherkin, executed with the Playwright Test runner via [playwright-bdd](https://github.com/vitalets/playwright-bdd), and structured with the Page Object Model.

[![Playwright BDD Tests](https://github.com/ManikandanRajendran/CollectiveFrameworks/actions/workflows/playwright.yaml/badge.svg)](https://github.com/ManikandanRajendran/CollectiveFrameworks/actions/workflows/playwright.yaml)

## What is covered

| Area | Scenarios |
|------|-----------|
| Happy path | Login with valid credentials, verify homepage |
| Session | Login and logout |
| Negative (app error) | Invalid credentials → DOM error message |
| Negative (browser validation) | Empty username/password → HTML5 constraint validation |

**Test credentials:** `testuser` / `Test@123` (seeded by the app)

## Tech stack

- [Playwright Test](https://playwright.dev/) — browser automation and runner
- [playwright-bdd](https://github.com/vitalets/playwright-bdd) — Gherkin → native Playwright tests
- TypeScript — step definitions and page objects
- GitHub Actions — CI on every push and pull request

## Project structure

```
playwrightBDD/
├── features/           # Gherkin feature files
│   └── login.feature
├── steps/              # Step definitions (glue layer)
│   ├── steps.ts        # Custom fixtures (loginPage)
│   └── login.step.ts
├── pages/              # Page Object Model
│   └── LoginPage.ts
├── playwright.config.ts
└── package.json
```

Generated tests (do not edit manually):

```
.features-gen/          # Created by bddgen on each test run
```

## Architecture

```
login.feature
     │
     ▼  bddgen
.features-gen/*.spec.js
     │
     ▼
steps/login.step.ts     ← glue: maps Gherkin steps to page object calls
     │
     ▼
pages/LoginPage.ts      ← locators, actions, assertions
     │
     ▼
Playwright Test         ← browser, parallel workers, reports
     │
     ▼
webServer               ← seeds data + starts automation-practice-store
     │
     ▼
http://localhost:3000
```

### Layer responsibilities

| Layer | Role |
|-------|------|
| **Feature** | Describes behaviour in business language (`Given` / `When` / `Then`) |
| **Steps** | Thin glue — receives fixtures and step parameters, delegates to pages |
| **Pages** | UI interaction and assertions — locators live here only |
| **Fixtures** | One `LoginPage` instance per test worker (parallel-safe) |

## Design decisions

**Why playwright-bdd?**  
Keeps scenarios readable for QA and stakeholders while still using the Playwright runner (parallelism, traces, HTML report, fixtures).

**Why Playwright fixtures for page objects?**  
A module-level `let loginPage` is unsafe when `fullyParallel: true` — workers can overwrite shared state. Fixtures give each test its own instance automatically.

**Why two validation strategies?**  
- App errors (`data-testid="login-error"`) → assert visible DOM text  
- Native HTML5 validation (empty required fields) → assert `validity.valueMissing`, not tooltip text (browser wording varies)

**Why seed in `webServer`?**  
User data lives in gitignored Excel files. CI starts with an empty database unless `npm run seed` runs before the app starts. Seeding in `webServer` keeps local and CI environments consistent.

## Prerequisites

- Node.js 18+
- Yarn
- The app in `../automation-practice-store` installed and seedable

## Run locally

### Option A — let Playwright manage the app (recommended)

From this directory:

```bash
yarn install
npx playwright install chromium
yarn test
```

`playwright.config.ts` starts the store automatically:

```bash
cd ../automation-practice-store && npm run seed && npm run start
```

If the app is already running on port 3000, Playwright reuses it locally (`reuseExistingServer: !process.env.CI`).

### Option B — start the app yourself

Terminal 1:

```bash
cd ../automation-practice-store
npm install
npm run seed
npm start
```

Terminal 2:

```bash
cd playwrightBDD
yarn install
yarn test
```

### View report

```bash
yarn report
```

## CI/CD

Workflow: [`.github/workflows/playwright.yaml`](../.github/workflows/playwright.yaml)

On every **push** and **pull request**:

1. Install app dependencies (`npm ci`) and test dependencies (`yarn install`)
2. Install Playwright Chromium with system dependencies
3. Run `yarn test` — bddgen generates specs, webServer seeds and starts the app, tests run in parallel
4. Upload HTML report as an artifact if the job fails (retained 14 days)

Latest run: [GitHub Actions](https://github.com/ManikandanRajendran/CollectiveFrameworks/actions/workflows/playwright.yaml)

## Configuration highlights

| Setting | Value | Purpose |
|---------|-------|---------|
| `baseURL` | `http://localhost:3000` | Relative navigation in steps (`/#/login`) |
| `fullyParallel` | `true` | Scenarios run in parallel across workers |
| `trace` | `on-first-retry` | Debug flaky failures |
| `screenshot` | `only-on-failure` | Evidence in HTML report |
| `video` | `on` | Full run recording |

## Adding a new scenario

1. Write the scenario in `features/*.feature`
2. Run `npx bddgen` — missing steps print as snippets
3. Implement steps in `steps/` using existing page objects or add a new page class
4. Register new page objects as fixtures in `steps/steps.ts` if needed
5. Run `yarn test`

## Scripts

| Command | Description |
|---------|-------------|
| `yarn test` | Generate BDD specs and run all tests |
| `yarn report` | Open the last HTML report |
