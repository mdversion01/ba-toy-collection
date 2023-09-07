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

router.post(
  '/',
  registrationValidationRules(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      const values = [username, hashedPassword, role];

      db.query(sql, values, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred while registering the user.' });
        }

        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while hashing the password.' });
    }
  }
);

module.exports = router;
