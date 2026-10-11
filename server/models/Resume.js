import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: String,
  fileSize: Number,
  rawText: String,
  atsScore: { type: Number, default: 0 },
  scores: {
    ats: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    keywords: { type: Number, default: 0 },
  },
  strengths: [String],
  weaknesses: [String],
  missingKeywords: [String],
  matchedKeywords: [String],
  formattingIssues: [String],
  checklist: [{
    label: String,
    done: Boolean,
  }],
  analysisNote: String,
  projectQuality: {
    score: { type: Number, default: 0 },
    feedback: [String],
  },
  beforeAfter: [{
    before: String,
    after: String,
    section: String,
  }],
  suggestions: [String],
  analyzedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const Resume = mongoose.model('Resume', resumeAnalysisSchema);
export default Resume;
