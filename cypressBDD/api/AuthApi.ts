const MAX_LOGIN_RESPONSE_MS = 2000;

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

    // ==========================================
    // 🌐 1. HTTP METADATA VALIDATION
    // ==========================================
    private verifyLoginHttpMetadata(){
        const response = this.getLastResponse();
        expect(response.status).to.eql(200);
        expect(response.statusText).to.eql("OK")
        expect(response.headers["content-type"]).to.include("application/json")
    }

    // ==========================================
    // 📦 2. DATA INTEGRITY & SCHEMA VALIDATION
    // ==========================================
    private verifyLoginResponseSchema(){
        const response = this.getLastResponse();
        const body = response.body;
        expect(body).to.have.property("success");
        expect(body).to.have.property("message");
        expect(body).to.have.property("data");
        expect(body.data).to.have.property("user");
        expect(body.data).to.have.property("token");
        if (!body.data) {
            throw new Error("Login response data is missing");
        }
        const user = body.data.user;    
        const properties = ['id', 'username', 'email', 'firstName', 'lastName', 'phone', 'address'];
        properties.forEach((prop) => {
            expect(user).to.have.property(prop);
            expect((user as Record<string, unknown>)[prop]).to.be.a("string").and.not.be.empty;
        })
    }

    // ==========================================
    // ⚡ 3. NON-FUNCTIONAL VALIDATION
    // ==========================================
    private verifyLoginNonFunctional(){
        const response = this.getLastResponse();
        const body = response.body;
        const contentLength = response.headers["content-length"];
        if (contentLength) {
            expect(Number(contentLength)).to.be.lessThan(2 * 1024 * 1024); // 2 MB in bytes
        }
        expect(response.duration).to.be.lessThan(MAX_LOGIN_RESPONSE_MS);
    }

    // ==========================================
    // 💼 4. FUNCTIONAL & BUSINESS LOGIC
    // ==========================================
    private verifyLoginBusinessLogic(expectedUsername: string){
        const response = this.getLastResponse();
        const body = response.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(response.body.data?.user.email).to.match(emailRegex);
        if (!body.data) {
            throw new Error("Login response data is missing");
        }
        expect(body.success).to.be.true;
        expect(body.message).to.eq("Login successful");
        expect(body.data.user.username).to.eq(expectedUsername);

    }
    
    verifyLoginSuccess(expectedUsername: string) {
        this.verifyLoginHttpMetadata();
        this.verifyLoginResponseSchema();
        this.verifyLoginNonFunctional();
        this.verifyLoginBusinessLogic(expectedUsername);

        const token = this.getLastResponse().body.data?.token;
        if (!token) {
            throw new Error("No auth token in login response");
        }
        this.authToken = token;
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
