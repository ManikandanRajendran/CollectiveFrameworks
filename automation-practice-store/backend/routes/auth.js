const { v4: uuidv4 } = require('uuid');
const excel = require('../services/excelService');
const { requireAuth } = require('../middleware/auth');

const router = require('express').Router();

router.post('/register', (req, res) => {
  const {
    username,
    password,
    confirmPassword,
    email,
    firstName,
    lastName,
    phone,
    accountType,
    newsletter,
    agreeTerms,
  } = req.body;

  const errors = [];

  if (!username?.trim()) errors.push('Username is required');
  if (!password) errors.push('Password is required');
  if (!confirmPassword) errors.push('Confirm password is required');
  if (!email?.trim()) errors.push('Email is required');
  if (!firstName?.trim()) errors.push('First name is required');
  if (!lastName?.trim()) errors.push('Last name is required');
  if (!agreeTerms) errors.push('You must agree to the terms and conditions');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }

  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmedUsername)) {
    return res.status(400).json({
      success: false,
      message: 'Username must be 3–20 characters (letters, numbers, underscore only)',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be 8+ chars with uppercase, lowercase, number, and special character',
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const users = excel.readSheet('users');
  if (users.some((u) => u.username === trimmedUsername)) {
    return res.status(409).json({ success: false, message: 'Username already exists' });
  }
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const validAccountTypes = ['personal', 'business'];
  const membershipTier = validAccountTypes.includes(accountType) && accountType === 'business'
    ? 'silver'
    : 'bronze';

  const user = excel.insertRow('users', {
    id: `user-${uuidv4().slice(0, 8)}`,
    username: trimmedUsername,
    password,
    email: trimmedEmail,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phone: phone?.trim() || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    preferredContact: 'email',
    newsletter: newsletter ? 'true' : 'false',
    membershipTier,
  });

  const token = uuidv4();
  excel.insertRow('sessions', {
    token,
    userId: user.id,
    active: 'true',
    rememberMe: 'false',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
});

router.post('/login', (req, res) => {
  const { username, password, rememberMe } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }

  const user = excel.findAll('users').find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password',
    });
  }

  const token = uuidv4();
  excel.insertRow('sessions', {
    token,
    userId: user.id,
    active: 'true',
    rememberMe: rememberMe ? 'true' : 'false',
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
});

router.post('/logout', requireAuth, (req, res) => {
  excel.updateRow('sessions', 'token', req.token, { active: 'false' });
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    data: sanitizeUser(req.user),
  });
});

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

module.exports = router;
