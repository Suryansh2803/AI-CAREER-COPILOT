import Interview from '../models/Interview.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getInterviewQuestions,
  evaluateAnswer,
  generateInterviewFeedback,
} from '../services/interviewService.js';

/**
 * POST /api/interview/start
 */
export const startInterview = asyncHandler(async (req, res) => {
  const { role, type, difficulty, count } = req.body;

  const questions = getInterviewQuestions(
    type || 'Technical',
    difficulty || 'Medium',
    Math.min(15, Math.max(1, Number(count) || 10)),
    role || 'SDE'
  );

  const interview = await Interview.create({
    user: req.user._id,
    role: role || 'SDE',
    type: type || 'Technical',
    difficulty: difficulty || 'Medium',
    questions,
    status: 'in-progress',
  });

  res.status(201).json({
    success: true,
    interview: {
      _id: interview._id,
      role: interview.role,
      type: interview.type,
      difficulty: interview.difficulty,
      questions: interview.questions,
      status: interview.status,
    },
  });
});

/**
 * POST /api/interview/:id/answer
 */
export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionIndex, answer } = req.body;

  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex >= interview.questions.length) {
    res.status(400);
    throw new Error('Invalid question index');
  }

  const evaluation = await evaluateAnswer(
    interview.questions[questionIndex],
    answer
  );

  interview.questions[questionIndex].answer = answer;
  interview.questions[questionIndex].feedback = evaluation.feedback;
  interview.questions[questionIndex].score = evaluation.score;
  interview.questions[questionIndex].evaluation = evaluation;

  await interview.save();

  res.json({ success: true, evaluation });
});

/**
 * POST /api/interview/:id/complete
 */
export const completeInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  const feedback = await generateInterviewFeedback(interview.questions);

  interview.results = {
    technicalAccuracy: feedback.technicalAccuracy,
    communication: feedback.communication,
    clarity: feedback.clarity,
    overall: feedback.overall,
  };
  interview.feedback = {
    strengths: feedback.strengths,
    weaknesses: feedback.weaknesses,
    improvements: feedback.improvements,
  };
  interview.answeredCount = feedback.answeredCount;
  interview.status = 'completed';
  interview.completedAt = new Date();

  await interview.save();

  res.json({ success: true, interview });
});

/**
 * GET /api/interview/history
 */
export const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('role type difficulty results status createdAt');

  res.json({ success: true, interviews });
});
