async function renderRegisterPage() {
  setBreadcrumb([
    { label: 'Login', href: '#/login' },
    { label: 'Register', href: '#/register' },
  ]);

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="register-page" data-testid="register-page">
      <div class="card">
        <h1 class="page-title" data-testid="register-title">Create Account</h1>
        <p class="page-subtitle">Sign up to start shopping — great for registration automation tests</p>

        <div id="register-error" class="alert alert-error hidden" data-testid="register-error" role="alert"></div>
        <div id="register-success" class="alert alert-success hidden" data-testid="register-success" role="alert"></div>

        <form id="register-form" data-testid="register-form" novalidate>
          <fieldset class="form-group" data-testid="account-type-radio-group">
            <legend>Account Type</legend>
            <div class="radio-group">
              <label>
                <input type="radio" name="accountType" value="personal" data-testid="account-personal-radio" checked>
                Personal
              </label>
              <label>
                <input type="radio" name="accountType" value="business" data-testid="account-business-radio">
                Business
              </label>
            </div>
          </fieldset>

          <div class="grid-2">
            <div class="form-group">
              <label for="reg-firstName">First Name</label>
              <input type="text" id="reg-firstName" name="firstName" data-testid="register-first-name-input"
                placeholder="First name" autocomplete="given-name" required>
            </div>
            <div class="form-group">
              <label for="reg-lastName">Last Name</label>
              <input type="text" id="reg-lastName" name="lastName" data-testid="register-last-name-input"
                placeholder="Last name" autocomplete="family-name" required>
            </div>
          </div>

          <div class="form-group">
            <label for="reg-username">Username</label>
            <input type="text" id="reg-username" name="username" data-testid="register-username-input"
              placeholder="Choose a username" autocomplete="username" required>
            <p class="hint" data-testid="username-hint">3–20 characters: letters, numbers, underscore</p>
          </div>

          <div class="form-group">
            <label for="reg-email">Email</label>
            <input type="email" id="reg-email" name="email" data-testid="register-email-input"
              placeholder="you@example.com" autocomplete="email" required>
          </div>

          <div class="form-group">
            <label for="reg-phone">Phone (optional)</label>
            <input type="tel" id="reg-phone" name="phone" data-testid="register-phone-input"
              placeholder="555-0100" autocomplete="tel">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label for="reg-password">Password</label>
              <input type="password" id="reg-password" name="password" data-testid="register-password-input"
                placeholder="Create password" autocomplete="new-password" required>
            </div>
            <div class="form-group">
              <label for="reg-confirmPassword">Confirm Password</label>
              <input type="password" id="reg-confirmPassword" name="confirmPassword"
                data-testid="register-confirm-password-input" placeholder="Confirm password"
                autocomplete="new-password" required>
            </div>
          </div>
          <p class="hint" data-testid="password-hint" style="margin-bottom:1rem">
            Min 8 chars with uppercase, lowercase, number, and special character (e.g. Test@123)
          </p>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" id="reg-newsletter" name="newsletter" data-testid="register-newsletter-checkbox">
              Subscribe to promotional emails
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" id="reg-agree-terms" name="agreeTerms" data-testid="register-terms-checkbox" required>
              I agree to the <a href="#" data-testid="register-terms-link" onclick="return false;">Terms &amp; Conditions</a>
            </label>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%" data-testid="register-submit-button">
            Create Account
          </button>
        </form>

        <p class="auth-switch" data-testid="login-link-text">
          Already have an account?
          <a href="#/login" data-testid="go-to-login-link">Sign in</a>
        </p>
      </div>
    </div>
  `;

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('register-error');
    const successEl = document.getElementById('register-success');
    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');

    const accountType =
      document.querySelector('input[name="accountType"]:checked')?.value || 'personal';

    const payload = {
      username: document.getElementById('reg-username').value.trim(),
      password: document.getElementById('reg-password').value,
      confirmPassword: document.getElementById('reg-confirmPassword').value,
      email: document.getElementById('reg-email').value.trim(),
      firstName: document.getElementById('reg-firstName').value.trim(),
      lastName: document.getElementById('reg-lastName').value.trim(),
      phone: document.getElementById('reg-phone').value.trim(),
      accountType,
      newsletter: document.getElementById('reg-newsletter').checked,
      agreeTerms: document.getElementById('reg-agree-terms').checked,
    };

    const submitBtn = document.querySelector('[data-testid="register-submit-button"]');
    submitBtn.disabled = true;

    try {
      const res = await API.auth.register(payload);
      API.setToken(res.data.token);
      successEl.textContent = 'Account created! Redirecting to products...';
      successEl.classList.remove('hidden');
      showToast('Registration successful', 'success');
      await updateHeaderAuth();
      setTimeout(() => Router.navigate('/products'), 800);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
      submitBtn.disabled = false;
    }
  });
}
