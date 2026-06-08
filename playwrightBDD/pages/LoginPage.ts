import { Page, expect } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('/#/login');
    }

    async enterUsername(username: string) {
        await this.page.locator(`#username`).fill(username);
    }

    async enterPassword(password: string) {
        await this.page.getByTestId('password-input').fill(password);
    }
    
    async clickLoginButton() {
        await this.page.getByRole('button', {name: 'Login'}).click();
    }

    async clickLogoutButton() {
        await this.page.getByRole('button', {name: 'Logout'}).click();
    }
    
    async verifyLoggedIn() {
        await expect(this.page.getByRole('button', {name: 'Logout'})).toBeVisible();
    }

    async verifyHomePage() {
        await expect(this.page.getByTestId('products-title')).toBeVisible();
    }

    async verifyLoggedOut() {
        await expect(this.page.getByRole('button', {name: 'Login'})).toBeVisible();
    }

    async verifyLoginError(errorMessage: string) {
        await expect(this.page.getByTestId('login-error')).toHaveText(errorMessage);
    }

    async verifyFieldValidation(field: string) {
        const fieldLocator = this.page.getByTestId(`${field}-input`);
        await expect(fieldLocator).toHaveJSProperty('validity.valueMissing', true);
        await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
    }
}