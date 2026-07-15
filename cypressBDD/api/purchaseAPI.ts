import { AuthApi } from "./AuthApi";
import { ApiClient } from "./apiClient";

export class PurchaseAPI {
    private orderId: string | null = null;
    private cartClearedMessage: string | null = null;
    private cartItemId: string | null = null;
    constructor(private authApi: AuthApi) {}

    private authHeaders() {
        return {
            Authorization: `Bearer ${this.authApi.getAuthToken()}`,
        };
    }

    private clearCart() {
        return ApiClient("DELETE", "/api/cart", undefined, this.authHeaders()).then(
            (response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.message).to.eq("Cart cleared");
            },
        );
    }

    addItemToCart() {
        const body = {
            productId: "prod-008",
            quantity: 1,
        };
        return this.clearCart().then(() =>
            ApiClient("POST", "/api/cart/items", body, this.authHeaders()),
        )
            .then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.success).to.be.true;
                expect(response.body.message).to.eq("Item added to cart");
                expect(response.body.data.productId).to.eq("prod-008");
                expect(response.body.data.quantity).to.eq(1);
                this.cartItemId = response.body.data.id;
            });
    }

    validateCartItem() {
        const body= {
            shippingMethod: "standard",
            giftWrap: false,
        }
        return ApiClient("POST", "/api/checkout/validate", body, this.authHeaders())
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.data.items[0].productId).to.eq("prod-008");
                expect(response.body.data.items[0].quantity).to.eq(1);
            });
    }

    checkoutAndPay() {
        const body = {
            cardNumber: "4111111111111111",
            cardHolder: "Alex",
            expiryMonth: "12",
            expiryYear: "2026",
            cvv: "123",
            agreeTerms: true,
            billingSameAsShipping: true,
        }
        return ApiClient("POST", "/api/checkout/payment", body, this.authHeaders())
            .then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.success).to.be.true;
                expect(response.body.message).to.eq("Payment successful");
                expect(response.body.data.orderId).to.be.a("string").and.not.be
                    .empty;
                this.orderId = response.body.data.orderId;
            });
    }

    verifyOrderConfirmation() {
        return ApiClient("GET", `/api/orders/${this.orderId}`, undefined , this.authHeaders())
            .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.data.status).to.eq("confirmed");
            expect(response.body.data.id).to.eq(this.orderId);
        })
    }
    removeCartItem() {
        return ApiClient(
            "DELETE",
            `/api/cart/items/${this.cartItemId}`,
            undefined,
            this.authHeaders(),
        )
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.message).to.eq("Item removed from cart");
                this.cartClearedMessage = response.body.message;
            });
    }

    verifyCartCleared(message: string) {
        expect(this.cartClearedMessage).to.eq(message);
    }
}
