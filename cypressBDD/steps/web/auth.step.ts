import { Given } from "cypress-cucumber-preprocessor/steps";
import { authApi } from "../steps";
import { registerAuthMocks } from "../../api/purchaseApiMocks";

Given(
    "user is logged in via API with username {string} and password {string}",
    (username: string, password: string) => {
        authApi.loginViaApi(username, password);
    },
);

Given("user visits the products page", () => {
    authApi.visitProductsPage();
});

Given("auth APIs are mocked", () => {
    registerAuthMocks();
});
