import Roadmap from '../models/Roadmap.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateRoadmap } from '../services/roadmapService.js';

/**
 * GET /api/roadmap
 */
export const getRoadmap = asyncHandler(async (req, res) => {
  let roadmap = await Roadmap.findOne({
    user: req.user._id,
    status: 'active',
  });

  if (!roadmap) {
    // Generate default roadmap
    const generated = await generateRoadmap('SDE', [], null);
    roadmap = await Roadmap.create({
      user: req.user._id,
      ...generated,
    });
  }

  res.json({ success: true, roadmap });
});

/**
 * POST /api/roadmap/generate
 */
export const createRoadmap = asyncHandler(async (req, res) => {
  const { targetRole, skillGaps } = req.body;

  // Mark existing roadmaps as paused
  await Roadmap.updateMany(
    { user: req.user._id, status: 'active' },
    { status: 'paused' }
  );

  const generated = await generateRoadmap(targetRole, skillGaps, req.user);

  const roadmap = await Roadmap.create({
    user: req.user._id,
    ...generated,
  });

  res.status(201).json({ success: true, roadmap });
});

/**
 * PUT /api/roadmap/:id/task/:weekIndex/:taskIndex
 */
export const updateTask = asyncHandler(async (req, res) => {
  const { id, weekIndex, taskIndex } = req.params;
  const { status } = req.body;

  const roadmap = await Roadmap.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!roadmap) {
    res.status(404);
    throw new Error('Roadmap not found');
  }

  const week = roadmap.weeks[weekIndex];
  if (!week) {
    res.status(404);
    throw new Error('Week not found');
  }

  const task = week.tasks[taskIndex];
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.status = status;
  if (status === 'completed') {
    task.completedAt = new Date();
  }

  // Recalculate progress
  const totalTasks = roadmap.weeks.reduce((sum, w) => sum + w.tasks.length, 0);
  const completedTasks = roadmap.weeks.reduce(
    (sum, w) => sum + w.tasks.filter((t) => t.status === 'completed').length, 0
  );
  roadmap.progress = Math.round((completedTasks / totalTasks) * 100);

  await roadmap.save();

  res.json({ success: true, roadmap });
});

/**
 * GET /api/roadmap/history
 */
export const getRoadmapHistory = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select('title progress status startDate createdAt');

  res.json({ success: true, roadmaps });
});
