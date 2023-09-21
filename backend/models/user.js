const db = require('../config/db'); // Import your MySQL database connection
const bcrypt = require('bcrypt');

class User {
  constructor(id, username, password, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  static findByUsername(username, callback) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      if (results.length === 0) {
        return callback(null, null); // User not found
      }
      const user = results[0];
      return callback(null, new User(user.id, user.username, user.password, user.role));
    });
  }

  validPassword(password) {
    // Use bcrypt to compare the provided password with the hashed password
    return bcrypt.compareSync(password, this.password);
  }

  // Add other methods for user-related operations
}

module.exports = User;
