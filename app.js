// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); // Add this line to use path module
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/nodejs-mvc-auth', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the "img" folder
app.use('/img', express.static(path.join(__dirname, 'img')));
// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));



// Set up routes
const authRoutes = require('./controllers/authController');
app.use('/auth', authRoutes);

// Dashboard route
app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    // If not authenticated, redirect to login
    return res.redirect('/auth/login');
  }

  // Render the dashboard HTML
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
