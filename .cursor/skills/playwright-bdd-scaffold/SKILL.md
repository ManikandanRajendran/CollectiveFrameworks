---
name: playwright-bdd-scaffold
description: >-
  Scaffolds Playwright BDD tests in CollectiveFrameworks using the 4-layer
  pattern (feature → steps → page object → fixture). Use when adding scenarios,
  step definitions, page objects, fixtures, or when the user mentions bddgen,
  Gherkin, playwright-bdd, or new test flows in playwrightBDD/.
---

# Playwright BDD Scaffold

## Architecture (mandatory)

```
features/*.feature
    → bddgen → .features-gen/
steps/*.step.ts        (thin glue only)
pages/*.ts             (locators + actions + assertions)
steps/steps.ts         (fixtures for page objects)
playwright.config.ts   (webServer seeds app + starts :3000)
```

## Workflow when adding a new test flow

1. Add scenario to `playwrightBDD/features/*.feature`
2. Run `npx bddgen` from `playwrightBDD/` — implement any missing step snippets
3. Keep steps thin — delegate to page object methods only
4. Put all locators in `pages/*.ts`, never in step files
5. If new page class: register fixture in `steps/steps.ts`
6. Verify: `yarn test` from `playwrightBDD/`

## Step definition rules

- Import `Given`, `When`, `Then` from `./steps` (not directly from playwright-bdd)
- Gherkin `{string}` params are positional arguments, NOT fixtures:

```typescript
// CORRECT
Given('User enter the username as {string} and password as {string}',
  async ({ loginPage }, username, password) => {
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
  });

// WRONG — username/password are not fixtures
async ({ loginPage, username, password }) => { ... }
```

- `And` / `But` are allowed in `.feature` files only
- Step definitions use `Given`, `When`, or `Then` only — never `And(...)`

## Fixture rules (parallel safety)

- `fullyParallel: true` in playwright.config.ts
- Never use module-level `let loginPage` — use Playwright fixtures
- One page object instance per test via `steps/steps.ts`

## Test data

- Seeded credentials: `testuser` / `Test@123`
- App is started via webServer: `cd ../automation-practice-store && npm run seed && npm run start`
- baseURL: `http://localhost:3000`

## Validation strategies

- App errors → assert DOM via `getByTestId('login-error')`
- HTML5 required-field validation → assert `validity.valueMissing`, not tooltip text

## CI notes

- Workflow: `.github/workflows/playwright.yaml`
- CI always seeds via webServer; local runs reuse server on :3000 when not in CI
- On failure: HTML report uploaded as artifact from `playwrightBDD/playwright-report/`

## Reference files

- Example feature: `playwrightBDD/features/login.feature`
- Example steps: `playwrightBDD/steps/login.step.ts`
- Example page: `playwrightBDD/pages/LoginPage.ts`
- Example fixtures: `playwrightBDD/steps/steps.ts`
