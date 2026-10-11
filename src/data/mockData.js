/**
 * AI Career Copilot — Centralized Mock Data
 * Single source of truth for all pages during development.
 * Replace individual endpoints gradually with real API calls.
 */

// ─── User Profile ────────────────────────────────────────────
export const mockUser = {
  id: 'u_001',
  name: 'Suryansh Pandey',
  email: 'suryansh@example.com',
  avatar: null,
  plan: 'Pro',
  targetRole: 'Software Development Engineer',
  targetCompany: 'Google / Amazon / Microsoft',
  graduationYear: 2025,
  college: 'NIT Allahabad',
  branch: 'Computer Science',
  streakDays: 12,
  joinedAt: '2024-08-15',
}

// ─── Career Readiness ────────────────────────────────────────
export const mockReadiness = {
  score: 78,
  maxScore: 100,
  trend: '+6 this month',
  trendValue: 6,
  status: 'On Track',
  placementProbability: 84,
  topPercentile: 18,
  sprintDay: 18,
  sprintTotal: 30,
  targetScore: 90,
}

// ─── Skill Dimensions ────────────────────────────────────────
export const mockSkills = [
  {
    id: 'dsa',
    name: 'DSA',
    score: 85,
    maxScore: 100,
    category: 'Technical',
    description: 'Arrays, Trees, DP, Graphs',
    color: 'blue',
    trend: '+8',
    lastActivity: '2h ago',
  },
  {
    id: 'development',
    name: 'Development',
    score: 78,
    maxScore: 100,
    category: 'Technical',
    description: 'React, Node.js, REST APIs',
    color: 'indigo',
    trend: '+5',
    lastActivity: '1d ago',
  },
  {
    id: 'projects',
    name: 'Projects',
    score: 72,
    maxScore: 100,
    category: 'Portfolio',
    description: '2 production repos',
    color: 'purple',
    trend: '+3',
    lastActivity: '3d ago',
  },
  {
    id: 'cs-fundamentals',
    name: 'CS Fundamentals',
    score: 64,
    maxScore: 100,
    category: 'Technical',
    description: 'OS, DBMS, CN',
    color: 'amber',
    trend: '+12',
    lastActivity: '5h ago',
  },
  {
    id: 'resume',
    name: 'Resume',
    score: 70,
    maxScore: 100,
    category: 'Profile',
    description: 'ATS score: 70/100',
    color: 'teal',
    trend: '+4',
    lastActivity: '1d ago',
  },
  {
    id: 'communication',
    name: 'Communication',
    score: 68,
    maxScore: 100,
    category: 'Soft Skills',
    description: 'STAR method, Behavioral',
    color: 'cyan',
    trend: '+2',
    lastActivity: '2d ago',
  },
]

// Radar chart axes (subset of skills)
export const mockRadarAxes = [
  { label: 'DSA',        value: 85, fullMark: 100 },
  { label: 'Dev',        value: 78, fullMark: 100 },
  { label: 'Projects',   value: 72, fullMark: 100 },
  { label: 'CS Found.',  value: 64, fullMark: 100 },
  { label: 'Resume',     value: 70, fullMark: 100 },
  { label: 'Comms',      value: 68, fullMark: 100 },
]

// ─── Career Gaps ─────────────────────────────────────────────
export const mockCareerGaps = [
  {
    id: 'gap_001',
    name: 'Backend Development',
    priority: 'Critical',
    priorityLevel: 3,
    impact: '+8 readiness pts',
    timeToFix: '2 weeks',
    description:
      'Missing production Node.js microservices experience. Redis caching, JWT auth flows, and RESTful API architecture are frequently tested at target companies.',
  },
  {
    id: 'gap_002',
    name: 'System Design',
    priority: 'High',
    priorityLevel: 2,
    impact: '+6 readiness pts',
    timeToFix: '3 weeks',
    description:
      'Needs understanding of load balancers, database sharding, and CAP theorem. System design rounds are present in all FAANG SDE interviews.',
  },
  {
    id: 'gap_003',
    name: 'Advanced SQL',
    priority: 'Medium',
    priorityLevel: 1,
    impact: '+3 readiness pts',
    timeToFix: '1 week',
    description:
      'Window functions, query optimization, and indexing strategies are tested in technical rounds at data-intensive companies.',
  },
]

// ─── Next Best Action ─────────────────────────────────────────
export const mockNextAction = {
  title: 'Build a REST API with Node.js',
  description:
    'Implement structured CRUD endpoints using Express, integrate JWT authentication middleware, and connect MongoDB. This directly addresses your #1 critical career gap.',
  category: 'Backend Development',
  estimatedMinutes: 90,
  readinessImpact: 4.5,
  roadmapPhase: 'Week 3 — APIs & Backend',
}

