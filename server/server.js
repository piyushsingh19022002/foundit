require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Item = require('./models/Item');
const { upload } = require('./utils/s3-helper');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/found-it';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    
    user = new User({ name, email, password });
    await user.save();
    
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name, email } });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email } });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
});

// Multer Wrapper for Error Handling
const multerUpload = upload.single('image');

// Create Item Route
app.post('/api/items', auth, (req, res, next) => {
  multerUpload(req, res, function(err) {
    if (err) {
      console.error('S3 Upload Error:', err);
      return res.status(400).json({ msg: 'S3 Error: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { title, description, category, type, location } = req.body;
    const imageUrl = req.file ? req.file.location : null;
    
    const newItem = new Item({
      title, description, category, type, location, imageUrl, reporter: req.user.id
    });
    
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error('Create Item Error:', err);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
});

// Get Items Route
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().populate('reporter', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
