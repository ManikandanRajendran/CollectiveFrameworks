# Cypress BDD + TypeScript — Setup & First Test Guide

This guide walks through setting up Cypress with Cucumber BDD and TypeScript in the `cypressBDD/` project, explains each config file, and shows how to write your first test using the **4-layer pattern** used in this repo.

**Target app:** [automation-practice-store](../automation-practice-store/) running at `http://localhost:3000`

---

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Install Cypress, BDD & TypeScript](#2-install-cypress-bdd--typescript)
3. [Project structure](#3-project-structure)
4. [Config files — what they do and why](#4-config-files--what-they-do-and-why)
5. [The 4-layer test pattern](#5-the-4-layer-test-pattern)
6. [Writing your first test (login)](#6-writing-your-first-test-login)
7. [Running tests](#7-running-tests)
8. [HTML reports](#8-html-reports)
9. [Next steps](#9-next-steps)

---

## 1. Prerequisites

- **Node.js** 18+ (project tested on v20)
- **Yarn** or npm
- The practice store app running locally:

```bash
cd automation-practice-store
yarn install
yarn seed && yarn start
```

The app should be available at `http://localhost:3000`.

**Test credentials (from seed data):**

| Username  | Password   |
|-----------|------------|
| `testuser`| `Test@123` |
| `demo`    | `Demo@123` |

---

## 2. Install Cypress, BDD & TypeScript

From the `cypressBDD/` folder:

```bash
cd cypressBDD
yarn init -y
```

Install dev dependencies:

```bash
yarn add -D cypress cypress-cucumber-preprocessor typescript @types/cypress-cucumber-preprocessor
```

For HTML reports (optional but included in this project):

```bash
yarn add -D multiple-cucumber-html-reporter
```

`cypress-cucumber-preprocessor` bundles `@cypress/browserify-preprocessor` — no need to install it separately.

Add scripts to `package.json`:

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:feature": "cypress run --spec",
    "cy:report": "node scripts/generate-report.js",
    "cy:test": "cypress run && node scripts/generate-report.js"
  }
}
```

---

## 3. Project structure

```
cypressBDD/
├── features/                  # Gherkin .feature files (specs)
│   ├── web/                   # UI scenarios
│   │   ├── login.feature
│   │   └── purchase.feature
│   └── api/                   # API-only scenarios
│       └── login.feature
├── steps/                     # Step definitions (Cucumber glue code)
│   ├── steps.ts               # Shared fixtures (page objects, APIs)
│   ├── web/
│   │   ├── login.step.ts
│   │   ├── auth.step.ts
│   │   └── purchase.step.ts
│   └── api/
│       └── login.api.step.ts
├── pages/web/                 # Page Object Model
│   ├── LoginPage.ts
│   └── PurchasePage.ts
├── api/                       # API helpers & mocks
│   ├── AuthApi.ts
│   ├── cartMockState.ts
│   └── purchaseApiMocks.ts
├── apiFixtures/               # JSON mock responses
├── reports/                   # Generated Cucumber JSON + HTML
├── scripts/
│   └── generate-report.js
├── cypress.config.ts          # Cypress main config
├── tsconfig.json              # TypeScript config
└── .cypress-cucumber-preprocessorrc.json
```

**Why this layout?**

| Layer        | Responsibility                          |
|--------------|-----------------------------------------|
| `features/`  | Human-readable scenarios (Gherkin)      |
| `steps/`     | Maps Gherkin steps → code               |
| `pages/`     | UI locators & actions (Page Object)     |
| `api/`       | HTTP helpers, intercept mocks           |

---

## 4. Config files — what they do and why

### 4.1 `cypress.config.ts`

Cypress looks for this file at the project root. It controls how tests run.

```typescript
import { defineConfig } from "cypress";

const browserify = require("@cypress/browserify-preprocessor");
const cucumber = require("cypress-cucumber-preprocessor").default;
const resolve = require("resolve");

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "features/**/*.feature",
    supportFile: false,
    setupNodeEvents(on, config) {
      const options = {
        ...browserify.defaultOptions,
        typescript: resolve.sync("typescript", { baseDir: config.projectRoot }),
      };
      on("file:preprocessor", cucumber(options));
      return config;
    },
  },
});
```

| Setting | Value | Why |
|---------|-------|-----|
| `baseUrl` | `http://localhost:3000` | All `cy.visit("/#/login")` calls resolve against the app. No hardcoded full URLs in tests. |
| `specPattern` | `features/**/*.feature` | Tells Cypress to run **Gherkin feature files**, not default `cypress/e2e/*.cy.ts`. |
| `supportFile: false` | `false` | Disables `cypress/support/e2e.ts`. This project wires everything through step definitions instead. |
| `setupNodeEvents` + `cucumber(options)` | preprocessor hook | Compiles `.feature` → executable tests. Browserify bundles step `.ts` files. `typescript` option enables `.ts` step definitions. |

Without the cucumber preprocessor, Cypress cannot understand `.feature` files.

---

### 4.2 `tsconfig.json`

TypeScript needs its own config — separate from Cypress.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["cypress", "node"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

| Option | Why |
|--------|-----|
| `strict: true` | Catches type errors in page objects and API helpers early. |
| `forceConsistentCasingInFileNames` | Prevents import bugs on macOS (`PurchasePage.ts` vs `purchasePage.ts`). |
| `types: ["cypress", "node"]` | Gives autocomplete for `cy.*` and Node APIs in step files. |
| `module: "commonjs"` | Matches what Browserify expects when bundling step definitions. |

---

### 4.3 `.cypress-cucumber-preprocessorrc.json`

Tells the Cucumber preprocessor where step definitions live and where to write JSON reports.

```json
{
  "stepDefinitions": "steps",
  "cucumberJson": {
    "generate": true,
    "outputFolder": "reports/cucumber-json",
    "fileSuffix": ".cucumber"
  }
}
```

| Setting | Why |
|---------|-----|
| `stepDefinitions: "steps"` | Cucumber scans `steps/` (and subfolders) for `Given` / `When` / `Then` handlers. |
| `cucumberJson` | Produces JSON after each run — required for the HTML report generator. |

---

## 5. The 4-layer test pattern

Every UI test in this project follows four layers:

```
Feature (.feature)  →  Steps (.step.ts)  →  Page Object (.ts)  →  Fixture (steps.ts)
```

**Example flow for login:**

```
login.feature          login.step.ts           LoginPage.ts           steps.ts
─────────────          ─────────────           ────────────           ────────
Given user is     →    loginPage.goto()   →    cy.visit("/#/login")
in login page
```

**Rules:**

1. **Feature** — only Gherkin. No selectors, no code.
2. **Steps** — thin glue. Import page objects from `steps.ts`, call one method per step.
3. **Page Object** — all `cy.get`, `cy.click`, assertions. One class per page.
4. **Fixture (`steps.ts`)** — single place to instantiate and export shared objects.

---

## 6. Writing your first test (login)

### Step 1 — Create the feature file

`features/web/login.feature`:

```gherkin
Feature: Verify login and logout functionality

Scenario: Verify user is able to login with valid credentials
    Given user is in login page
    And User enter the username as "testuser" and password as "Test@123"
    When user click login button
    And user should be logged in
    And user should see the homepage
```

Gherkin keywords:

| Keyword | Purpose |
|---------|---------|
| `Feature` | Groups related scenarios |
| `Scenario` | One test case |
| `Given` | Precondition (setup) |
| `When` | Action |
| `Then` / `And` | Assertion or follow-up action |

---

### Step 2 — Create the page object

`pages/web/LoginPage.ts`:

```typescript
export class LoginPage {
    goto() {
        cy.visit("/#/login");
    }

    enterUsername(username: string) {
        cy.get("#username").clear();
        if (username) {
            cy.get("#username").type(username);
        }
    }

    enterPassword(password: string) {
        cy.get('[data-testid="password-input"]').clear();
        if (password) {
            cy.get('[data-testid="password-input"]').type(password);
        }
    }

    clickLoginButton() {
        cy.get('[data-testid="login-submit-button"]').contains("Login").click();
    }

    verifyLoggedIn() {
        cy.get('[data-testid="logout-button"]').should("be.visible");
    }

    verifyHomePage() {
        cy.get('[data-testid="products-title"]').should("be.visible");
    }
}
```

**Tips:**

- Prefer `[data-testid="..."]` selectors — stable and explicit.
- Use `.clear()` before `.type()` for empty-field scenarios (`cy.type('')` throws in Cypress).
- Keep assertions in page objects, not in step files.

---

### Step 3 — Create the fixture file

`steps/steps.ts`:

```typescript
import { LoginPage } from "../pages/web/LoginPage";

export const loginPage = new LoginPage();
```

This gives every step file a single shared `loginPage` instance.

---

### Step 4 — Create step definitions

`steps/web/login.step.ts`:

```typescript
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { loginPage } from "../steps";

Given("user is in login page", () => {
    loginPage.goto();
});

Given(
    "User enter the username as {string} and password as {string}",
    (username: string, password: string) => {
        loginPage.enterUsername(username);
        loginPage.enterPassword(password);
    },
);

When("user click login button", () => {
    loginPage.clickLoginButton();
});

When("user should be logged in", () => {
    loginPage.verifyLoggedIn();
});

When("user should see the homepage", () => {
    loginPage.verifyHomePage();
});
```

**Important:** The step text must match the feature file **exactly** (including capitalisation). `{string}` captures quoted values from Gherkin.

---

### Step 5 — Run your first test

Make sure the app is running, then:

```bash
# Interactive mode — watch the browser
yarn cy:open

# Headless — single feature
yarn cy:run:feature features/web/login.feature
```

You should see:

```
✓ Verify user is able to login with valid credentials
```

---

## 7. Running tests

| Command | What it does |
|---------|--------------|
| `yarn cy:open` | Opens Cypress UI — pick a feature and watch it run |
| `yarn cy:run` | Runs all features headlessly |
| `yarn cy:run:feature features/web/login.feature` | Runs one feature file |
| `yarn cy:run:mock` | Runs only scenarios tagged `@mock` |
| `yarn cy:run:integration` | Runs only scenarios tagged `@integration` |

**Scenario tags** (in the feature file):

```gherkin
@integration
Scenario Outline: Verify user can purchase a product
    ...

@mock
Scenario: Verify user can purchase a product using mock
    ...
```

Filter with: `cypress run --env TAGS='@mock'`

---

## 8. HTML reports

After a test run, Cucumber JSON is written to `reports/cucumber-json/`.

Generate the HTML report:

```bash
yarn cy:report
```

Or run tests and report in one step:

```bash
yarn cy:test
```

Open `reports/cucumber-html/index.html` in a browser.

---

## 9. Next steps

Once your first login test passes, extend in this order:

1. **More scenarios** — add `Scenario Outline` with `Examples` tables for data-driven tests.
2. **API tests** — use `cy.request()` in `api/` helpers (`features/api/login.feature`).
3. **API login for UI tests** — store token in `localStorage` and skip the login form (`AuthApi.ts`).
4. **Network mocks** — `cy.intercept()` + `.as('alias')` for isolated UI tests (`purchaseApiMocks.ts`).
5. **Purchase flow** — see `features/web/purchase.feature` for the full checkout scenario.

---

## Quick troubleshooting

| Problem | Fix |
|---------|-----|
| `No tests found` | Check `specPattern` in `cypress.config.ts` points to `features/**/*.feature` |
| Step definition not found | Ensure step text matches feature exactly; file is under `steps/` |
| `cy.type('')` fails | Use `.clear()` only — don't type an empty string |
| Wrong app on port 3000 | Confirm `automation-practice-store` is running, not another service |
| TypeScript import error | Check filename casing matches import (`PurchasePage.ts`) |
| Chrome password-leak popup | `before:browser:launch` flags in `cypress.config.ts` disable it |

---

## Summary

```
Install  →  Config (cypress + ts + cucumber)  →  Feature  →  Steps  →  Page Object  →  Run
```

The three config files each solve a distinct problem:

- **`cypress.config.ts`** — how Cypress runs (URL, spec pattern, BDD preprocessor)
- **`tsconfig.json`** — how TypeScript compiles step/page files
- **`.cypress-cucumber-preprocessorrc.json`** — where Cucumber finds steps and writes reports

Your first test needs only four files: `.feature`, `.step.ts`, `Page.ts`, and `steps.ts`. Everything else builds on that foundation.
