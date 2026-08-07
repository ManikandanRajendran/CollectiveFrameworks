import { expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class OrderConfirmationPage extends BasePage {

    async verifyOrderConfirmationTitle() {
        await this.page.getByTestId('confirmation-title').isVisible();
        await expect(this.page.getByTestId('confirmation-title')).toContainText('Order Confirmed');
    }

    async verifyOrderConfirmationMessage() {
        await expect(this.page.getByTestId('confirmation-message')).toHaveText('Thank you for your purchase. Your order has been placed successfully.');
    }
}