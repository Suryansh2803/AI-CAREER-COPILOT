import Job from '../models/Job.js';
import asyncHandler from '../utils/asyncHandler.js';
import { analyzeJobMatch } from '../services/jobMatchService.js';

/**
 * POST /api/jobs/analyze
 */
export const analyzeJob = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription) {
    res.status(400);
    throw new Error('Job description is required.');
  }

  const analysis = await analyzeJobMatch(jobDescription, req.user);

  const job = await Job.create({
    user: req.user._id,
    jobDescription,
    ...analysis,
  });

  res.status(201).json({ success: true, analysis: job });
});

/**
 * GET /api/jobs/history
 */
export const getJobHistory = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('-jobDescription');

  res.json({ success: true, jobs });
});

/**
 * GET /api/jobs/:id
 */
export const getJobAnalysis = asyncHandler(async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!job) {
    res.status(404);
    throw new Error('Job analysis not found');
  }

  res.json({ success: true, analysis: job });
});
