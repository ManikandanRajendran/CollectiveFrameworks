const CheckoutPage = {
  step: 1,
  validation: null,
  shipping: { method: 'standard', giftWrap: false, billingSame: true },
  payment: {},

  async render() {
    if (!requireAuth()) {
      Router.navigate('/login');
      return;
    }

    setBreadcrumb([
      { label: 'Home', href: '#/products' },
      { label: 'Cart', href: '#/cart' },
      { label: 'Checkout', href: '#/checkout' },
    ]);

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div data-testid="checkout-page">
        <h1 class="page-title" data-testid="checkout-title">Checkout</h1>
        <p class="page-subtitle">Shipping, payment &amp; confirmation — radio, checkbox, toggle &amp; card fields</p>

        <div class="checkout-steps" data-testid="checkout-steps">
          <span class="checkout-step active" data-testid="step-shipping">1. Shipping</span>
          <span class="checkout-step" data-testid="step-payment">2. Payment</span>
          <span class="checkout-step" data-testid="step-review">3. Review</span>
        </div>

        <div class="progress-bar" data-testid="checkout-progress-bar">
          <div class="progress-fill" id="checkout-progress" style="width:33%"></div>
        </div>

        <div id="checkout-error" class="alert alert-error hidden" data-testid="checkout-error" role="alert"></div>

        <div class="grid-2">
          <div id="checkout-form-area" class="card" data-testid="checkout-form-area"></div>
          <div id="checkout-summary-area" class="card" data-testid="checkout-summary-area">Loading...</div>
        </div>
      </div>
    `;

    this.step = 1;
    await this.renderStep();
    await this.loadSummary();
  },

  setStep(step) {
    this.step = step;
    const progress = document.getElementById('checkout-progress');
    if (progress) progress.style.width = `${(step / 3) * 100}%`;

    document.querySelectorAll('.checkout-step').forEach((el, i) => {
      el.classList.toggle('active', i + 1 <= step);
    });
  },

  async loadSummary() {
    try {
      const shippingMethod =
        document.querySelector('input[name="shippingMethod"]:checked')?.value || 'standard';
      const giftWrap = document.getElementById('gift-wrap')?.checked || false;

      const res = await API.checkout.validate({ shippingMethod, giftWrap });
      this.validation = res.data;

      document.getElementById('checkout-summary-area').innerHTML = `
        <h2 style="margin-bottom:1rem">Order Summary</h2>
        <div class="summary-row"><span>Subtotal</span><span data-testid="checkout-subtotal">${formatCurrency(res.data.subtotal)}</span></div>
        <div class="summary-row"><span>Tax</span><span data-testid="checkout-tax">${formatCurrency(res.data.tax)}</span></div>
        <div class="summary-row"><span>Shipping</span><span data-testid="checkout-shipping">${formatCurrency(res.data.shipping)}</span></div>
        <div class="summary-row total"><span>Total</span><span data-testid="checkout-total">${formatCurrency(res.data.total)}</span></div>
      `;
    } catch (err) {
      document.getElementById('checkout-summary-area').innerHTML =
        `<div class="alert alert-warning" data-testid="checkout-summary-error">${err.message}</div>`;
    }
  },

  clearError() {
    const errorEl = document.getElementById('checkout-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  },

  async renderStep() {
    const area = document.getElementById('checkout-form-area');
    this.setStep(this.step);
    this.clearError();

    if (this.step === 1) {
      area.innerHTML = `
        <h2 data-testid="shipping-section-title">Shipping Options</h2>
        <fieldset class="form-group" data-testid="shipping-radio-group">
          <legend>Shipping Method</legend>
          <div class="radio-group">
            <label><input type="radio" name="shippingMethod" value="standard" data-testid="shipping-standard" checked> Standard (5-7 days) — Free over $50</label>
            <label><input type="radio" name="shippingMethod" value="express" data-testid="shipping-express"> Express (2-3 days) — +$9.99</label>
            <label><input type="radio" name="shippingMethod" value="overnight" data-testid="shipping-overnight"> Overnight — +$19.99</label>
          </div>
        </fieldset>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" id="gift-wrap" data-testid="gift-wrap-checkbox">
            Add gift wrap (+$3.99)
          </label>
        </div>

        <div class="toggle-row form-group" data-testid="billing-toggle-row">
          <span>Billing same as shipping</span>
          <label class="switch">
            <input type="checkbox" id="billing-same" data-testid="billing-same-toggle" checked>
            <span class="slider-toggle"></span>
          </label>
        </div>

        <button type="button" class="btn btn-primary" data-testid="continue-to-payment"
          onclick="CheckoutPage.nextStep()">Continue to Payment</button>
      `;

      document.querySelectorAll('input[name="shippingMethod"]').forEach((el) => {
        el.addEventListener('change', () => this.loadSummary());
      });
      document.getElementById('gift-wrap')?.addEventListener('change', () => this.loadSummary());
      await this.loadSummary();
    } else if (this.step === 2) {
      const currentYear = new Date().getFullYear();
      const expiryYears = Array.from({ length: 6 }, (_, i) => currentYear + i);
      const { cardHolder = '', cardNumber = '', cvv = '', expiryMonth = '06', expiryYear = String(currentYear), agreeTerms = false } = this.payment;

      area.innerHTML = `
        <h2 data-testid="payment-section-title">Payment Details</h2>
        <div class="alert alert-info" data-testid="test-card-info">
          Use test card: <strong>4111 1111 1111 1111</strong> CVV: <strong>123</strong>
          — any future expiry month/year works.
        </div>

        <div class="form-group">
          <label for="cardHolder">Cardholder Name</label>
          <input type="text" id="cardHolder" data-testid="card-holder-input" placeholder="Name on card" value="${cardHolder}">
        </div>

        <div class="form-group">
          <label for="cardNumber">Card Number</label>
          <input type="text" id="cardNumber" data-testid="card-number-input" placeholder="4111 1111 1111 1111" maxlength="19" value="${cardNumber}">
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label for="expiryMonth">Expiry Month</label>
            <select id="expiryMonth" data-testid="expiry-month-select">
              ${Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0');
                const selected = m === expiryMonth ? ' selected' : '';
                return `<option value="${m}"${selected}>${m}</option>`;
              }).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="expiryYear">Expiry Year</label>
            <select id="expiryYear" data-testid="expiry-year-select">
              ${expiryYears
                .map((y) => {
                  const selected = String(y) === expiryYear ? ' selected' : '';
                  return `<option value="${y}"${selected}>${y}</option>`;
                })
                .join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="cvv">CVV</label>
          <input type="text" id="cvv" data-testid="cvv-input" placeholder="123" maxlength="4" value="${cvv}">
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" id="agree-terms" data-testid="agree-terms-checkbox"${agreeTerms ? ' checked' : ''}>
            I agree to the terms and conditions
          </label>
        </div>

        <div class="btn-group">
          <button type="button" class="btn btn-secondary" data-testid="back-to-shipping"
            onclick="CheckoutPage.prevStep()">Back</button>
          <button type="button" class="btn btn-primary" data-testid="continue-to-review"
            onclick="CheckoutPage.nextStep()">Review Order</button>
        </div>
      `;
    } else if (this.step === 3) {
      const { method, giftWrap, billingSame } = this.shipping;
      const cardLast4 = (this.payment.cardNumber || '').replace(/\s/g, '').slice(-4) || '----';

      area.innerHTML = `
        <h2 data-testid="review-section-title">Review &amp; Pay</h2>
        <div class="alert alert-warning" data-testid="review-alert">Please confirm your order before paying.</div>
        <p><strong>Shipping:</strong> <span data-testid="review-shipping">${method}</span></p>
        <p><strong>Gift wrap:</strong> <span data-testid="review-gift-wrap">${giftWrap ? 'Yes' : 'No'}</span></p>
        <p><strong>Billing same as shipping:</strong> <span data-testid="review-billing">${billingSame ? 'Yes' : 'No'}</span></p>
        <p><strong>Card:</strong> <span data-testid="review-card">**** ${cardLast4}</span></p>

        <div class="btn-group" style="margin-top:1.5rem">
          <button type="button" class="btn btn-secondary" data-testid="back-to-payment"
            onclick="CheckoutPage.prevStep()">Back</button>
          <button type="button" class="btn btn-success" data-testid="place-order-button"
            onclick="CheckoutPage.placeOrder()">Place Order &amp; Pay</button>
        </div>
      `;
    }
  },

  nextStep() {
    this.clearError();

    if (this.step === 1) {
      this.shipping = {
        method: document.querySelector('input[name="shippingMethod"]:checked')?.value || 'standard',
        giftWrap: document.getElementById('gift-wrap')?.checked || false,
        billingSame: document.getElementById('billing-same')?.checked ?? true,
      };
    }

    if (this.step === 2) {
      const cardHolder = document.getElementById('cardHolder')?.value.trim();
      const cardNumber = document.getElementById('cardNumber')?.value.trim();
      const cvv = document.getElementById('cvv')?.value.trim();
      const agreeTerms = document.getElementById('agree-terms')?.checked;

      if (!cardHolder || !cardNumber || !cvv) {
        const errorEl = document.getElementById('checkout-error');
        errorEl.textContent = 'Please fill in all payment fields';
        errorEl.classList.remove('hidden');
        return;
      }
      if (!agreeTerms) {
        const errorEl = document.getElementById('checkout-error');
        errorEl.textContent = 'You must agree to terms and conditions';
        errorEl.classList.remove('hidden');
        return;
      }

      this.payment = {
        cardHolder,
        cardNumber,
        cvv,
        expiryMonth: document.getElementById('expiryMonth')?.value || '01',
        expiryYear: document.getElementById('expiryYear')?.value || '2028',
        agreeTerms,
      };
    }

    this.step = Math.min(3, this.step + 1);
    this.renderStep();
    if (this.step !== 1) this.loadSummary();
  },

  prevStep() {
    this.step = Math.max(1, this.step - 1);
    this.renderStep();
    this.loadSummary();
  },

  async placeOrder() {
    this.clearError();

    try {
      const res = await API.checkout.payment({
        ...this.payment,
        billingSameAsShipping: this.shipping.billingSame,
        shippingMethod: this.shipping.method,
        giftWrap: this.shipping.giftWrap,
      });

      sessionStorage.setItem('lastOrderId', res.data.orderId);
      showToast('Payment successful!', 'success');
      Router.navigate(`/confirmation/${res.data.orderId}`);
    } catch (err) {
      const errorEl = document.getElementById('checkout-error');
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  },
};

async function renderCheckoutPage() {
  await CheckoutPage.render();
}
