import { BasePage, ROUTES } from "./basePage";

export class PaymentsPage extends BasePage {

    async clickContinueToPayment() {
        await this.page.getByTestId('proceed-checkout-button').click();
        await this.page.getByTestId('continue-to-payment').click();
    }

    async enterCardHolderName(){
        await this.page.getByPlaceholder('Name on card').fill('John Doe');
    }
    async enterCardNumber(){
        await this.page.getByTestId('card-number-input').fill('4111111111111111');
    }
    async enterCardExpiryDate(){
        await this.page.getByTestId('expiry-month-select').selectOption('12');
        await this.page.getByTestId('expiry-year-select').selectOption('2026');
    }
    async enterCardCVV(){
        await this.page.getByTestId('cvv-input').fill('123');
    }
    async checkTermsAndConditions(){
        await this.page.getByTestId('agree-terms-checkbox').check();
    }
    async clickReviewOrder(){
        await this.page.getByTestId('continue-to-review').click();
    }
    async enterCardDetails() {
        await this.enterCardHolderName();
        await this.enterCardNumber();
        await this.enterCardExpiryDate();
        await this.enterCardCVV();
        await this.checkTermsAndConditions();
    }

    async clickPlaceOrderAndPay(){
        await this.page.getByTestId('place-order-button').click();
    }
}