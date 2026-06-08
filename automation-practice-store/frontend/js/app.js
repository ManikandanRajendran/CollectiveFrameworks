Router.register('/login', async () => {
  await updateHeaderAuth();
  if (API.getToken()) {
    Router.navigate('/products');
    return;
  }
  await renderLoginPage();
});

Router.register('/register', async () => {
  await updateHeaderAuth();
  if (API.getToken()) {
    Router.navigate('/products');
    return;
  }
  await renderRegisterPage();
});

Router.register('/products', async () => {
  await updateHeaderAuth();
  if (!requireAuth()) {
    Router.navigate('/login');
    return;
  }
  await renderProductsPage();
});

Router.register('/profile', async () => {
  await updateHeaderAuth();
  if (!requireAuth()) {
    Router.navigate('/login');
    return;
  }
  await renderProfilePage();
});

Router.register('/cart', async () => {
  await updateHeaderAuth();
  if (!requireAuth()) {
    Router.navigate('/login');
    return;
  }
  await renderCartPage();
});

Router.register('/checkout', async () => {
  await updateHeaderAuth();
  if (!requireAuth()) {
    Router.navigate('/login');
    return;
  }
  await renderCheckoutPage();
});

Router.register('/404', async () => {
  document.getElementById('main-content').innerHTML = `
    <div data-testid="not-found-page">
      <h1 class="page-title">Page Not Found</h1>
      <a href="#/login" class="btn btn-primary" data-testid="404-home-link">Go to Login</a>
    </div>
  `;
});

async function renderCurrentRoute() {
  const path = Router.getPath();
  const main = document.getElementById('main-content');

  const confirmationMatch = path.match(/^\/confirmation(?:\/(.+))?$/);
  if (confirmationMatch) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
    });
    await updateHeaderAuth();
    await renderConfirmationPage(confirmationMatch[1]);
    Router.currentRoute = path;
    return;
  }

  const handler = Router.routes[path] || Router.routes['/404'];
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === path);
  });

  if (handler) {
    Router.currentRoute = path;
    await handler();
  } else if (main) {
    main.innerHTML = `
      <div class="alert alert-error" data-testid="route-error">
        Unknown route: ${path}. <a href="#/login">Go to login</a>
      </div>`;
  }
}

Router.render = function customRender() {
  return Router.enqueueRender(async () => {
    const main = document.getElementById('main-content');
    try {
      await renderCurrentRoute();
    } catch (err) {
      console.error('Route render failed:', err);
      if (main) {
        main.innerHTML = `
          <div class="alert alert-error" data-testid="render-error" role="alert">
            Something went wrong loading this page. Please refresh or
            <a href="#/login" data-testid="render-error-login-link">return to login</a>.
          </div>`;
      }
    }
  });
};

document.getElementById('logout-btn')?.addEventListener('click', async () => {
  try {
    if (API.getToken()) {
      await API.auth.logout();
    }
  } catch {
    // still clear local session
  }
  API.setToken('');
  showToast('Logged out', 'success');
  await updateHeaderAuth();
  Router.navigate('/login');
});

Router.init();
