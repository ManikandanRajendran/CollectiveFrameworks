import { test as base, createBdd } from "playwright-bdd";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { PaymentsPage } from "../pages/paymentsPage";
import { OrderConfirmationPage } from "../pages/orderConfirmationPage";
import { AuthApi } from "../api/AuthApi";

// 1. Tell Playwright what page object "bowls" are available
type MyFixtures = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    paymentsPage: PaymentsPage;
    orderConfirmationPage: OrderConfirmationPage;
    authApi: AuthApi;
};

// 2. Extend the base test to automatically instantiate the page objects
export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    paymentsPage: async({page}, use)=>{
        await use(new PaymentsPage(page));
    },
    orderConfirmationPage: async ({page}, use) =>{
        await use(new OrderConfirmationPage(page));
    },
    authApi: async({ request }, use) => {
        await use(new AuthApi(request));
    }
});

// 3. Export the BDD keywords linked to your custom test fixtures
export const { Given, When, Then } = createBdd(test);