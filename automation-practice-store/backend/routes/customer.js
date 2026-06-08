const excel = require('../services/excelService');
const { requireAuth } = require('../middleware/auth');

const router = require('express').Router();

router.get('/profile', requireAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phone: req.user.phone,
      address: req.user.address,
      city: req.user.city,
      state: req.user.state,
      zipCode: req.user.zipCode,
      country: req.user.country,
      preferredContact: req.user.preferredContact,
      newsletter: req.user.newsletter,
      membershipTier: req.user.membershipTier,
    },
  });
});

router.put('/profile', requireAuth, (req, res) => {
  const allowed = [
    'email', 'firstName', 'lastName', 'phone', 'address',
    'city', 'state', 'zipCode', 'country', 'preferredContact',
    'newsletter', 'membershipTier',
  ];

  const updates = {};
  for (const field of allowed) {
    if (req.body[field] !== undefined) {
      updates[field] = String(req.body[field]);
    }
  }

  const updated = excel.updateRow('users', 'id', req.user.id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phone: updated.phone,
      address: updated.address,
      city: updated.city,
      state: updated.state,
      zipCode: updated.zipCode,
      country: updated.country,
      preferredContact: updated.preferredContact,
      newsletter: updated.newsletter,
      membershipTier: updated.membershipTier,
    },
  });
});

module.exports = router;
