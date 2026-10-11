import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalXP: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: Date,
  },
  badges: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
  }],
  achievements: [{
    id: String,
    title: String,
    description: String,
    progress: { type: Number, default: 0 },
    target: { type: Number, default: 1 },
    completed: { type: Boolean, default: false },
    completedAt: Date,
  }],
}, {
  timestamps: true,
});

achievementSchema.index({ user: 1 }, { unique: true });

const Progress = mongoose.model('Progress', achievementSchema);
export default Progress;
