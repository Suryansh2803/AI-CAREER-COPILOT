import CareerAssessment from '../models/CareerAssessment.js';
import Profile from '../models/Profile.js';
import asyncHandler from '../utils/asyncHandler.js';
import { analyzeCareer, simulateCareer, analyzeSkillGaps } from '../services/careerAnalysisService.js';

/**
 * GET /api/career/assessment
 */
export const getAssessment = asyncHandler(async (req, res) => {
  let assessment = await CareerAssessment.findOne({ user: req.user._id })
    .sort({ createdAt: -1 });

  if (!assessment) {
    // Generate initial assessment
    const profile = await Profile.findOne({ user: req.user._id });
    const analysis = await analyzeCareer(profile, []);

    assessment = await CareerAssessment.create({
      user: req.user._id,
      ...analysis,
    });

    // Update profile readiness
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        careerReadiness: {
          score: analysis.readinessScore,
          previousScore: analysis.previousScore,
          status: analysis.status,
          lastUpdated: new Date(),
        },
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
      }
    );
  }

  res.json({ success: true, assessment });
});

/**
 * POST /api/career/refresh
 */
export const refreshAssessment = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  const analysis = await analyzeCareer(profile, []);

  const assessment = await CareerAssessment.create({
    user: req.user._id,
    ...analysis,
  });

  await Profile.findOneAndUpdate(
    { user: req.user._id },
    {
      careerReadiness: {
        score: analysis.readinessScore,
        previousScore: analysis.previousScore,
        status: analysis.status,
        lastUpdated: new Date(),
      },
    }
  );

  res.json({ success: true, assessment });
});

/**
 * POST /api/career/simulate
 */
export const simulate = asyncHandler(async (req, res) => {
  const { currentScore, selectedActions } = req.body;

  const result = await simulateCareer(currentScore || 78, selectedActions || []);

  // Save simulation to latest assessment
  await CareerAssessment.findOneAndUpdate(
    { user: req.user._id },
    {
      $push: {
        simulationResults: {
          selectedActions,
          projectedScore: result.projectedScore,
        },
      },
    },
    { sort: { createdAt: -1 } }
  );

  res.json({ success: true, simulation: result });
});

/**
 * POST /api/career/skill-gaps
 */
export const getSkillGaps = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;
  const result = await analyzeSkillGaps([], targetRole || 'Software Development Engineer');
  res.json({ success: true, gaps: result });
});
