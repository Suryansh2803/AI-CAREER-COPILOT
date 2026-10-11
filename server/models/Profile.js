import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  targetRole: {
    type: String,
    default: 'Software Development Engineer',
  },
  currentYear: String,
  college: String,
  branch: String,
  bio: String,
  linkedin: String,
  github: String,
  portfolio: String,
  careerReadiness: {
    score: { type: Number, default: 0 },
    previousScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['On Track', 'Needs Work', 'Excellent', 'Getting Started'],
      default: 'Getting Started',
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  strengths: [String],
  weaknesses: [String],
}, {
  timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
