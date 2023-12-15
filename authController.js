// controllers/authController.js

const express = require('express');
const path = require('path'); // Add this line to use path module
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Login route
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
  });

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      res.send('Invalid username or password');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Registration route
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
  });

router.post('/register', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const pass = password

  try {
    const user = new User({ username, password, pass });
    await user.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.status(500).send(`Internal Server Error (${error.message})`);
  }
});

//dashboard route
router.get('/dashboard', (req, res) => {
    // Check if the user is authenticated
    if (!req.session.user) {
      // If not authenticated, redirect to login
      return res.redirect('/auth/login');
    }
  
    // Render the dashboard HTML
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
  });


// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;
