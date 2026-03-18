const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedMobile = String(mobile || '').replace(/[^\d]/g, '');

    if (!normalizedName || !normalizedEmail || !normalizedMobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (normalizedMobile.length < 10 || normalizedMobile.length > 15) {
      return res.status(400).json({ message: 'Please enter a valid mobile number' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    const existingUserByEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserByEmail) return res.status(400).json({ message: 'User already exists' });

    const existingUserByMobile = await User.findOne({ mobile: normalizedMobile });
    if (existingUserByMobile) return res.status(400).json({ message: 'Mobile number already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({ name: normalizedName, email: normalizedEmail, mobile: normalizedMobile, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err && err.code === 11000) {
      if (err.keyPattern?.email) return res.status(400).json({ message: 'User already exists' });
      if (err.keyPattern?.mobile) return res.status(400).json({ message: 'Mobile number already registered' });
      return res.status(400).json({ message: 'Duplicate field value' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check user
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Validate password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
