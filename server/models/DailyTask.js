import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  duration: String,
  completed: { type: Boolean, default: false },
  xpReward: { type: Number, default: 10 },
});

const plannerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  availableHours: {
    type: Number,
    default: 2,
  },
  tasks: [dailyTaskSchema],
  progress: {
    type: Number,
    default: 0,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

plannerSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyTask = mongoose.model('DailyTask', plannerSchema);
export default DailyTask;
