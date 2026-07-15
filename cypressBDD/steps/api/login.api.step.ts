import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { authApi } from "../steps";

const loginViaApi = (username: string, password: string) => {
    authApi.login(username, password);
};

Given(
    "I login via API with username {string} and password {string}",
    loginViaApi,
);

When(
    "I login via API with username {string} and password {string}",
    loginViaApi,
);

Then("the API login should be successful for user {string}", (username: string) => {
    authApi.verifyLoginSuccess(username);
});

Then(
    "the API login should fail with status {int} and message {string}",
    (status: number, message: string) => {
        authApi.verifyLoginFailure(status, message);
    }
);
