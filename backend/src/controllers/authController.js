const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.mockSendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone is required' });
  return res.json({ message: 'Mock OTP sent', otp: '123456' });
};

exports.signup = async (req, res) => {
  const { name, phone, password, role } = req.body;
  const existingUser = await User.findOne({ phone });
  if (existingUser) return res.status(400).json({ message: 'Phone already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, phone, password: hashed, role: role || 'customer' });

  return res.status(201).json({ token: generateToken(user), user });
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  return res.json({ token: generateToken(user), user });
};
