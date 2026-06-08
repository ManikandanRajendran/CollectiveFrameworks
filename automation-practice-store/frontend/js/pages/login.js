async function renderLoginPage() {
  setBreadcrumb([{ label: 'Login', href: '#/login' }]);

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="login-page" data-testid="login-page">
      <div class="card">
        <h1 class="page-title" data-testid="login-title">Sign In</h1>
        <p class="page-subtitle">Access your account to shop and checkout</p>

        <div id="login-error" class="alert alert-error hidden" data-testid="login-error" role="alert"></div>

        <form id="login-form" data-testid="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" data-testid="username-input"
              placeholder="Enter username" autocomplete="username" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" data-testid="password-input"
              placeholder="Enter password" autocomplete="current-password" required>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" id="remember-me" name="rememberMe" data-testid="remember-me-checkbox">
              Remember me
            </label>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%" data-testid="login-submit-button">
            Login
          </button>
        </form>

        <p class="auth-switch" data-testid="register-link-text">
          Don't have an account?
          <a href="#/register" data-testid="go-to-register-link">Create one</a>
        </p>

        <div class="login-demo-box" data-testid="demo-credentials">
          <strong>Demo credentials</strong><br>
          User: <code data-testid="demo-username">demo</code> /
          Pass: <code data-testid="demo-password">Demo@123</code>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('login-error');
    errorEl.classList.add('hidden');

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
      const res = await API.auth.login({ username, password, rememberMe });
      API.setToken(res.data.token);
      showToast('Login successful', 'success');
      await updateHeaderAuth();
      Router.navigate('/products');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  });
}