// ─── Roadmap ──────────────────────────────────────────────────
export const mockRoadmap = {
  title: '90-Day Placement Sprint',
  totalDays: 90,
  currentDay: 18,
  completionPercent: 60,
  phases: [
    {
      id: 'p1',
      label: 'Foundation',
      status: 'completed',
      weeks: '1–2',
      skills: ['Arrays & Strings', 'Linked Lists', 'Basic SQL'],
    },
    {
      id: 'p2',
      label: 'Core CS',
      status: 'completed',
      weeks: '3–4',
      skills: ['DBMS', 'OS Concepts', 'Binary Trees'],
    },
    {
      id: 'p3',
      label: 'APIs',
      status: 'active',
      weeks: '5–6',
      skills: ['REST APIs', 'Node.js', 'Auth & JWT'],
    },
    {
      id: 'p4',
      label: 'System Design',
      status: 'upcoming',
      weeks: '7–9',
      skills: ['Scalability', 'Caching', 'CAP Theorem'],
    },
  ],
}

// ─── Job Matches ──────────────────────────────────────────────
export const mockJobMatches = [
  {
    id: 'j_001',
    role: 'SDE Intern',
    company: 'Amazon',
    companyLogo: null,
    matchScore: 84,
    location: 'Bangalore, IN',
    type: 'Internship',
    ctc: '₹60K/mo',
    postedDays: 2,
    matchedSkills: ['DSA', 'C++', 'SQL', 'OOP'],
    missingSkills: ['AWS', 'System Design'],
    deadline: '2025-03-15',
  },
  {
    id: 'j_002',
    role: 'Frontend Engineer',
    company: 'Razorpay',
    companyLogo: null,
    matchScore: 79,
    location: 'Bangalore, IN',
    type: 'Full-time',
    ctc: '₹18–24 LPA',
    postedDays: 5,
    matchedSkills: ['React', 'TypeScript', 'CSS'],
    missingSkills: ['Redux', 'Testing'],
    deadline: '2025-03-20',
  },
  {
    id: 'j_003',
    role: 'Backend Engineer',
    company: 'Flipkart',
    companyLogo: null,
    matchScore: 71,
    location: 'Bangalore, IN',
    type: 'Full-time',
    ctc: '₹16–22 LPA',
    postedDays: 8,
    matchedSkills: ['Java', 'SQL', 'DSA'],
    missingSkills: ['Kafka', 'Microservices', 'Redis'],
    deadline: '2025-03-28',
  },
]

// ─── Recent Activity ──────────────────────────────────────────
export const mockActivity = [
  {
    id: 'a_001',
    type: 'dsa',
    title: 'Solved 3 DSA problems',
    detail: 'Dynamic Programming & Binary Tree inversions',
    time: '2h ago',
    xp: 45,
  },
  {
    id: 'a_002',
    type: 'module',
    title: 'Completed DBMS module',
    detail: 'ACID Transactions & B+ Tree Indexing',
    time: '5h ago',
    xp: 60,
  },
  {
    id: 'a_003',
    type: 'resume',
    title: 'Updated resume',
    detail: 'Added Distributed Task Queue project with metrics',
    time: 'Yesterday',
    xp: 20,
  },
  {
    id: 'a_004',
    type: 'interview',
    title: 'Completed mock interview',
    detail: 'SDE Technical Round — 82% performance score',
    time: '2d ago',
    xp: 80,
  },
]

// ─── Notifications ────────────────────────────────────────────
export const mockNotifications = [
  {
    id: 'n_001',
    title: 'Resume score improved',
    body: 'Your ATS score jumped from 66 to 70 — well done.',
    time: '2m ago',
    unread: true,
    type: 'success',
  },
  {
    id: 'n_002',
    title: 'New job matches',
    body: '5 new positions matched your profile this week.',
    time: '1h ago',
    unread: true,
    type: 'info',
  },
  {
    id: 'n_003',
    title: 'Mock interview reminder',
    body: 'Your scheduled session starts in 30 minutes.',
    time: '3h ago',
    unread: false,
    type: 'warning',
  },
]

// ─── Career Twin ─────────────────────────────────────────────
export const mockCareerTwin = {
  readinessScore: 78,
  targetRole: 'Software Development Engineer',
  targetCompany: 'Google / Amazon',
  jobMatchScore: 84,
  strengths: [
    { skill: 'DSA', score: 85, note: 'Strong problem-solving skills' },
    { skill: 'Problem Solving', score: 82, note: 'Logical, pattern-aware' },
    { skill: 'Frontend Dev', score: 78, note: 'Solid project experience' },
  ],
  weaknesses: [
    { skill: 'Backend Dev', score: 42, note: 'API & server-side gaps' },
    { skill: 'System Design', score: 35, note: 'Architecture knowledge low' },
    { skill: 'Advanced SQL', score: 55, note: 'Optimization & indexing' },
  ],
  radarData: mockRadarAxes,
}

