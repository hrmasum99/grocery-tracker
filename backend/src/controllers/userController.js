const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node module
const User = require('../models/User');
const sendEmail = require('../utils/email'); // Import the utility

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user & Send Verification Email
// @route   POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate a random verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
    isVerified: false, // Default to false
  });

  if (user) {
    // Construct Verification URL
    // Ensure FRONTEND_URL is set in your .env (e.g., http://localhost:3000)
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    const message = `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your account:</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Grocery Tracker - Verify your email',
        message,
      });

      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account.',
      });
    } catch (error) {
      // If email fails, we might want to delete the user or allow resend
      console.error(error);
      res.status(500);
      throw new Error('Email could not be sent. Please try again.');
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Verify User Email
// @route   GET /api/users/verify/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  user.isVerified = true;
  user.verificationToken = undefined; // Clear the token
  await user.save();

  res.status(200).json({ message: 'Email verified successfully! You can now login.' });
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Please verify your email address before logging in.');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      fcmToken: user.fcmToken,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// ... (Keep existing getUsers, updateUser, deleteUser, updateFcmToken) ...
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404); throw new Error('User not found');
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404); throw new Error('User not found');
    }
});

const updateFcmToken = asyncHandler(async (req, res) => {
  const { fcmToken } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.fcmToken = fcmToken;
    await user.save();
    res.json({ message: 'Token updated' });
  } else {
    res.status(404); throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  verifyEmail, // Export this
  getUsers,
  updateUser,
  deleteUser,
  updateFcmToken
};