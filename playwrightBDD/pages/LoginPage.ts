import { expect } from "@playwright/test";
import { BasePage, ROUTES } from "./basePage";
import { mockLoginFailure } from "../mocks/authMocks";

export class LoginPage extends BasePage {

    async goto() {
        await this.navigateTo(ROUTES.login);
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

    async login(username: string, password: string) {
        await this.goto();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        await this.verifyLoggedIn();
    }
    async loginAndVerifyHomepage(username: string, password: string) {
        await this.login(username, password);
        await this.verifyHomePage();
    }

    async mockLoginApiFailure(message: string) {
        await mockLoginFailure(this.page, message);
    }
}