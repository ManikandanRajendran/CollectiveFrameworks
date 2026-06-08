const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/orders');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  req.requestId = `req-${Date.now()}`;
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Automation Practice Store API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/pages/:page', (req, res) => {
  const pages = {
    login: {
      title: 'Login',
      route: '/login',
      requiresAuth: false,
      elements: ['text-input', 'password-input', 'checkbox', 'submit-button', 'link'],
    },
    register: {
      title: 'Register',
      route: '/register',
      requiresAuth: false,
      elements: ['text-input', 'email-input', 'tel-input', 'password-input', 'radio-group', 'checkbox', 'submit-button', 'link'],
    },
    products: {
      title: 'Products',
      route: '/products',
      requiresAuth: true,
      elements: ['search-input', 'dropdown', 'radio-group', 'checkbox', 'range-slider', 'table', 'pagination', 'modal'],
    },
    profile: {
      title: 'Customer Profile',
      route: '/profile',
      requiresAuth: true,
      elements: ['text-input', 'email-input', 'tel-input', 'textarea', 'dropdown', 'radio-group', 'checkbox', 'file-upload', 'date-input'],
    },
    cart: {
      title: 'Shopping Cart',
      route: '/cart',
      requiresAuth: true,
      elements: ['number-input', 'table', 'alert', 'button-group'],
    },
    checkout: {
      title: 'Checkout & Payment',
      route: '/checkout',
      requiresAuth: true,
      elements: ['radio-group', 'checkbox', 'text-input', 'number-input', 'select', 'progress-bar', 'toggle'],
    },
    confirmation: {
      title: 'Order Confirmation',
      route: '/confirmation',
      requiresAuth: true,
      elements: ['alert-success', 'table', 'breadcrumb'],
    },
  };

  const page = pages[req.params.page];
  if (!page) {
    return res.status(404).json({ success: false, message: 'Page not found' });
  }

  res.json({ success: true, data: page });
});

const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (/\.[a-zA-Z0-9]+$/.test(req.path) && !req.path.endsWith('.html')) {
      return res.status(404).send('Not found');
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n  Automation Practice Store`);
  console.log(`  Website: http://localhost:${PORT}`);
  console.log(`  API:     http://localhost:${PORT}/api/health\n`);
});
