const { v4: uuidv4 } = require('uuid');
const excel = require('../services/excelService');
const { requireAuth } = require('../middleware/auth');

const router = require('express').Router();

const VALID_CARDS = {
  '4111111111111111': { brand: 'Visa', cvv: '123' },
  '5555555555554444': { brand: 'Mastercard', cvv: '456' },
  '378282246310005': { brand: 'Amex', cvv: '7890' },
};

function getCartItems(userId) {
  return excel.findAll('cart_items', (item) => item.userId === userId);
}

function calculateTotals(userId) {
  const items = getCartItems(userId);
  let subtotal = 0;
  const orderItems = items.map((item) => {
    const product = excel.findById('products', 'id', item.productId);
    const price = product ? Number(product.price) : 0;
    const quantity = Number(item.quantity);
    const lineTotal = price * quantity;
    subtotal += lineTotal;
    return {
      productId: item.productId,
      name: product?.name || 'Unknown',
      price,
      quantity,
      lineTotal,
    };
  });

  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return { items: orderItems, subtotal, tax, shipping, total };
}

router.post('/validate', requireAuth, (req, res) => {
  const totals = calculateTotals(req.user.id);

  if (totals.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty',
    });
  }

  const { shippingMethod, giftWrap } = req.body;
  const validShipping = ['standard', 'express', 'overnight'];

  if (shippingMethod && !validShipping.includes(shippingMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid shipping method',
    });
  }

  let extraShipping = 0;
  if (shippingMethod === 'express') extraShipping = 9.99;
  if (shippingMethod === 'overnight') extraShipping = 19.99;

  res.json({
    success: true,
    data: {
      ...totals,
      shipping: totals.shipping + extraShipping,
      total: totals.total + extraShipping + (giftWrap ? 3.99 : 0),
      shippingMethod: shippingMethod || 'standard',
      giftWrap: Boolean(giftWrap),
    },
  });
});

router.post('/payment', requireAuth, (req, res) => {
  const {
    cardNumber,
    cardHolder,
    expiryMonth,
    expiryYear,
    cvv,
    billingSameAsShipping,
    shippingMethod,
    giftWrap,
    agreeTerms,
  } = req.body;

  const totals = calculateTotals(req.user.id);
  if (totals.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  if (!agreeTerms) {
    return res.status(400).json({
      success: false,
      message: 'You must agree to terms and conditions',
    });
  }

  if (!cardNumber || !cardHolder || !expiryMonth || !expiryYear || !cvv) {
    return res.status(400).json({
      success: false,
      message: 'All payment fields are required',
    });
  }

  const cleanCard = cardNumber.replace(/\s/g, '');
  const cardInfo = VALID_CARDS[cleanCard];

  if (!cardInfo) {
    return res.status(402).json({
      success: false,
      message: 'Payment declined — use a test card (see README)',
    });
  }

  if (cvv !== cardInfo.cvv) {
    return res.status(402).json({
      success: false,
      message: 'Invalid CVV for test card',
    });
  }

  if (isCardExpired(expiryMonth, expiryYear)) {
    return res.status(402).json({
      success: false,
      message: 'Card has expired',
    });
  }

  let extraShipping = 0;
  if (shippingMethod === 'express') extraShipping = 9.99;
  if (shippingMethod === 'overnight') extraShipping = 19.99;

  const finalTotal =
    totals.total + extraShipping + (giftWrap ? 3.99 : 0);

  const orderId = `ORD-${Date.now()}`;
  const order = excel.insertRow('orders', {
    id: orderId,
    userId: req.user.id,
    status: 'confirmed',
    subtotal: String(totals.subtotal),
    tax: String(totals.tax),
    shipping: String(totals.shipping + extraShipping),
    total: String(finalTotal),
    shippingMethod: shippingMethod || 'standard',
    giftWrap: giftWrap ? 'true' : 'false',
    billingSameAsShipping: billingSameAsShipping ? 'true' : 'false',
    cardLast4: cleanCard.slice(-4),
    cardBrand: cardInfo.brand,
    cardHolder,
    itemsJson: JSON.stringify(totals.items),
    createdAt: new Date().toISOString(),
  });

  excel.deleteWhere('cart_items', (item) => item.userId === req.user.id);

  res.status(201).json({
    success: true,
    message: 'Payment successful',
    data: {
      orderId: order.id,
      status: order.status,
      total: Number(order.total),
      cardBrand: order.cardBrand,
      cardLast4: order.cardLast4,
      estimatedDelivery: getEstimatedDelivery(shippingMethod),
    },
  });
});

function isCardExpired(expiryMonth, expiryYear) {
  const now = new Date();
  const expYear = Number(expiryYear);
  const expMonth = Number(expiryMonth);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expYear < currentYear) return true;
  if (expYear === currentYear && expMonth < currentMonth) return true;
  return false;
}

function getEstimatedDelivery(method) {
  const days = method === 'overnight' ? 1 : method === 'express' ? 3 : 7;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

module.exports = router;
