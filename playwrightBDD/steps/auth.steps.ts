import { Given } from './steps';

Given('user is logged in as {string} with password {string}', async ({ loginPage }, username, password) => {
    await loginPage.login(username, password);
});

Given('user is logged in as {string} with password {string} and on the homepage', async ({ loginPage }, username, password) => {
    await loginPage.loginAndVerifyHomepage(username, password);
});