const express = require('express');
const passport = require('passport');
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost';

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/admin?error=auth_failed` }),
  (req, res) => {
    const allowedEmail = process.env.ADMIN_EMAIL;
    if (!allowedEmail || !req.user || req.user.email.toLowerCase() !== allowedEmail.toLowerCase()) {
      req.logout(() => {});
      if (req.session) req.session.destroy();
      return res.redirect(`${FRONTEND_URL}/admin?error=unauthorized`);
    }
    res.redirect(`${FRONTEND_URL}/admin/dashboard`);
  }
);

// Current user check
router.get('/current_user', (req, res) => {
  if (req.isAuthenticated() || (req.session && req.session.userId)) {
    return res.json({ isAuthenticated: true, user: req.user || { _id: req.session.userId } });
  }
  res.json({ isAuthenticated: false });
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout error' });
    if (req.session) req.session.destroy();
    res.json({ success: true });
  });
});

module.exports = router;
