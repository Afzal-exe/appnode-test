const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  // Check if user is authenticated (replace with your logic)
  if (req.isAuthenticated()) {
    res.render('login', { message: 'You are logged in!' });
  } else {
    res.render('login', { message: 'Please login' });
  }
});

module.exports = router;
