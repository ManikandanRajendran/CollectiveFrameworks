async function renderConfirmationPage(orderId) {
  if (!requireAuth()) {
    Router.navigate('/login');
    return;
  }

  const id = orderId || sessionStorage.getItem('lastOrderId');

  if (!id) {
    Router.navigate('/products');
    return;
  }

  setBreadcrumb([
    { label: 'Home', href: '#/products' },
    { label: 'Confirmation', href: `#/confirmation/${id}` },
  ]);

  const main = document.getElementById('main-content');

  try {
    const res = await API.orders.get(id);
    const order = res.data;

    main.innerHTML = `
      <div data-testid="confirmation-page">
        <div class="card" style="text-align:center;max-width:640px;margin:0 auto">
          <div class="confirmation-icon" data-testid="confirmation-icon">✅</div>
          <h1 class="page-title" data-testid="confirmation-title">Order Confirmed!</h1>
          <p class="page-subtitle" data-testid="confirmation-message">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          <div class="alert alert-success" data-testid="confirmation-success-alert" role="alert">
            Payment of ${formatCurrency(order.total)} was processed via ${order.cardBrand} ending in ${order.cardLast4}.
          </div>

          <p><strong>Order ID:</strong></p>
          <p class="order-id" data-testid="order-id">${order.id}</p>
          <p style="margin-top:1rem;color:var(--muted)" data-testid="order-date">
            Placed on ${new Date(order.createdAt).toLocaleString()}
          </p>
          <p data-testid="shipping-method">Shipping: ${order.shippingMethod}</p>
        </div>

        <div class="card" style="margin-top:1.5rem">
          <h2 style="margin-bottom:1rem" data-testid="order-items-title">Order Items</h2>
          <table data-testid="confirmation-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr data-testid="order-item-row-${item.productId}">
                  <td data-testid="order-item-name-${item.productId}">${item.name}</td>
                  <td data-testid="order-item-qty-${item.productId}">${item.quantity}</td>
                  <td>${formatCurrency(item.price)}</td>
                  <td>${formatCurrency(item.lineTotal)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div style="max-width:300px;margin-left:auto;margin-top:1rem">
            <div class="summary-row"><span>Subtotal</span><span data-testid="confirm-subtotal">${formatCurrency(order.subtotal)}</span></div>
            <div class="summary-row"><span>Tax</span><span data-testid="confirm-tax">${formatCurrency(order.tax)}</span></div>
            <div class="summary-row"><span>Shipping</span><span data-testid="confirm-shipping">${formatCurrency(order.shipping)}</span></div>
            <div class="summary-row total"><span>Total</span><span data-testid="confirm-total">${formatCurrency(order.total)}</span></div>
          </div>
        </div>

        <div class="btn-group" style="margin-top:1.5rem;justify-content:center">
          <a href="#/products" class="btn btn-primary" data-testid="shop-again-button">Shop Again</a>
          <a href="#/profile" class="btn btn-outline" data-testid="view-profile-button">View Profile</a>
        </div>
      </div>
    `;

    await refreshCartBadge();
  } catch (err) {
    main.innerHTML = `
      <div class="alert alert-error" data-testid="confirmation-error">${err.message}</div>
      <a href="#/products" class="btn btn-primary" data-testid="back-home-button">Back to Products</a>
    `;
  }
}
