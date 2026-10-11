/**
 * Database Seed Script
 *
 * Populates initial data for the demo user
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Progress from '../models/Progress.js';
import CareerAssessment from '../models/CareerAssessment.js';
import Roadmap from '../models/Roadmap.js';
import DailyTask from '../models/DailyTask.js';
import Job from '../models/Job.js';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';

export async function seed(force = true) {
  const existingUser = await User.findOne({ email: 'demo@example.com' });
  if (existingUser && !force) {
    return existingUser;
  }

  console.log('🌱 Seeding database...');

  if (force) {
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Progress.deleteMany({});
    await CareerAssessment.deleteMany({});
    await Roadmap.deleteMany({});
    await DailyTask.deleteMany({});
    await Job.deleteMany({});
    await Interview.deleteMany({});
    await Resume.deleteMany({});
  }

  // Create demo user
  const user = await User.create({
    name: 'Suryansh Dev',
    email: 'demo@example.com',
    password: 'Demo@1234',
    onboardingCompleted: true,
    onboardingData: {
      targetRole: 'Software Development Engineer',
      currentYear: '3rd Year',
      college: 'Indian Institute of Technology',
      branch: 'Computer Science',
      skills: ['C++', 'JavaScript', 'React', 'SQL', 'Git'],
      experience: '1-2 years',
      goals: ['Get an SDE internship', 'Build full-stack projects'],
      studyHours: '2-3 hours',
    },
  });

  // Create profile
  await Profile.create({
    user: user._id,
    targetRole: 'Software Development Engineer',
    currentYear: '3rd Year',
    college: 'Indian Institute of Technology',
    branch: 'Computer Science',
    careerReadiness: {
      score: 78,
      previousScore: 72,
      status: 'On Track',
      lastUpdated: new Date(),
    },
    strengths: ['DSA', 'Problem Solving', 'Frontend Development'],
    weaknesses: ['Backend Development', 'System Design', 'Cloud Services'],
  });

  // Create skills
  const skills = [
    { name: 'DSA', category: 'DSA', level: 85, previousLevel: 79 },
    { name: 'Development', category: 'Development', level: 78, previousLevel: 72 },
    { name: 'Projects', category: 'Projects', level: 72, previousLevel: 68 },
    { name: 'CS Fundamentals', category: 'CS Fundamentals', level: 64, previousLevel: 58 },
    { name: 'Resume', category: 'Resume', level: 70, previousLevel: 65 },
    { name: 'Communication', category: 'Communication', level: 68, previousLevel: 62 },
  ];
  await Skill.insertMany(skills.map((s) => ({ ...s, user: user._id })));

  // Create progress
  await Progress.create({
    user: user._id,
    totalXP: 240,
    level: 3,
    streak: {
      current: 5,
      longest: 12,
      lastActiveDate: new Date(),
    },
    badges: [
      { id: 'welcome', name: 'Welcome Aboard', description: 'Joined AI Career Copilot', icon: '🚀' },
      { id: 'first-plan', name: 'Planner', description: 'Completed first daily plan', icon: '📋' },
      { id: 'dsa-warrior', name: 'DSA Warrior', description: 'Solved 50+ DSA problems', icon: '⚔️' },
    ],
  });

  // Create career assessment
  await CareerAssessment.create({
    user: user._id,
    readinessScore: 78,
    previousScore: 72,
    status: 'On Track',
    skillRadar: {
      dsa: 85,
      development: 78,
      projects: 72,
      csFundamentals: 64,
      resume: 70,
      communication: 68,
    },
    strengths: ['DSA', 'Problem Solving', 'Frontend Development'],
    weaknesses: ['Backend Development', 'System Design', 'Cloud Services'],
    careerGaps: [
      { name: 'Backend Development', priority: 'Critical', description: 'Need to learn Node.js, Express, and REST API design' },
      { name: 'System Design', priority: 'High', description: 'Study scalability patterns and distributed systems basics' },
      { name: 'Advanced DSA', priority: 'Medium', description: 'Practice graph algorithms and dynamic programming' },
    ],
  });

  // Create 30-day roadmap
  await Roadmap.create({
    user: user._id,
    title: '30-Day SDE Career Acceleration Roadmap',
    targetRole: 'Software Development Engineer',
    duration: 30,
    progress: 35,
    weeks: [
      {
        weekNumber: 1,
        title: 'Backend Fundamentals with Node.js',
        tasks: [
          { title: 'Learn Node.js Event Loop & Async Architecture', description: 'Master callbacks, Promises, and async/await under the hood', estimatedTime: '3h', difficulty: 'Medium', status: 'completed' },
          { title: 'Core Node Modules (fs, path, http, streams)', description: 'Work with native APIs without external libraries', estimatedTime: '2h', difficulty: 'Easy', status: 'completed' },
          { title: 'Build a CLI File Parser', description: 'Small hands-on utility project', estimatedTime: '2.5h', difficulty: 'Medium', status: 'completed' },
        ],
      },
      {
        weekNumber: 2,
        title: 'Express & RESTful API Architecture',
        tasks: [
          { title: 'Routing, Controllers & Middleware in Express', description: 'Structure enterprise scalable folders', estimatedTime: '3h', difficulty: 'Medium', status: 'completed' },
          { title: 'Request Validation & Global Error Handling', description: 'Use express-validator and custom error middleware', estimatedTime: '2h', difficulty: 'Medium', status: 'in-progress' },
          { title: 'JWT Authentication & Role-based Access Control', description: 'Implement token refresh and cookie sessions', estimatedTime: '4h', difficulty: 'Hard', status: 'pending' },
        ],
      },
      {
        weekNumber: 3,
        title: 'Database Design & MongoDB Integration',
        tasks: [
          { title: 'Schema Modeling & Indexes in Mongoose', description: 'Optimize queries and indexing strategies', estimatedTime: '3.5h', difficulty: 'Medium', status: 'pending' },
          { title: 'Complex Aggregations & Pagination', description: 'Build filtering, sorting and faceted search', estimatedTime: '3h', difficulty: 'Hard', status: 'pending' },
          { title: 'Database Security & Sanitization', description: 'NoSQL injection prevention and sanitization', estimatedTime: '2h', difficulty: 'Medium', status: 'pending' },
        ],
      },
      {
        weekNumber: 4,
        title: 'Capstone Backend Project & Production Deployment',
        tasks: [
          { title: 'Architect & Implement Full REST API', description: 'Complete backend with testing and docs', estimatedTime: '6h', difficulty: 'Hard', status: 'pending' },
          { title: 'Docker Containerization & CI/CD Pipeline', description: 'Containerize and setup automated GitHub Actions', estimatedTime: '3h', difficulty: 'Medium', status: 'pending' },
          { title: 'System Design Walkthrough & Documentation', description: 'Document architecture diagrams and API specs', estimatedTime: '2h', difficulty: 'Easy', status: 'pending' },
        ],
      },
    ],
  });

  // Create today's planner
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await DailyTask.create({
    user: user._id,
    date: today,
    availableHours: 3,
    progress: 75,
    xpEarned: 45,
    tasks: [
      { title: 'Solve 2 LeetCode Medium Graph problems', category: 'DSA', duration: '60 min', completed: true, xpReward: 20 },
      { title: 'Review Database Indexing & B-Trees', category: 'CS Fundamentals', duration: '40 min', completed: true, xpReward: 15 },
      { title: 'Implement JWT Middleware in Express', category: 'Backend', duration: '50 min', completed: false, xpReward: 20 },
      { title: 'Revise Object-Oriented Design principles', category: 'System Design', duration: '30 min', completed: true, xpReward: 10 },
    ],
  });

  // Create sample job match
  await Job.create({
    user: user._id,
    jobTitle: 'Junior Software Development Engineer',
    company: 'TechCorp Solutions',
    matchScore: 84,
    jobDescription: 'Looking for a passionate Software Development Engineer with strong DSA, C++, SQL, and modern JavaScript knowledge. Experience with AWS and basic System Design is a plus.',
    matchedSkills: ['DSA', 'C++', 'SQL', 'Git', 'JavaScript'],
    missingSkills: [
      { name: 'AWS Cloud', priority: 'Critical' },
      { name: 'System Design', priority: 'High' },
      { name: 'Docker / Containers', priority: 'Medium' },
    ],
    recommendations: [
      'Learn AWS fundamentals (EC2, S3, RDS)',
      'Study basic System Design and distributed patterns',
      'Deploy full-stack projects using modern cloud workflows',
    ],
    skillComparison: [
      { skill: 'DSA & Algorithms', required: 85, current: 85 },
      { skill: 'Languages (C++/JS)', required: 80, current: 82 },
      { skill: 'Databases & SQL', required: 75, current: 75 },
      { skill: 'System Design', required: 70, current: 50 },
      { skill: 'Cloud & DevOps', required: 65, current: 40 },
    ],
  });

  // Create sample interview record
  await Interview.create({
    user: user._id,
    role: 'SDE',
    type: 'Technical',
    difficulty: 'Medium',
    status: 'completed',
    results: {
      technicalAccuracy: 84,
      communication: 78,
      clarity: 82,
      overall: 81,
    },
    feedback: {
      strengths: [
        'Clear understanding of operating systems concepts (Processes vs Threads)',
        'Good use of technical terminology and concise memory space explanation',
      ],
      weaknesses: [
        'Could provide more concrete IPC (Inter-Process Communication) real-world examples',
      ],
      improvements: [
        'Discuss context switching overhead differences between threads and processes',
      ],
    },
    questions: [
      {
        question: 'Explain the difference between a process and a thread.',
        answer: 'A process is an executing instance of an application with its own dedicated memory space, whereas a thread is a lightweight execution unit within a process that shares memory and resources with other peer threads.',
        score: 85,
      },
    ],
  });

  console.log('\n══════════════════════════════════════');
  console.log('  🎉 Database seeded successfully!');
  console.log('══════════════════════════════════════');
  console.log('  Demo Account: demo@example.com | Demo@1234\n');

  return user;
}

// If executed directly:
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const { connectDB } = await import('../config/database.js');
  await connectDB();
  await seed(true);
  await mongoose.connection.close();
  process.exit(0);
}
