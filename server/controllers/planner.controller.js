import DailyTask from '../models/DailyTask.js';
import Progress from '../models/Progress.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateDailyPlan } from '../services/plannerService.js';

/**
 * GET /api/planner/today
 */
export const getTodayPlan = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let plan = await DailyTask.findOne({
    user: req.user._id,
    date: today,
  });

  if (!plan) {
    // Generate a default 2-hour plan
    const tasks = await generateDailyPlan(2, req.user);
    plan = await DailyTask.create({
      user: req.user._id,
      date: today,
      availableHours: 2,
      tasks,
    });
  }

  res.json({ success: true, plan });
});

/**
 * POST /api/planner/generate
 */
export const generatePlan = asyncHandler(async (req, res) => {
  const { availableHours } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await generateDailyPlan(availableHours || 2, req.user);

  const plan = await DailyTask.findOneAndUpdate(
    { user: req.user._id, date: today },
    { availableHours, tasks, progress: 0, xpEarned: 0 },
    { upsert: true, new: true }
  );

  res.json({ success: true, plan });
});

/**
 * PUT /api/planner/task/:taskIndex
 */
export const toggleTask = asyncHandler(async (req, res) => {
  const { taskIndex } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const plan = await DailyTask.findOne({
    user: req.user._id,
    date: today,
  });

  if (!plan) {
    res.status(404);
    throw new Error('No plan found for today');
  }

  const task = plan.tasks[taskIndex];
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.completed = !task.completed;

  // Recalculate progress and XP
  const completed = plan.tasks.filter((t) => t.completed).length;
  plan.progress = Math.round((completed / plan.tasks.length) * 100);
  plan.xpEarned = plan.tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.xpReward || 10), 0);

  await plan.save();

  // Update global progress/XP
  if (task.completed) {
    await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { totalXP: task.xpReward || 10 } },
      { upsert: true }
    );
  } else {
    await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { totalXP: -(task.xpReward || 10) } }
    );
  }

  res.json({ success: true, plan });
});
