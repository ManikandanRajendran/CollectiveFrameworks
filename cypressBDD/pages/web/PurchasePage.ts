export class PurchasePage {
    searchProduct(product: string) {
        cy.get("#search").type(product);
    }

    clickAddToCart() {
        cy.get("[data-testid='add-to-cart-prod-008']").click();
    }

    navigateToCart() {
        cy.get("[data-testid='nav-cart']").click();
    }

    clickProceedToCheckout() {
        cy.get("[data-testid='proceed-checkout-button']").click();
    }

    clickContinueToPayment() {
        cy.get("[data-testid='continue-to-payment']").click();
    }

    enterCardHolderName(cardHolderName: string) {
        cy.get("#cardHolder").type(cardHolderName);
    }

    enterCardNumber(cardNumber: string) {
        cy.get("#cardNumber").type(cardNumber);
    }

    enterCardExpirationDate(cardExpirationMonth: string, cardExpirationYear: string) {
        cy.get('[data-testid="expiry-month-select"]').select(cardExpirationMonth);
        cy.get('[data-testid="expiry-year-select"]').select(cardExpirationYear);
    }

    enterCardCVV(cardCVV: string) {
        cy.get("#cvv").type(cardCVV);
    }

    acceptTermsAndConditions() {
        cy.get("#agree-terms").check();
    }

    continueToReview() {
        cy.get("[data-testid='continue-to-review']").click();
    }

    clickPlaceOrderAndPay() {
        cy.get("[data-testid='place-order-button']").click();
    }

    enterPaymentDetails() {
        this.enterCardHolderName("Alex");
        this.enterCardNumber("4111111111111111");
        this.enterCardExpirationDate("12", "2026");
        this.enterCardCVV("123");
        this.acceptTermsAndConditions();
        this.continueToReview();
        this.clickPlaceOrderAndPay();
    }

    verifyOrderConfirmationPage() {
        cy.get('[data-testid="confirmation-title"]')
            .should("be.visible")
            .and("have.text", "Order Confirmed!");

        cy.get('[data-testid="confirmation-message"]')
            .should("be.visible")
            .and(
                "contain.text",
                "Thank you for your purchase. Your order has been placed successfully.",
            );
    }
}
