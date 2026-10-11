import Resume from '../models/Resume.js';
import asyncHandler from '../utils/asyncHandler.js';
import { analyzeResume } from '../services/resumeAnalysisService.js';

/**
 * POST /api/resume/analyze
 */
export const analyzeResumeController = asyncHandler(async (req, res) => {
  const { resumeText, fileName, fileSize } = req.body;

  if (!resumeText) {
    res.status(400);
    throw new Error('Resume text is required.');
  }

  // Get AI analysis
  const analysis = await analyzeResume(resumeText, req.user);

  // Save to database
  const resume = await Resume.create({
    user: req.user._id,
    fileName: fileName || 'resume.pdf',
    fileSize: fileSize || 0,
    rawText: resumeText,
    ...analysis,
  });

  res.status(201).json({ success: true, analysis: resume });
});

/**
 * GET /api/resume/history
 */
export const getResumeHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('-rawText');

  res.json({ success: true, resumes });
});

/**
 * GET /api/resume/:id
 */
export const getResumeAnalysis = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    res.status(404);
    throw new Error('Resume analysis not found');
  }

  res.json({ success: true, analysis: resume });
});
