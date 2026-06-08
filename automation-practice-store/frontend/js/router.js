const Router = {
  routes: {},
  currentRoute: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(path) {
    const target = path.startsWith('/') ? path : `/${path}`;
    if (this.getPath() === target) {
      this.render();
      return;
    }
    window.location.hash = target;
  },

  getPath() {
    const hash = window.location.hash.slice(1) || '/login';
    return hash.startsWith('/') ? hash : `/${hash}`;
  },

  async render() {
    const path = this.getPath();
    const handler = this.routes[path] || this.routes['/404'];

    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === path);
    });

    if (handler) {
      this.currentRoute = path;
      await handler();
    }
  },

  init() {
    window.addEventListener('hashchange', () => this.render());
    return this.render();
  },

  _renderPromise: Promise.resolve(),

  enqueueRender(fn) {
    this._renderPromise = this._renderPromise.then(fn).catch((err) => {
      console.error('Route render failed:', err);
      throw err;
    });
    return this._renderPromise;
  },
};

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('data-testid', `toast-${type}`);
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function setBreadcrumb(items) {
  const list = document.getElementById('breadcrumb-list');
  list.innerHTML = items
    .map((item, i) => {
      if (i === items.length - 1) {
        return `<li data-testid="breadcrumb-current">${item.label}</li>`;
      }
      return `<li><a href="${item.href}" data-testid="breadcrumb-link">${item.label}</a></li>`;
    })
    .join('');
}

function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function requireAuth() {
  return !!API.getToken();
}

function openModal(content) {
  document.getElementById('modal-body').innerHTML = content;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') closeModal();
});

async function refreshCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!API.getToken()) {
    badge.classList.add('hidden');
    return;
  }
  try {
    const res = await API.cart.get();
    const count = res.data.summary.itemCount;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  } catch {
    badge.classList.add('hidden');
  }
}

async function updateHeaderAuth() {
  const greeting = document.getElementById('user-greeting');
  const logoutBtn = document.getElementById('logout-btn');
  const nav = document.getElementById('main-nav');

  if (!greeting || !logoutBtn || !nav) return;

  if (!API.getToken()) {
    greeting.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    nav.classList.add('hidden');
    return;
  }

  try {
    const res = await API.auth.me();
    greeting.textContent = `Hi, ${res.data.firstName}`;
    greeting.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    nav.classList.remove('hidden');
  } catch {
    API.setToken('');
    greeting.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    nav.classList.add('hidden');
  }

  await refreshCartBadge();
}
