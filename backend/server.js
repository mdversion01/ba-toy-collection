require('dotenv').config();
const db = require('./config/db');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const passport = require('./config/passport-config'); // Import your Passport configuration file
const authRoutes = require('./routes/authRoutes'); // Import the authentication route module
const registrationRoutes = require('./routes/registrationRoutes'); // Import the registration route module
const toyRoutes = require('./routes/toysRoute'); // Import toyRoutes module

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load the secret key from your secure environment (e.g., an environment variable)
const secretKey = process.env.SESSION_SECRET_KEY;

console.log('Secret Key:', secretKey);

// Initialize Passport
app.use(session({ 
  secret: secretKey, 
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Example authentication route
app.use('/api/users/login', authRoutes);

// Use the registrationRoutes middleware for the '/api/register' route
app.use('/api/users/register', registrationRoutes); // Use the route path where you want to handle user registration

// Use the toyRoutes middleware for the '/api/toys' route
app.use('/api/toys', toyRoutes);

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
