import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    default: 'SDE',
  },
  type: {
    type: String,
    enum: ['Technical', 'HR', 'Mixed'],
    default: 'Technical',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  questions: [{
    question: String,
    id: String,
    topic: String,
    guidance: String,
    keyPoints: [String],
    sampleAnswer: String,
    difficulty: String,
    answer: String,
    feedback: String,
    score: Number,
    evaluation: {
      score: Number,
      feedback: String,
      matchedPoints: [String],
      strengths: [String],
      weaknesses: [String],
      improvements: [String],
      modelAnswer: String,
      scores: {
        technicalAccuracy: Number,
        communication: Number,
        clarity: Number,
        overall: Number,
      },
    },
  }],
  results: {
    technicalAccuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
  },
  answeredCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
}, {
  timestamps: true,
});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
