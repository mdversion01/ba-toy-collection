const bcrypt = require('bcryptjs');

const users = [
  {
    username: 'mdversion01',
    password: bcrypt.hashSync('butterCup5%5', 10),
    role: 'admin'
  },
  {
    username: 'guestUser',
    password: bcrypt.hashSync('1Guest@AT1me', 10),
    role: 'user'
  }
  // Add more users as needed
];

// Print the JSON string with hashed passwords to the console
console.log(JSON.stringify(users, null, 2));