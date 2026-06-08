//parallel test hooks can overwrite that single shared reference
import { Given, When, Then } from './steps';


Given('user is in login page', async ({ loginPage }) => {
    await loginPage.goto();
});

Given('User enter the username as {string} and password as {string}', async ({ loginPage }, username, password) => {
    await loginPage.enterUsername(username)
    await loginPage.enterPassword(password)
});

When('user click login button', async ({ loginPage }) => {
    await loginPage.clickLoginButton();
});

Then('user should be logged in', async ({ loginPage }) => {
    await loginPage.verifyLoggedIn();
});

Then('user should see the homepage', async ({ loginPage }) => {
    await loginPage.verifyHomePage();
});

When('user clicks logout button', async({loginPage})=>{
    await loginPage.clickLogoutButton();
});

Then('user should be logged out', async({loginPage}) => {
    await loginPage.verifyLoggedOut();
})

Then('user should see login {string}', async({loginPage}, errorMessage: string) => {
    await loginPage.verifyLoginError(errorMessage);
})

Then('the {string} field should show validation', async({loginPage}, field: string) => {
    await loginPage.verifyFieldValidation(field);
})