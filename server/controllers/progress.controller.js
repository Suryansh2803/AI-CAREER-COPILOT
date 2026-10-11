import Progress from '../models/Progress.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/progress
 */
export const getProgress = asyncHandler(async (req, res) => {
  let progress = await Progress.findOne({ user: req.user._id });

  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      badges: [
        {
          id: 'welcome',
          name: 'Welcome Aboard',
          description: 'Joined AI Career Copilot',
          icon: '🚀',
        },
      ],
    });
  }

  res.json({ success: true, progress });
});

/**
 * POST /api/progress/xp
 */
export const addXP = asyncHandler(async (req, res) => {
  const { amount, source } = req.body;

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id },
    {
      $inc: { totalXP: amount || 10 },
    },
    { new: true, upsert: true }
  );

  // Level up check (every 100 XP)
  const newLevel = Math.floor(progress.totalXP / 100) + 1;
  if (newLevel > progress.level) {
    progress.level = newLevel;
    await progress.save();
  }

  res.json({ success: true, progress });
});

/**
 * POST /api/progress/streak
 */
export const updateStreak = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({ user: req.user._id });

  if (!progress) {
    res.status(404);
    throw new Error('Progress not found');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = progress.streak.lastActiveDate
    ? new Date(progress.streak.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      progress.streak.current += 1;
    } else if (diffDays > 1) {
      // Streak broken
      progress.streak.current = 1;
    }
    // Same day — no change
  } else {
    progress.streak.current = 1;
  }

  progress.streak.longest = Math.max(progress.streak.longest, progress.streak.current);
  progress.streak.lastActiveDate = today;

  await progress.save();

  res.json({ success: true, progress });
});

/**
 * GET /api/progress/badges
 */
export const getBadges = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({ user: req.user._id });
  res.json({
    success: true,
    badges: progress?.badges || [],
    achievements: progress?.achievements || [],
  });
});
