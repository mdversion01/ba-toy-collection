const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

const secretKey = process.env.SESSION_SECRET_KEY;

router.post('/', (req, res, next) => {

  console.log('Received a login request');

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, secretKey, {
        expiresIn: '1h', // Token expiration time
      });
      return res.status(200).json({ message: 'Authentication successful', token });
    });
  })(req, res, next);
});

module.exports = router;
