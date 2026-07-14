import {
    resetCartMock,
    addCartItem,
    getCartItems,
    getCartSummary,
    getCheckoutValidation,
    createMockPayment,
    getMockOrder,
} from "./cartMockState";

export function registerAuthMocks() {
    cy.readFile("apiFixtures/authLogin.json").then((data) => {
        cy.intercept("POST", "/api/auth/login", (req) => {
            req.reply({
                statusCode: 200,
                body: data,
            });
        }).as("login");
    });

    cy.readFile("apiFixtures/authMe.json").then((data) => {
        cy.intercept("GET", "/api/auth/me", (req) => {
            req.reply({
                statusCode: 200,
                body: data,
            });
        }).as("me");
    });
}

export function registerProductsMock() {
    cy.readFile("apiFixtures/getProductsMock.json").then((data) => {
        cy.intercept("GET", "/api/products?*", (req) => {
            req.reply({
                statusCode: 200,
                body: data,
            });
        }).as("getProducts");
    });
}

export function registerCartMocks() {
    resetCartMock();

    cy.intercept("POST", "/api/cart/items", (req) => {
        const { productId, quantity = 1 } = req.body;
        const item = addCartItem(productId, quantity);

        req.reply({
            statusCode: 201,
            body: {
                success: true,
                message: "Item added to cart",
                data: item,
            },
        });
    }).as("addToCart");

    cy.intercept("GET", "/api/cart", (req) => {
        req.reply({
            statusCode: 200,
            body: {
                success: true,
                data: {
                    items: getCartItems(),
                    summary: getCartSummary(),
                },
            },
        });
    }).as("getCart");
}

export function registerValidateMock() {
    cy.intercept("POST", "/api/checkout/validate", (req) => {
        const { shippingMethod, giftWrap } = req.body;
        const data = getCheckoutValidation(shippingMethod, giftWrap);

        if (!data) {
            req.reply({
                statusCode: 400,
                body: { success: false, message: "Cart is empty" },
            });
            return;
        }

        req.reply({
            statusCode: 200,
            body: { success: true, data },
        });
    }).as("validateCheckout");
}

export function registerPaymentAndOrderMocks() {
    cy.intercept("POST", "/api/checkout/payment", (req) => {
        const { shippingMethod, giftWrap, agreeTerms } = req.body;
        const result = createMockPayment(shippingMethod, giftWrap, agreeTerms);

        if (result.error) {
            req.reply({
                statusCode: result.error.statusCode,
                body: { success: false, message: result.error.message },
            });
            return;
        }

        req.reply({
            statusCode: 201,
            body: {
                success: true,
                message: "Payment successful",
                data: result.data,
            },
        });
    }).as("payment");

    cy.intercept("GET", "/api/orders/*", (req) => {
        const orderId = req.url.split("/").pop();
        const order = getMockOrder(orderId!);

        if (!order) {
            req.reply({
                statusCode: 404,
                body: { success: false, message: "Order not found" },
            });
            return;
        }

        req.reply({
            statusCode: 200,
            body: { success: true, data: order },
        });
    }).as("getOrder");
}

export function registerAllPurchaseMocks() {
    registerCartMocks();
    registerValidateMock();
    registerPaymentAndOrderMocks();
    registerAuthMocks();
    registerProductsMock();
}
