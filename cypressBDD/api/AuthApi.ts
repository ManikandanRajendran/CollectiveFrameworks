export interface LoginResponseBody {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    };
}

export class AuthApi {
    private lastResponse: Cypress.Response<LoginResponseBody> | null = null;
    private authToken: string | null = null;

    login(username: string, password: string, rememberMe = false) {
        return cy
            .request<LoginResponseBody>({
                method: "POST",
                url: "/api/auth/login",
                body: { username, password, rememberMe },
                failOnStatusCode: false,
            })
            .then((response) => {
                this.lastResponse = response;
                return response;
            });
    }

    loginViaApi(username: string, password: string, rememberMe = false) {
        return this.login(username, password, rememberMe).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data?.token).to.be.a("string").and.not.be.empty;
            this.authToken = response.body.data!.token;
            return this.authToken;
        });
    }

    visitWithAuthToken(path: string, token: string) {
        cy.visit(path, {
            onBeforeLoad(win) {
                win.localStorage.setItem("authToken", token);
            },
        });
        cy.get('[data-testid="logout-button"]').should("be.visible");
    }

    loginViaApiAndVisit(
        path: string,
        username: string,
        password: string,
        rememberMe = false,
    ) {
        this.loginViaApi(username, password, rememberMe).then((token) => {
            this.visitWithAuthToken(path, token);
        });
    }

    verifyLoginSuccess(expectedUsername: string) {
        const response = this.getLastResponse();

        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.eq("Login successful");
        expect(response.body.data?.token).to.be.a("string").and.not.be.empty;
        expect(response.body.data?.user.username).to.eq(expectedUsername);
        expect(response.body.data?.user.id).to.be.a("string").and.not.be.empty;
    }

    verifyLoginFailure(status: number, message: string) {
        const response = this.getLastResponse();

        expect(response.status).to.eq(status);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.eq(message);
    }

    private getLastResponse() {
        if (!this.lastResponse) {
            throw new Error("No API response available. Call login() first.");
        }
        return this.lastResponse;
    }

    getAuthToken() {
        if (!this.authToken) {
            throw new Error("No auth token available. Call loginViaApi() first.");
        }
        return this.authToken;
    }

    visitProductsPage() {
        this.visitWithAuthToken("/#/products", this.getAuthToken());
    }
}
