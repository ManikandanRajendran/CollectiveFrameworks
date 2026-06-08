const excel = require('../services/excelService');
const { requireAuth } = require('../middleware/auth');

const router = require('express').Router();

router.get('/', requireAuth, (req, res) => {
  const orders = excel
    .findAll('orders', (o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    success: true,
    count: orders.length,
    data: orders.map(formatOrder),
  });
});

router.get('/:id', requireAuth, (req, res) => {
  const order = excel.findById('orders', 'id', req.params.id);
  if (!order || order.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: formatOrder(order) });
});

function formatOrder(order) {
  let items = [];
  try {
    items = JSON.parse(order.itemsJson || '[]');
  } catch {
    items = [];
  }

  return {
    id: order.id,
    status: order.status,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shipping: Number(order.shipping),
    total: Number(order.total),
    shippingMethod: order.shippingMethod,
    giftWrap: order.giftWrap === 'true',
    cardBrand: order.cardBrand,
    cardLast4: order.cardLast4,
    cardHolder: order.cardHolder,
    items,
    createdAt: order.createdAt,
  };
}

module.exports = router;
