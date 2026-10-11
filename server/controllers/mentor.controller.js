import asyncHandler from '../utils/asyncHandler.js';
import { getMentorResponse } from '../services/mentorService.js';

/**
 * POST /api/mentor/chat
 */
export const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required.');
  }

  const response = await getMentorResponse(message, {
    userId: req.user._id,
    name: req.user.name,
  });

  res.json({
    success: true,
    response: {
      message: response.message,
      type: response.type,
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * GET /api/mentor/suggestions
 */
export const getSuggestions = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    suggestions: [
      'What should I study today?',
      'Am I ready for an SDE internship?',
      'What skill should I learn next?',
      'Review my project.',
      'How can I improve my resume?',
    ],
  });
});
