const express = require('express');
const passport = require('passport');
const User = require('../models/user'); // Import User model

const router = express.Router();

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ error: 'Invalid username or password' }); }

    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.json({ message: 'Login successful' });
    });
  })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
