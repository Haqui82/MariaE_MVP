const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env
const config = require('../MariaE_API/config/config'); // Import centralized config

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set Content-Security-Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'"
  );
  next();
});

// Serve static files from Front-End directory
app.use(express.static(path.join(__dirname, '..', 'Front-End')));

// Import and use API routes with /api prefix
const postRoutes = require('../MariaE_API/routes/post.js');
app.use('/api', postRoutes);

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Front-End', 'html', 'index.html'));
});

// Connect to database using Sequelize
const sequelize = config.db;

sequelize.authenticate()
  .then(() => {
    console.log('Connected to MariaDB using Sequelize');
  })
  .catch(err => {
    console.error('Could not connect to database:', err);
  });

// Export for Vercel
module.exports = app;
