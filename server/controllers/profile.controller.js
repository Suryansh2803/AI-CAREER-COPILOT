import Profile from '../models/Profile.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    profile = await Profile.create({ user: req.user._id });
  }

  res.json({ success: true, profile });
});

/**
 * PUT /api/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'targetRole', 'currentYear', 'college', 'branch',
    'bio', 'linkedin', 'github', 'portfolio',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ success: true, profile });
});
