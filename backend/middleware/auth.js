function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || (req.session && req.session.userId)) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
}

module.exports = { ensureAuthenticated };
