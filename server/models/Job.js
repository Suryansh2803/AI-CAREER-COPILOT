import mongoose from 'mongoose';

const jobMatchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobTitle: String,
  company: String,
  matchScore: { type: Number, default: 0 },
  matchedSkills: [String],
  matchedOptionalSkills: [String],
  missingOptionalSkills: [{
    name: String,
    group: String,
    priority: String,
  }],
  missingSkills: [{
    name: String,
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
    },
  }],
  recommendations: [mongoose.Schema.Types.Mixed],
  summary: String,
  requirementCount: Number,
  optionalCount: Number,
  profileSkillCount: Number,
  skillComparison: [{
    skill: String,
    group: String,
    priority: String,
    isOptional: { type: Boolean, default: false },
    required: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
  }],
  analyzedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const Job = mongoose.model('Job', jobMatchSchema);
export default Job;
