const excel = require('../services/excelService');
const { optionalAuth } = require('../middleware/auth');

const router = require('express').Router();

router.get('/', optionalAuth, (req, res) => {
  const { category, search, sort, minPrice, maxPrice } = req.query;
  let products = excel.readSheet('products');

  if (category && category !== 'all') {
    products = products.filter((p) => p.category === category);
  }

  if (search) {
    const term = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  if (minPrice) {
    products = products.filter((p) => Number(p.price) >= Number(minPrice));
  }

  if (maxPrice) {
    products = products.filter((p) => Number(p.price) <= Number(maxPrice));
  }

  if (sort === 'price-asc') {
    products.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'price-desc') {
    products.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === 'name') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

router.get('/categories', (_req, res) => {
  const products = excel.readSheet('products');
  const categories = [...new Set(products.map((p) => p.category))];
  res.json({ success: true, data: categories });
});

router.get('/:id', (req, res) => {
  const product = excel.findById('products', 'id', req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

module.exports = router;
