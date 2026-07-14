import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { purchasePage } from "../steps";
import {
    registerAllPurchaseMocks,
    registerCartMocks,
    registerPaymentAndOrderMocks,
    registerProductsMock,
    registerValidateMock,
} from "../../api/purchaseApiMocks";

Given("all purchase APIs are mocked", () => {
    registerAllPurchaseMocks();
});

Given("checkout payment and order APIs are mocked", () => {
    registerPaymentAndOrderMocks();
});

Given("checkout validate API is mocked", () => {
    registerValidateMock();
});

Given("cart APIs are mocked", () => {
    registerCartMocks();
});

Given("call mocked products response", () => {
    registerProductsMock();
});

When("user searching a {string}", (product: string) => {
    purchasePage.searchProduct(product);
});

When("user clicks add to cart", () => {
    purchasePage.clickAddToCart();
});

When("user navigates to cart", () => {
    purchasePage.navigateToCart();
});

When("user clicks proceed to checkout", () => {
    purchasePage.clickProceedToCheckout();
});

When("user clicks continue to payment", () => {
    purchasePage.clickContinueToPayment();
});

When("user enter payment details", () => {
    purchasePage.enterPaymentDetails();
});

Then("user should see the order confirmation page", () => {
    purchasePage.verifyOrderConfirmationPage();
});
