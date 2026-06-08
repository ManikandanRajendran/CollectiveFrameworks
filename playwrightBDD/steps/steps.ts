import { test as base, createBdd } from "playwright-bdd";
import { LoginPage } from "../pages/LoginPage";

// 1. Tell Playwright what page object "bowls" are available
type MyFixtures = {
    loginPage: LoginPage;
};

// 2. Extend the base test to automatically instantiate the page objects
export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});

// 3. Export the BDD keywords linked to your custom test fixtures
export const { Given, When, Then } = createBdd(test);