import mongoose from 'mongoose';

const careerAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  readinessScore: { type: Number, default: 0 },
  previousScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['On Track', 'Needs Work', 'Excellent', 'Getting Started'],
    default: 'Getting Started',
  },
  skillRadar: {
    dsa: { type: Number, default: 0 },
    development: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    csFundamentals: { type: Number, default: 0 },
    resume: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
  },
  strengths: [String],
  weaknesses: [String],
  careerGaps: [{
    name: String,
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
    },
    description: String,
  }],
  recommendations: [String],
  simulationResults: [{
    selectedActions: [String],
    projectedScore: Number,
    simulatedAt: { type: Date, default: Date.now },
  }],
  assessedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const CareerAssessment = mongoose.model('CareerAssessment', careerAssessmentSchema);
export default CareerAssessment;
