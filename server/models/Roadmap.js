import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  estimatedTime: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  completedAt: Date,
});

const weekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: String,
  tasks: [taskSchema],
});

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: '30-Day Career Roadmap',
  },
  targetRole: String,
  duration: {
    type: Number,
    default: 30,  // days
  },
  weeks: [weekSchema],
  progress: {
    type: Number,
    default: 0,
  },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
