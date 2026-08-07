// Generated from: features/web/purchase.feature
import { test } from "../../../steps/steps.ts";

test.describe('verify purchase functionality', () => {

  test.describe.only('Verify user is able to purchase a product', () => {

    test('Example #1', { tag: ['@only'] }, async ({ Given, When, Then, And, loginPage, orderConfirmationPage, paymentsPage, productsPage }) => { 
      await Given('user is logged in as "demo" with password "Demo@123" and on the homepage', null, { loginPage }); 
      await And('user search a "Bluetooth Speaker"', null, { productsPage }); 
      await And('user clicks add to cart', null, { productsPage }); 
      await And('user goto cart and click proceed to checkout', null, { productsPage }); 
      await And('user clicks continue to payment', null, { paymentsPage }); 
      await And('user enter card details and click review order', null, { paymentsPage }); 
      await When('user clicks place order & pay', null, { paymentsPage }); 
      await Then('user should see the order confirmation page', null, { orderConfirmationPage }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/web/purchase.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":15,"tags":["@only"],"steps":[{"pwStepLine":9,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given user is logged in as \"demo\" with password \"Demo@123\" and on the homepage","stepMatchArguments":[{"group":{"start":21,"value":"\"demo\"","children":[{"start":22,"value":"demo","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":42,"value":"\"Demo@123\"","children":[{"start":43,"value":"Demo@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And user search a \"Bluetooth Speaker\"","stepMatchArguments":[{"group":{"start":14,"value":"\"Bluetooth Speaker\"","children":[{"start":15,"value":"Bluetooth Speaker","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And user clicks add to cart","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And user goto cart and click proceed to checkout","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And user clicks continue to payment","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And user enter card details and click review order","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When user clicks place order & pay","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then user should see the order confirmation page","stepMatchArguments":[]}]},
]; // bdd-data-end