require('dotenv').config();
const db = require('./config/db');

const fs = require('fs/promises'); // Use fs.promises for async/await

const express = require('express');
const session = require('express-session');
const cors = require('cors');

const http = require('http'); // Import the 'http' module for use with socket.io
const socketIo = require('socket.io'); // Import socket.io
const passport = require('./config/passport-config'); // Import your Passport configuration file
const authRoutes = require('./routes/authRoutes'); // Import the authentication route module
const registrationRoutes = require('./routes/registrationRoutes'); // Import the registration route module
const toysRoute = require('./routes/toysRoute'); // Import toysRoute module
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app); // Create an HTTP server using Express
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
}); // Create a socket.io instance attached to the server

app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true,
 }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load the secret key from your secure environment (e.g., an environment variable)
const secretKey = process.env.SESSION_SECRET_KEY;

// Initialize Passport
app.use(session({ 
  secret: secretKey, 
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to add 'io' to the 'res' object
const socketIoMiddleware = (io) => (req, res, next) => {
  res.io = io;
  next();
};

// Use the middleware in your Express app
app.use(socketIoMiddleware(io));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where uploaded images will be stored
    cb(null, 'img'); // Create an 'uploads' directory in your project
  },
  filename: function (req, file, cb) {
    // Set the file name for the uploaded image (you can customize this logic)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST endpoint for image upload
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  // 'image' should match the name attribute in the form data (e.g., formData.append('image', imageFile);)

  // Retrieve the uploaded image file details
  const imageUrl = req.file.path; // Assuming the path to the uploaded image is returned

  // Process the image (save to database, perform other actions, etc.)
  // Return the URL or any other necessary information about the uploaded image
  res.json({ imageUrl: imageUrl });
});

// Assuming your database stores the base path to the 'img' directory
const baseImagePath = '';  // Replace with the actual base path from the database

app.post('/api/delete-image', async (req, res) => {
  const { src } = req.body;
  const filePath = path.join(baseImagePath, src);
  console.log('Deleting image:', filePath);

  try {
    // Delete the image file
    await fs.unlink(filePath);
    res.send('Image deleted successfully');
  } catch (error) {
    console.error("Error deleting image file:", error);
    res.status(500).send('Error deleting image');
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Example: Handle 'itemAdded' event from the client
  socket.on('itemAdded', () => {
    
    // Notify connected clients about the new item with a different event
    io.emit('itemAdded', { message: 'A new item has been added' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use('/img', express.static(path.join(__dirname, 'img')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Example authentication route
app.use('/api/users/login', authRoutes);

// Use the registrationRoutes middleware for the '/api/register' route
app.use('/api/users/register', registrationRoutes); // Use the route path where you want to handle user registration

// Use the toysRoute middleware for the '/api/toys' route
app.use('/api/toys', toysRoute);

const PORT = 3002;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
