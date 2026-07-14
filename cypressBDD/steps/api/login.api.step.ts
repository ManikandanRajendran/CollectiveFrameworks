import { When, Then } from "cypress-cucumber-preprocessor/steps";
import { authApi } from "../steps";

When(
    "I login via API with username {string} and password {string}",
    (username: string, password: string) => {
        authApi.login(username, password);
    }
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
