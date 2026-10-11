import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['DSA', 'Development', 'Projects', 'CS Fundamentals', 'Resume', 'Communication', 'Other'],
    required: true,
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  previousLevel: {
    type: Number,
    default: 0,
  },
  subSkills: [{
    name: String,
    level: { type: Number, min: 0, max: 100, default: 0 },
  }],
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
  },
  isGap: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index for user + skill name uniqueness
skillSchema.index({ user: 1, name: 1 }, { unique: true });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
