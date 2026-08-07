// Generated from: features/web/login.feature
import { test } from "../../../steps/steps.ts";

test.describe('Verify login functionality', () => {

  test('Verify login error when API returns mocked failure', { tag: ['@mock'] }, async ({ Given, When, Then, And, loginPage, page }) => { 
    await Given('the login API is mocked to return "Service unavailable"', null, { loginPage }); 
    await And('user is in login page', null, { loginPage }); 
    await And('User enter the username as "testuser" and password as "Test@123"', null, { loginPage }); 
    await When('user click login button', null, { loginPage }); 
    await Then('user should see login "Service unavailable"', null, { loginPage, page }); 
  });

  test('Verify user is able to login with valid credentials', async ({ Given, When, Then, And, loginPage }) => { 
    await Given('user is in login page', null, { loginPage }); 
    await And('User enter the username as "testuser" and password as "Test@123"', null, { loginPage }); 
    await When('user click login button', null, { loginPage }); 
    await Then('user should be logged in', null, { loginPage }); 
    await And('user should see the homepage', null, { loginPage }); 
  });

  test('Verify user is able to login and logout with valid credentials', async ({ Given, When, Then, And, loginPage }) => { 
    await Given('user is in login page', null, { loginPage }); 
    await And('User enter the username as "testuser" and password as "Test@123"', null, { loginPage }); 
    await When('user click login button', null, { loginPage }); 
    await And('user should be logged in', null, { loginPage }); 
    await And('user clicks logout button', null, { loginPage }); 
    await Then('user should be logged out', null, { loginPage }); 
  });

  test.describe('Verify user cannot login with invalid credentials', () => {

    test('Example #1', async ({ Given, When, Then, And, loginPage, page }) => { 
      await Given('user is in login page', null, { loginPage }); 
      await And('User enter the username as "testuser" and password as "wrongpassword"', null, { loginPage }); 
      await When('user click login button', null, { loginPage }); 
      await Then('user should see login "Invalid username or password"', null, { loginPage, page }); 
    });

  });

  test.describe('Verify the error message when username/password is empty', () => {

    test('Example #1', async ({ Given, When, Then, And, loginPage }) => { 
      await Given('user is in login page', null, { loginPage }); 
      await And('User enter the username as "demo" and password as ""', null, { loginPage }); 
      await When('user click login button', null, { loginPage }); 
      await Then('the "password" field should show validation', null, { loginPage }); 
    });

    test('Example #2', async ({ Given, When, Then, And, loginPage }) => { 
      await Given('user is in login page', null, { loginPage }); 
      await And('User enter the username as "" and password as "Test@123"', null, { loginPage }); 
      await When('user click login button', null, { loginPage }); 
      await Then('the "username" field should show validation', null, { loginPage }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/web/login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":["@mock"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given the login API is mocked to return \"Service unavailable\"","stepMatchArguments":[{"group":{"start":34,"value":"\"Service unavailable\"","children":[{"start":35,"value":"Service unavailable","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And user is in login page","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And User enter the username as \"testuser\" and password as \"Test@123\"","stepMatchArguments":[{"group":{"start":27,"value":"\"testuser\"","children":[{"start":28,"value":"testuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"\"Test@123\"","children":[{"start":55,"value":"Test@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When user click login button","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then user should see login \"Service unavailable\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Service unavailable\"","children":[{"start":23,"value":"Service unavailable","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":14,"pickleLine":11,"tags":[],"steps":[{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given user is in login page","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"And User enter the username as \"testuser\" and password as \"Test@123\"","stepMatchArguments":[{"group":{"start":27,"value":"\"testuser\"","children":[{"start":28,"value":"testuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"\"Test@123\"","children":[{"start":55,"value":"Test@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When user click login button","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then user should be logged in","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And user should see the homepage","stepMatchArguments":[]}]},
  {"pwTestLine":22,"pickleLine":18,"tags":[],"steps":[{"pwStepLine":23,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Given user is in login page","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"And User enter the username as \"testuser\" and password as \"Test@123\"","stepMatchArguments":[{"group":{"start":27,"value":"\"testuser\"","children":[{"start":28,"value":"testuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"\"Test@123\"","children":[{"start":55,"value":"Test@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When user click login button","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"And user should be logged in","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"And user clicks logout button","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then user should be logged out","stepMatchArguments":[]}]},
  {"pwTestLine":33,"pickleLine":33,"tags":[],"steps":[{"pwStepLine":34,"gherkinStepLine":27,"keywordType":"Context","textWithKeyword":"Given user is in login page","stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":28,"keywordType":"Context","textWithKeyword":"And User enter the username as \"testuser\" and password as \"wrongpassword\"","stepMatchArguments":[{"group":{"start":27,"value":"\"testuser\"","children":[{"start":28,"value":"testuser","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"\"wrongpassword\"","children":[{"start":55,"value":"wrongpassword","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":36,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"When user click login button","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"Then user should see login \"Invalid username or password\"","stepMatchArguments":[{"group":{"start":22,"value":"\"Invalid username or password\"","children":[{"start":23,"value":"Invalid username or password","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":44,"pickleLine":43,"tags":[],"steps":[{"pwStepLine":45,"gherkinStepLine":36,"keywordType":"Context","textWithKeyword":"Given user is in login page","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":37,"keywordType":"Context","textWithKeyword":"And User enter the username as \"demo\" and password as \"\"","stepMatchArguments":[{"group":{"start":27,"value":"\"demo\"","children":[{"start":28,"value":"demo","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":50,"value":"\"\"","children":[{"start":51,"value":"","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":47,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When user click login button","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then the \"password\" field should show validation","stepMatchArguments":[{"group":{"start":4,"value":"\"password\"","children":[{"start":5,"value":"password","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":51,"pickleLine":44,"tags":[],"steps":[{"pwStepLine":52,"gherkinStepLine":36,"keywordType":"Context","textWithKeyword":"Given user is in login page","stepMatchArguments":[]},{"pwStepLine":53,"gherkinStepLine":37,"keywordType":"Context","textWithKeyword":"And User enter the username as \"\" and password as \"Test@123\"","stepMatchArguments":[{"group":{"start":27,"value":"\"\"","children":[{"start":28,"value":"","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":46,"value":"\"Test@123\"","children":[{"start":47,"value":"Test@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":54,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When user click login button","stepMatchArguments":[]},{"pwStepLine":55,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then the \"username\" field should show validation","stepMatchArguments":[{"group":{"start":4,"value":"\"username\"","children":[{"start":5,"value":"username","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end