const mysql = require('mysql2');
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbSocketPath = process.env.DB_SOCKET_PATH;

const db = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  socketPath: dbSocketPath, // for Mac and using MAMP
  waitForConnections: true,
  connectionLimit: 10, // Adjust this value based on your application's needs
  queueLimit: 0, // Unlimited queuing
});

// Handle connection errors
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    // console.log('Connected to the database');
    connection.release(); // Release the connection after successful connection
  }
});

// Add an error event handler for the connection pool
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Re-establish the connection if it's lost
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error reconnecting to the database:', err);
      } else {
        // console.log('Reconnected to the database');
        connection.release();
      }
    });
  }
});

module.exports = db;
