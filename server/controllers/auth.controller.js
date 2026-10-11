import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Progress from '../models/Progress.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendTokenResponse } from '../utils/jwt.js';

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists.');
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Create blank profile
  await Profile.create({ user: user._id });

  // Create blank progress/achievements
  await Progress.create({ user: user._id });

  sendTokenResponse(user, 201, res);
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password.');
  }

  // Find user (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (_req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

/**
 * PUT /api/auth/onboarding
 */
export const completeOnboarding = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.onboardingCompleted = true;
  user.onboardingData = req.body;
  await user.save();

  // Update profile with onboarding data
  await Profile.findOneAndUpdate(
    { user: user._id },
    {
      targetRole: req.body.targetRole,
      currentYear: req.body.currentYear,
      college: req.body.college,
      branch: req.body.branch,
    },
    { upsert: true }
  );

  res.json({ success: true, user });
});
