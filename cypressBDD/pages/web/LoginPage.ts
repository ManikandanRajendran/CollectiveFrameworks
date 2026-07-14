export class LoginPage {
    goto() {
        cy.visit("/#/login");
    }

    enterUsername(username: string) {
        cy.get("#username").clear();
        if (username) {
            cy.get("#username").type(username);
        }
    }

    enterPassword(password: string) {
        cy.get('[data-testid="password-input"]').clear();
        if (password) {
            cy.get('[data-testid="password-input"]').type(password);
        }
    }

    clickLoginButton() {
        cy.get('[data-testid="login-submit-button"]').contains("Login").click();
    }

    verifyLoggedIn() {
        cy.get('[data-testid="logout-button"]').contains("Logout").should("be.visible");
    }

    verifyHomePage() {
        cy.get('[data-testid="products-title"]').should("be.visible");
    }

    clickLogoutButton() {
        cy.get('[data-testid="logout-button"]').contains("Logout").click();
    }

    verifyLoggedOut() {
        cy.get('[data-testid="login-submit-button"]').contains("Login").should("be.visible");
    }

    verifyLoginError(errorMessage: string) {
        cy.get('[data-testid="login-error"]').contains(errorMessage).should("be.visible");
    }

    verifyFieldValidation(field: string) {
        cy.get(`[data-testid="${field}-input"]`).should(($input) => {
            expect(($input[0] as HTMLInputElement).validity.valueMissing).to.eq(true);
        });
        cy.get('[data-testid="login-submit-button"]').contains("Login").should("be.visible");
    }
}
