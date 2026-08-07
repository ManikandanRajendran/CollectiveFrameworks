import { Given, When, Then } from './steps';

Given('user is on the products page', async ({ productsPage }) => {
    await productsPage.goto();
});

When('user filters by category {string}', async ({ productsPage }, category: string) => {
    await productsPage.filterByCategory(category);
});

When('user searches for {string}', async ({ productsPage }, searchTerm: string) => {
    await productsPage.searchForProduct(searchTerm);
});

Then('user should see product {string}', async ({ productsPage }, productName: string) => {
    await productsPage.verifyProductVisible(productName);
});

Then('user should not see product {string}', async ({ productsPage }, productName: string) => {
    await productsPage.verifyProductNotVisible(productName);
});
