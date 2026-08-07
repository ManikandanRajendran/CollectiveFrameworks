// Generated from: features/web/products.feature
import { test } from "../../../steps/steps.ts";

test.describe('Verify products page filtering', () => {

  test.beforeEach('Background', async ({ Given, loginPage }, testInfo) => { if (testInfo.error) return;
    await Given('user is logged in as "testuser" with password "Test@123"', null, { loginPage }); 
  });
  
  test('Verify user can filter products by category Electronics', async ({ Given, When, Then, And, productsPage }) => { 
    await Given('user is on the products page', null, { productsPage }); 
    await When('user filters by category "Electronics"', null, { productsPage }); 
    await Then('user should see product "Mechanical Keyboard"', null, { productsPage }); 
    await And('user should see product "Bluetooth Speaker"', null, { productsPage }); 
    await And('user should not see product "Backpack"', null, { productsPage }); 
  });

  test('Verify user can search for a product by name', async ({ Given, When, Then, productsPage }) => { 
    await Given('user is on the products page', null, { productsPage }); 
    await When('user searches for "Keyboard"', null, { productsPage }); 
    await Then('user should see product "Mechanical Keyboard"', null, { productsPage }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/web/products.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given user is logged in as \"testuser\" with password \"Test@123\"","isBg":true,"stepMatchArguments":[{"group":{"start":21,"value":"\"testuser\"","children":[{"start":22,"value":"testuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":46,"value":"\"Test@123\"","children":[{"start":47,"value":"Test@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given user is on the products page","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When user filters by category \"Electronics\"","stepMatchArguments":[{"group":{"start":25,"value":"\"Electronics\"","children":[{"start":26,"value":"Electronics","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then user should see product \"Mechanical Keyboard\"","stepMatchArguments":[{"group":{"start":24,"value":"\"Mechanical Keyboard\"","children":[{"start":25,"value":"Mechanical Keyboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And user should see product \"Bluetooth Speaker\"","stepMatchArguments":[{"group":{"start":24,"value":"\"Bluetooth Speaker\"","children":[{"start":25,"value":"Bluetooth Speaker","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And user should not see product \"Backpack\"","stepMatchArguments":[{"group":{"start":28,"value":"\"Backpack\"","children":[{"start":29,"value":"Backpack","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":18,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given user is logged in as \"testuser\" with password \"Test@123\"","isBg":true,"stepMatchArguments":[{"group":{"start":21,"value":"\"testuser\"","children":[{"start":22,"value":"testuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":46,"value":"\"Test@123\"","children":[{"start":47,"value":"Test@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given user is on the products page","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When user searches for \"Keyboard\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Keyboard\"","children":[{"start":19,"value":"Keyboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then user should see product \"Mechanical Keyboard\"","stepMatchArguments":[{"group":{"start":24,"value":"\"Mechanical Keyboard\"","children":[{"start":25,"value":"Mechanical Keyboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end