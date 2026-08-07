import { Given, When, Then } from './steps';

Given(`user search a {string}`, async({productsPage}, product) =>{
    await productsPage.searchForProduct(product);
    await productsPage.verifyProductVisible(product);
})

Given(`user clicks add to cart`, async({productsPage})=>{
    await productsPage.clickAddToCartButton();
})

Given('user goto cart and click proceed to checkout', async({productsPage}) => {
    await productsPage.goToCart();
})

Given('user clicks continue to payment', async({paymentsPage}) => {
    await paymentsPage.clickContinueToPayment();
})

Given('user enter card details and click review order', async({paymentsPage}) =>{
    await paymentsPage.enterCardDetails();
    await paymentsPage.clickReviewOrder();
})

When('user clicks place order & pay', async({paymentsPage}) => {
    await paymentsPage.clickPlaceOrderAndPay();
})

Then('user should see the order confirmation page', async({orderConfirmationPage}) => {
    await orderConfirmationPage.verifyOrderConfirmationTitle();
    await orderConfirmationPage.verifyOrderConfirmationMessage();
})

