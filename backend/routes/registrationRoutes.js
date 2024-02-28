const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const registrationValidationRules = () => {
  return [
    // Username validation
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isAlphanumeric()
      .withMessage('Username should contain only letters and numbers')
      .isLength({ min: 4, max: 20 })
      .withMessage('Username must be between 4 and 20 characters'),

    // Password validation
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)
      .withMessage('Password must contain at least one letter, one number, and one special character'),
  ];
};

  router.post('/', registrationValidationRules(), async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, role } = req.body;

      // Check if the username already exists in the database
      const usernameCheckSql = 'SELECT * FROM users WHERE username = ?';
      db.query(usernameCheckSql, [username], async (usernameCheckError, usernameCheckResults) => {
        if (usernameCheckError) {
          console.error(usernameCheckError);
          return res.status(500).json({ error: 'An error occurred while checking the username.' });
        }

        if (usernameCheckResults.length > 0) {
          return res.status(400).json({ error: 'Username already exists' });
        }

        // Check if the password already exists in the database (if needed)
        // Modify the query accordingly if you want to check for existing passwords

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10).catch((error) => {
          console.error('Bcrypt error:', error);
          // Handle the bcrypt error, e.g., return an error response
          res.status(500).json({ error: 'An error occurred during password hashing' });
        });

        const insertSql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        const values = [username, hashedPassword, role];

        db.query(insertSql, values, (insertError, insertResults) => {
          if (insertError) {
            console.error(insertError);
            return res.status(500).json({ error: 'An error occurred while registering the user.' });
          }

          res.status(201).json({ message: 'User registered successfully' });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while hashing the password.' });
    }
  }
);

module.exports = router;
