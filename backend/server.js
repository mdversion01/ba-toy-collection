const express = require('express');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3002;

// Import toyRoutes module
const toyRoutes = require('./routes/toysRoute');

// Use the toyRoutes middleware for the '/api/toys' route
app.use('/api/toys', toyRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
