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
const sharp = require('sharp');
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
app.post('/api/upload-image', upload.single('image'), async (req, res) => {

  try {

    // Assuming the path to the uploaded image is returned
    const imageUrl = req.file.path;
    
    // Define the path for the thumbnail
    // It assumes you have a 'thumbnails' directory inside 'img'
    const thumbnailPath = path.join('img/thumbnails', req.file.filename);

    // Use sharp to resize the image and save the thumbnail
    await sharp(req.file.path)
      .resize({
        height: 150,
        // By not specifying the width and using 'withoutEnlargement', 
        // it maintains the aspect ratio and ensures the image is not enlarged
        withoutEnlargement: true
      })
      .toFile(thumbnailPath);

    // Process the image (save to database, etc.), and return info as needed
    res.json({
      imageUrl: `img/${req.file.filename}`,
      thumbnailUrl: `img/thumbnails/${req.file.filename}`
    });

    // Log the path and filename of the uploaded image
    // console.log('Image path:', req.file.path);
    // console.log('Image filename:', req.file.filename);

  } catch (error) {
    console.error("Error processing image:", error);
    console.error("Error processing image with sharp:", error);
    res.status(500).send('Error processing image');
  }
});

// Assuming your database stores the base path to the 'img' directory
const baseImagePath = '';  // Replace with the actual base path from the database

app.post('/api/delete-image', async (req, res) => {
  const { src } = req.body;
  const filePath = path.join(baseImagePath, src);

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
  // console.log('A user connected with id:', socket.id);

  // Example: Handle 'itemAdded' event from the client
  socket.on('itemAdded', () => {
    
    // Notify connected clients about the new item with a different event
    io.emit('itemAdded', { message: 'A new item has been added' });
  });

  socket.on('disconnect', (reason) => {
    // console.log(`User disconnected. ID: ${socket.id}, Reason: ${reason}`);
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
  // console.log(`Server listening on port ${PORT}`);
});
