const excel = require('../services/excelService');

function getTokenFromRequest(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return req.headers['x-auth-token'] || '';
}

function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const session = excel.findById('sessions', 'token', token);
  if (!session || session.active !== 'true') {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }

  const user = excel.findById('users', 'id', session.userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  req.user = user;
  req.session = session;
  req.token = token;
  next();
}

function optionalAuth(req, _res, next) {
  const token = getTokenFromRequest(req);
  if (token) {
    const session = excel.findById('sessions', 'token', token);
    if (session && session.active === 'true') {
      const user = excel.findById('users', 'id', session.userId);
      if (user) {
        req.user = user;
        req.session = session;
        req.token = token;
      }
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth, getTokenFromRequest };
