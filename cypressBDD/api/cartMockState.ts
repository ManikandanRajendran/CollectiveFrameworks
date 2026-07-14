export interface MockCartItem {
    id: string;
    productId: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    lineTotal: number;
    image: string;
}

let cartItems: MockCartItem[] = [];

export function resetCartMock() {
    cartItems = [];
    lastOrder = null;
}

export function addCartItem(productId: string, quantity = 1) {
    const price = 99.99;
    const item: MockCartItem = {
        id: "cart-item-001",
        productId,
        name: "Mock Smart Watch",
        category: "electronics",
        price,
        quantity,
        lineTotal: price * quantity,
        image: "⌚",
    };
    cartItems = [item];
    return item;
}

export function getCartItems() {
    return cartItems;
}

export function getCartSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 5.99;

    return {
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        tax,
        shipping,
        total: subtotal + tax + shipping,
    };
}

export function getCheckoutValidation(
    shippingMethod = "standard",
    giftWrap = false,
) {
    const items = getCartItems();

    if (items.length === 0) {
        return null; // signals empty cart → 400
    }

    const summary = getCartSummary();
    let extraShipping = 0;
    if (shippingMethod === "express") extraShipping = 9.99;
    if (shippingMethod === "overnight") extraShipping = 19.99;

    return {
        items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
        })),
        subtotal: summary.subtotal,
        tax: summary.tax,
        shipping: summary.shipping + extraShipping,
        total:
            summary.subtotal +
            summary.tax +
            summary.shipping +
            extraShipping +
            (giftWrap ? 3.99 : 0),
        shippingMethod: shippingMethod || "standard",
        giftWrap: Boolean(giftWrap),
    };
}

export interface MockOrder {
    id: string;
    status: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingMethod: string;
    giftWrap: boolean;
    cardBrand: string;
    cardLast4: string;
    cardHolder: string;
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        lineTotal: number;
    }>;
    createdAt: string;
}

let lastOrder: MockOrder | null = null;

export function createMockPayment(
    shippingMethod = "standard",
    giftWrap = false,
    agreeTerms = true,
) {
    const validation = getCheckoutValidation(shippingMethod, giftWrap);

    if (!validation) {
        return { error: { statusCode: 400, message: "Cart is empty" } };
    }

    if (!agreeTerms) {
        return {
            error: {
                statusCode: 400,
                message: "You must agree to terms and conditions",
            },
        };
    }

    const orderId = `ORD-MOCK-001`;

    lastOrder = {
        id: orderId,
        status: "confirmed",
        subtotal: validation.subtotal,
        tax: validation.tax,
        shipping: validation.shipping,
        total: validation.total,
        shippingMethod: validation.shippingMethod,
        giftWrap: validation.giftWrap,
        cardBrand: "Visa",
        cardLast4: "1111",
        cardHolder: "Alex",
        items: validation.items,
        createdAt: new Date().toISOString(),
    };

    cartItems = []; // real API clears cart after payment

    return {
        data: {
            orderId,
            status: "confirmed",
            total: validation.total,
            cardBrand: "Visa",
            cardLast4: "1111",
            estimatedDelivery: "2026-07-21",
        },
    };
}

export function getMockOrder(orderId: string) {
    if (!lastOrder || lastOrder.id !== orderId) {
        return null;
    }
    return lastOrder;
}