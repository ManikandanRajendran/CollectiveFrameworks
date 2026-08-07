import { expect } from '@playwright/test';
import { When, Then } from './steps';

When('I login via API with username {string} and password {string}',
    async ({ authApi }, username, password) => {
        const response = await authApi.login(username, password);
        (authApi as any).lastResponse = response;  // simple stash for Then step
    }
);

Then('the API login should succeed for user {string}',
    async ({ authApi }, username) => {
        const response = (authApi as any).lastResponse;
        console.log(await response.json());
        
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.user.username).toBe(username);
        expect(body.data.token).toBeTruthy();
    }
);