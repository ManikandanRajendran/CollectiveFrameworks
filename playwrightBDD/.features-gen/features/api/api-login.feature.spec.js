// Generated from: features/api/api-login.feature
import { test } from "../../../steps/steps.ts";

test.describe('API Login', () => {

  test('Login via API with valid credentials', async ({ When, Then, authApi }) => { 
    await When('I login via API with username "demo" and password "Demo@123"', null, { authApi }); 
    await Then('the API login should succeed for user "demo"', null, { authApi }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/api/api-login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Action","textWithKeyword":"When I login via API with username \"demo\" and password \"Demo@123\"","stepMatchArguments":[{"group":{"start":30,"value":"\"demo\"","children":[{"start":31,"value":"demo","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":50,"value":"\"Demo@123\"","children":[{"start":51,"value":"Demo@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then the API login should succeed for user \"demo\"","stepMatchArguments":[{"group":{"start":38,"value":"\"demo\"","children":[{"start":39,"value":"demo","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end