// ─── What-If Simulator Skills ─────────────────────────────────
export const simulatorSkillOptions = [
  { id: 'nodejs',        label: 'Node.js / Express',    impact: 5.2, category: 'Backend'  },
  { id: 'system-design', label: 'System Design',        impact: 6.8, category: 'Architecture' },
  { id: 'aws',           label: 'AWS Fundamentals',     impact: 3.4, category: 'Cloud'    },
  { id: 'redis',         label: 'Redis / Caching',      impact: 2.1, category: 'Backend'  },
  { id: 'docker',        label: 'Docker / Containers',  impact: 2.8, category: 'DevOps'   },
  { id: 'sql-adv',       label: 'Advanced SQL',         impact: 3.0, category: 'Database' },
  { id: 'graphql',       label: 'GraphQL',              impact: 1.8, category: 'API'      },
  { id: 'testing',       label: 'Unit & E2E Testing',   impact: 2.5, category: 'Quality'  },
  { id: 'typescript',    label: 'TypeScript Advanced',  impact: 2.0, category: 'Frontend' },
  { id: 'kafka',         label: 'Kafka / Message Queue',impact: 3.5, category: 'Backend'  },
]

// ─── Mock Interview ───────────────────────────────────────────
export const mockInterviewQuestions = [
  {
    id: 'q_001',
    category: 'DSA',
    difficulty: 'Medium',
    question: 'Explain the difference between a process and a thread.',
    expectedPoints: ['Memory space', 'Context switching', 'Scheduling', 'Communication'],
    timeLimit: 120,
  },
  {
    id: 'q_002',
    category: 'System Design',
    difficulty: 'Hard',
    question: 'Design a URL shortener like bit.ly. Walk through your architecture.',
    expectedPoints: ['Hash function', 'Database schema', 'Caching', 'Scalability', 'Analytics'],
    timeLimit: 300,
  },
  {
    id: 'q_003',
    category: 'DSA',
    difficulty: 'Easy',
    question: 'What is a hash map and what is its average time complexity for lookup?',
    expectedPoints: ['Key-value pairs', 'O(1) average', 'Hash collision', 'Open addressing'],
    timeLimit: 90,
  },
]

// ─── Progress Analytics ───────────────────────────────────────
export const mockProgressData = {
  totalXP: 2840,
  weeklyXP: [120, 95, 160, 200, 180, 240, 190],
  weeklyLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  monthlyScores: [
    { month: 'Aug', score: 58 },
    { month: 'Sep', score: 65 },
    { month: 'Oct', score: 72 },
    { month: 'Nov', score: 78 },
  ],
  completedModules: 14,
  totalModules: 24,
  dsaProblems: { solved: 87, total: 150 },
  mockInterviews: { completed: 5, avgScore: 76 },
  resumeScore: 70,
  streakDays: 12,
  longestStreak: 18,
}

// ─── AI Mentor Messages ───────────────────────────────────────
export const mockMentorHistory = [
  {
    id: 'm_001',
    role: 'assistant',
    content:
      "Hi Suryansh! I'm your AI Career Mentor. I've analyzed your profile and Career Twin data. Your DSA is solid — let's focus on backend gaps next. What would you like to work on today?",
    time: '10:30 AM',
  },
  {
    id: 'm_002',
    role: 'user',
    content: 'What should I focus on for SDE interviews at Amazon?',
    time: '10:31 AM',
  },
  {
    id: 'm_003',
    role: 'assistant',
    content:
      "For Amazon SDE, focus on: **1) Leadership Principles** — every behavioral question maps to one. **2) DSA depth** — arrays, trees, dynamic programming are most common. **3) System design basics** — they test scalability thinking even for junior roles. Your current DSA at 85 is great. I'd prioritize System Design next given your 35/100 score there.",
    time: '10:31 AM',
  },
]

// ─── Resume Analysis ──────────────────────────────────────────
export const mockResumeAnalysis = {
  atsScore: 70,
  keywordMatch: 68,
  formatScore: 85,
  impactScore: 60,
  strengths: [
    'Strong project descriptions with quantified metrics',
    'Relevant technical skills section',
    'Clean single-page format',
  ],
  improvements: [
    { issue: 'Missing action verbs in 3 bullet points', priority: 'High' },
    { issue: 'Add more backend-relevant keywords (Node.js, Redis)', priority: 'High' },
    { issue: 'Internship section lacks measurable outcomes', priority: 'Medium' },
    { issue: 'LinkedIn URL not included', priority: 'Low' },
  ],
}

// ─── Daily Planner ────────────────────────────────────────────
export const mockTodayPlan = {
  date: new Date().toISOString().split('T')[0],
  totalTasks: 5,
  completedTasks: 2,
  xpToday: 95,
  tasks: [
    { id: 't_001', title: 'Solve 2 LeetCode Medium — Trees', duration: 60, status: 'completed', xp: 30, category: 'DSA' },
    { id: 't_002', title: 'Read DBMS: Indexing chapter', duration: 45, status: 'completed', xp: 25, category: 'CS Fundamentals' },
    { id: 't_003', title: 'Build REST API — CRUD + Auth', duration: 90, status: 'active', xp: 60, category: 'Backend' },
    { id: 't_004', title: 'Mock interview — OS concepts', duration: 30, status: 'upcoming', xp: 40, category: 'Interview Prep' },
    { id: 't_005', title: 'Update resume project section', duration: 20, status: 'upcoming', xp: 15, category: 'Resume' },
  ],
}
