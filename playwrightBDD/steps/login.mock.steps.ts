import { Given } from './steps';

Given('the login API is mocked to return {string}', async ({ loginPage }, message) => {
    await loginPage.mockLoginApiFailure(message);
});