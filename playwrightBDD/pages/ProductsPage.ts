import { expect } from "@playwright/test";
import { BasePage, ROUTES } from "./basePage";

export class ProductsPage extends BasePage {

    async goto() {
        await this.navigateTo(ROUTES.products);
    }

    async filterByCategory(category: string) {
        await this.page.getByTestId('category-dropdown').selectOption({ label: category });
    }

    async searchForProduct(searchTerm: string) {
        await this.page.getByTestId('search-input').fill(searchTerm);
    }

    async verifyProductVisible(productName: string) {
        await expect(
            this.page.getByTestId('products-container').getByRole('heading', { name: productName })
        ).toBeVisible();
    }

    async verifyProductNotVisible(productName: string) {
        await expect(
            this.page.getByTestId('products-container').getByRole('heading', { name: productName })
        ).not.toBeVisible();
    }

    async clickAddToCartButton() {
        await this.page.getByTestId('add-to-cart-prod-011').click();
    }

    async goToCart(){
        await this.page.locator('//a[@href="#/cart"]').click();
    }
}
