# Automation Practice Store

A full-featured demo e-commerce site built for **Playwright**, **Cypress**, and **API automation** practice. Every page action goes through a REST API backed by **Excel (.xlsx)** files.

## Quick Start

```bash
cd automation-practice-store
npm install
npm run seed
npm start
```

Open **http://localhost:3000**

## Test Credentials

| Username   | Password  |
|-----------|-----------|
| `demo`    | `Demo@123` |
| `testuser`| `Test@123` |

## Test Payment Cards

| Brand      | Number              | CVV   |
|-----------|---------------------|-------|
| Visa      | 4111111111111111    | 123   |
| Mastercard| 5555555555554444    | 456   |
| Amex      | 378282246310005     | 7890  |

Use any future expiry month/year.

## User Flows to Automate

1. **Login** → browse products → add to cart → checkout → pay → confirmation
2. **Profile** → update customer details → save
3. **Cart** → change quantity → remove item → clear cart
4. **Logout** → verify protected routes redirect

## UI Elements Covered

Every element includes `data-testid` attributes for stable selectors.

| Page          | Elements |
|---------------|----------|
| Login         | text input, password, checkbox, submit button, alert, link |
| Register      | text/email/tel inputs, password + confirm, radio group, checkbox, submit button, link |
| Products      | search, dropdown, radio group, checkbox, range slider, table, pagination, modal |
| Profile       | text/email/tel inputs, textarea, dropdown, radio, checkbox, date, file upload, tabs |
| Cart          | number input, table, alerts, button groups |
| Checkout      | radio group, checkbox, toggle switch, select, progress bar, multi-step wizard |
| Confirmation  | success alert, table, breadcrumbs |

## API Reference

Base URL: `http://localhost:3000/api`

Auth header: `Authorization: Bearer <token>` or `x-auth-token: <token>`

### Health

```
GET /api/health
```

### Auth

```
POST /api/auth/register    { username, password, confirmPassword, email, firstName, lastName, phone?, accountType?, newsletter?, agreeTerms }
POST /api/auth/login       { username, password, rememberMe? }
POST /api/auth/logout      (auth required)
GET  /api/auth/me          (auth required)
```

Registration rules (for negative test cases):
- Username: 3–20 chars, letters/numbers/underscore only, must be unique
- Password: 8+ chars with uppercase, lowercase, number, and special character
- Email: valid format, must be unique
- `agreeTerms` must be `true`

### Customer

```
GET /api/customer/profile  (auth required)
PUT /api/customer/profile  (auth required)
```

### Products

```
GET /api/products?category=&search=&sort=&minPrice=&maxPrice=
GET /api/products/categories
GET /api/products/:id
```

### Cart

```
GET    /api/cart                    (auth required)
POST   /api/cart/items              { productId, quantity? }
PUT    /api/cart/items/:id          { quantity }
DELETE /api/cart/items/:id
DELETE /api/cart
```

### Checkout

```
POST /api/checkout/validate   { shippingMethod?, giftWrap? }
POST /api/checkout/payment    { cardNumber, cardHolder, expiryMonth, expiryYear, cvv, agreeTerms, ... }
```

### Orders

```
GET /api/orders           (auth required)
GET /api/orders/:id       (auth required)
```

### Page Metadata

```
GET /api/pages/login|register|products|profile|cart|checkout|confirmation
```

## Excel Backend

Data lives in `backend/data/`:

| File            | Purpose |
|----------------|---------|
| `users.xlsx`   | Customer accounts & profile fields |
| `products.xlsx`| Product catalog |
| `cart_items.xlsx` | Shopping cart per user |
| `orders.xlsx`  | Completed orders |
| `sessions.xlsx`| Active login sessions |

Run `npm run seed` to reset all data to defaults.

## Sample Playwright Test

```javascript
import { test, expect } from '@playwright/test';

test('end-to-end purchase', async ({ page, request }) => {
  const login = await request.post('http://localhost:3000/api/auth/login', {
    data: { username: 'demo', password: 'Demo@123' },
  });
  const { token } = (await login.json()).data;

  await page.goto('http://localhost:3000/#/products');
  await page.getByTestId('username-input').fill('demo');
  await page.getByTestId('password-input').fill('Demo@123');
  await page.getByTestId('login-submit-button').click();

  await page.getByTestId('add-to-cart-prod-001').click();
  await page.getByTestId('nav-cart').click();
  await page.getByTestId('proceed-checkout-button').click();
  // ... continue checkout flow
});
```

## Sample Cypress Test

```javascript
cy.visit('http://localhost:3000/#/login');
cy.get('[data-testid="username-input"]').type('demo');
cy.get('[data-testid="password-input"]').type('Demo@123');
cy.get('[data-testid="login-submit-button"]').click();
cy.get('[data-testid="products-page"]').should('be.visible');
```

## Sample API Test (any REST client)

```bash
# Login
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"Demo@123"}'

# Add to cart (replace TOKEN)
curl -s -X POST http://localhost:3000/api/cart/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod-001","quantity":2}'
```

## Project Structure

```
automation-practice-store/
├── backend/
│   ├── data/           # Excel files (generated by seed)
│   ├── routes/         # REST API routes
│   ├── services/       # Excel read/write layer
│   ├── middleware/     # Auth middleware
│   └── server.js
├── frontend/
│   ├── css/
│   ├── js/pages/       # Page renderers
│   └── index.html
└── package.json
```
