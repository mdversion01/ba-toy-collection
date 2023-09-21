const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // Import your MySQL User model

// Define a strategy for local (username and password) authentication
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Find the user in your MySQL database
    User.findByUsername(username, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect username.' }); }

      // Use the validPassword method to compare passwords
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    });
  }
));

// Serialize user object to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user object from the session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
