import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { purchaseApi } from "../steps";

Given("I add item to cart via API", () => {
    purchaseApi.addItemToCart();
})

When("I validate the cart item via API", () => {
    purchaseApi.validateCartItem();
})

When("I checkout and pay via API", () => {
    purchaseApi.checkoutAndPay();
})

Then("verify the order confirmation via API", () => {
    purchaseApi.verifyOrderConfirmation();
})

When("I remove the cart item via API", () => {
    purchaseApi.removeCartItem();
})

Then("the api should return {string} message", (message: string) => {
    purchaseApi.verifyCartCleared(message);
})