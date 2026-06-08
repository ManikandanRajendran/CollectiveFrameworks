async function renderCartPage() {
  if (!requireAuth()) {
    Router.navigate('/login');
    return;
  }

  setBreadcrumb([
    { label: 'Home', href: '#/products' },
    { label: 'Cart', href: '#/cart' },
  ]);

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div data-testid="cart-page">
      <h1 class="page-title" data-testid="cart-title">Shopping Cart</h1>
      <p class="page-subtitle">Manage items — quantity inputs, remove buttons &amp; order summary</p>
      <div id="cart-content" data-testid="cart-content">Loading...</div>
    </div>
  `;

  await loadCart();
}

async function loadCart() {
  const container = document.getElementById('cart-content');

  try {
    const res = await API.cart.get();
    const { items, summary } = res.data;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="alert alert-info" data-testid="empty-cart-alert">Your cart is empty.</div>
        <a href="#/products" class="btn btn-primary" data-testid="continue-shopping-link">Continue Shopping</a>
      `;
      await refreshCartBadge();
      return;
    }

    container.innerHTML = `
      <div class="grid-2">
        <div class="card">
          <table data-testid="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr data-testid="cart-row-${item.id}">
                  <td data-testid="cart-item-name-${item.id}">${item.image} ${item.name}</td>
                  <td data-testid="cart-item-price-${item.id}">${formatCurrency(item.price)}</td>
                  <td>
                    <input type="number" min="1" value="${item.quantity}"
                      data-testid="cart-qty-input-${item.id}" style="width:70px"
                      onchange="updateCartQty('${item.id}', this.value)">
                  </td>
                  <td data-testid="cart-line-total-${item.id}">${formatCurrency(item.lineTotal)}</td>
                  <td>
                    <button type="button" class="btn btn-danger" data-testid="remove-item-${item.id}"
                      onclick="removeCartItem('${item.id}')">Remove</button>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="btn-group" style="margin-top:1rem">
            <button type="button" class="btn btn-secondary" data-testid="clear-cart-button"
              onclick="clearCart()">Clear Cart</button>
            <a href="#/products" class="btn btn-outline" data-testid="continue-shopping-btn">Continue Shopping</a>
          </div>
        </div>

        <div class="card" data-testid="cart-summary">
          <h2 style="margin-bottom:1rem">Order Summary</h2>
          <div class="summary-row"><span>Items</span><span data-testid="summary-item-count">${summary.itemCount}</span></div>
          <div class="summary-row"><span>Subtotal</span><span data-testid="summary-subtotal">${formatCurrency(summary.subtotal)}</span></div>
          <div class="summary-row"><span>Tax (8%)</span><span data-testid="summary-tax">${formatCurrency(summary.tax)}</span></div>
          <div class="summary-row"><span>Shipping</span><span data-testid="summary-shipping">${summary.shipping === 0 ? 'FREE' : formatCurrency(summary.shipping)}</span></div>
          <div class="summary-row total"><span>Total</span><span data-testid="summary-total">${formatCurrency(summary.total)}</span></div>
          ${summary.subtotal < 50 ? '<p class="hint" data-testid="free-shipping-hint">Add $50+ for free shipping</p>' : ''}
          <button type="button" class="btn btn-primary" style="width:100%;margin-top:1rem"
            data-testid="proceed-checkout-button" onclick="Router.navigate('/checkout')">
            Proceed to Checkout
          </button>
        </div>
      </div>
    `;

    await refreshCartBadge();
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error" data-testid="cart-error">${err.message}</div>`;
  }
}

async function updateCartQty(itemId, quantity) {
  try {
    await API.cart.updateItem(itemId, Number(quantity));
    showToast('Quantity updated', 'success');
    await loadCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function removeCartItem(itemId) {
  try {
    await API.cart.removeItem(itemId);
    showToast('Item removed', 'success');
    await loadCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function clearCart() {
  try {
    await API.cart.clear();
    showToast('Cart cleared', 'success');
    await loadCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
