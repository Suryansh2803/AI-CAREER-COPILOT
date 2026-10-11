import Skill from '../models/Skill.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/skills
 */
export const getSkills = asyncHandler(async (req, res) => {
  let skills = await Skill.find({ user: req.user._id });

  // If no skills exist, seed with defaults
  if (skills.length === 0) {
    const defaults = [
      { name: 'DSA', category: 'DSA', level: 85, previousLevel: 79 },
      { name: 'Development', category: 'Development', level: 78, previousLevel: 72 },
      { name: 'Projects', category: 'Projects', level: 72, previousLevel: 68 },
      { name: 'CS Fundamentals', category: 'CS Fundamentals', level: 64, previousLevel: 58 },
      { name: 'Resume', category: 'Resume', level: 70, previousLevel: 65 },
      { name: 'Communication', category: 'Communication', level: 68, previousLevel: 62 },
    ];

    skills = await Skill.insertMany(
      defaults.map((s) => ({ ...s, user: req.user._id }))
    );
  }

  res.json({ success: true, skills });
});

/**
 * PUT /api/skills/:id
 */
export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  res.json({ success: true, skill });
});

/**
 * POST /api/skills
 */
export const addSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({ success: true, skill });
});

/**
 * GET /api/skills/gaps
 */
export const getSkillGaps = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ user: req.user._id, isGap: true });
  res.json({ success: true, gaps: skills });
});
