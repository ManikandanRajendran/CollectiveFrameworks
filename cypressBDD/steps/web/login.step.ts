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
    }
);

When("user enters login credentials:", (dataTable: any) => {
    const credentials = dataTable.rowsHash();
    loginPage.enterUsername(credentials.username);
    loginPage.enterPassword(credentials.password);
})

Then("user attempts login with the following credentials and see proper error message:", (dataTable: any) => {
    const credentials = dataTable.hashes();
    cy.wrap(credentials).each((credential: any) => {
        loginPage.enterUsername(credential.username);
        loginPage.enterPassword(credential.password);
        loginPage.clickLoginButton();
        loginPage.verifyFieldValidation(credential.field);
    });
})

When("user click login button", () => {
    loginPage.clickLoginButton();
});

When("user should be logged in", () => {
    loginPage.verifyLoggedIn();
});

When("user should see the homepage", () => {
    loginPage.verifyHomePage();
});

When("user clicks logout button", () => {
    loginPage.clickLogoutButton();
});

Then("user should be logged out successfully", () => {
    loginPage.verifyLoggedOut();
});

Then("user should see login {string}", (errorMessage: string) => {
    loginPage.verifyLoginError(errorMessage);
});

Then("the {string} field should show validation", (field: string) => {
    loginPage.verifyFieldValidation(field);
});
