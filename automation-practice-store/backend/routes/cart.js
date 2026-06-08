const { v4: uuidv4 } = require('uuid');
const excel = require('../services/excelService');
const { requireAuth } = require('../middleware/auth');

const router = require('express').Router();

function getCartItems(userId) {
  return excel.findAll('cart_items', (item) => item.userId === userId);
}

function enrichCartItems(items) {
  return items.map((item) => {
    const product = excel.findById('products', 'id', item.productId);
    const price = product ? Number(product.price) : 0;
    const quantity = Number(item.quantity);
    return {
      id: item.id,
      productId: item.productId,
      name: product?.name || 'Unknown',
      category: product?.category || '',
      price,
      quantity,
      lineTotal: price * quantity,
      image: product?.image || '',
    };
  });
}

router.get('/', requireAuth, (req, res) => {
  const items = enrichCartItems(getCartItems(req.user.id));
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  res.json({
    success: true,
    data: {
      items,
      summary: {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        tax: subtotal * 0.08,
        shipping: subtotal > 50 ? 0 : 5.99,
        total: subtotal + subtotal * 0.08 + (subtotal > 50 ? 0 : 5.99),
      },
    },
  });
});

router.post('/items', requireAuth, (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required' });
  }

  const product = excel.findById('products', 'id', productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const qty = Math.max(1, Number(quantity) || 1);
  const existing = getCartItems(req.user.id).find((item) => item.productId === productId);

  if (existing) {
    const updated = excel.updateRow('cart_items', 'id', existing.id, {
      quantity: String(Number(existing.quantity) + qty),
    });
    return res.status(201).json({
      success: true,
      message: 'Cart updated',
      data: enrichCartItems([updated])[0],
    });
  }

  const item = excel.insertRow('cart_items', {
    id: uuidv4(),
    userId: req.user.id,
    productId,
    quantity: String(qty),
    addedAt: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: 'Item added to cart',
    data: enrichCartItems([item])[0],
  });
});

router.put('/items/:id', requireAuth, (req, res) => {
  const item = excel.findById('cart_items', 'id', req.params.id);
  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Cart item not found' });
  }

  const quantity = Math.max(1, Number(req.body.quantity) || 1);
  const updated = excel.updateRow('cart_items', 'id', req.params.id, {
    quantity: String(quantity),
  });

  res.json({
    success: true,
    message: 'Quantity updated',
    data: enrichCartItems([updated])[0],
  });
});

router.delete('/items/:id', requireAuth, (req, res) => {
  const item = excel.findById('cart_items', 'id', req.params.id);
  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Cart item not found' });
  }

  excel.deleteRow('cart_items', 'id', req.params.id);
  res.json({ success: true, message: 'Item removed from cart' });
});

router.delete('/', requireAuth, (req, res) => {
  excel.deleteWhere('cart_items', (item) => item.userId === req.user.id);
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = router;
