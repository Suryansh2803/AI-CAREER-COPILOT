/**
 * AI Service — Daily Planner
 */

const DEMO_MODE = !process.env.OPENAI_API_KEY;

const taskTemplates = {
  1: [
    { title: 'Solve 2 DSA problems (Arrays/Strings)', category: 'DSA', duration: '30 min', xpReward: 15 },
    { title: 'Read 1 chapter of system design primer', category: 'CS Fundamentals', duration: '30 min', xpReward: 10 },
  ],
  2: [
    { title: 'Solve 3 DSA problems (Trees/Graphs)', category: 'DSA', duration: '45 min', xpReward: 20 },
    { title: 'Study DBMS normalization concepts', category: 'CS Fundamentals', duration: '30 min', xpReward: 10 },
    { title: 'Build a small Express.js route', category: 'Backend', duration: '30 min', xpReward: 15 },
    { title: 'Review and revise yesterday\'s topics', category: 'Revision', duration: '15 min', xpReward: 5 },
  ],
  3: [
    { title: 'Solve 4 DSA problems (DP/Greedy)', category: 'DSA', duration: '1 hour', xpReward: 25 },
    { title: 'Study OS concepts: processes and threads', category: 'CS Fundamentals', duration: '45 min', xpReward: 15 },
    { title: 'Build REST API endpoints', category: 'Backend', duration: '45 min', xpReward: 20 },
    { title: 'Review weak areas from this week', category: 'Revision', duration: '30 min', xpReward: 10 },
  ],
  4: [
    { title: 'Solve 5 DSA problems (Mixed difficulty)', category: 'DSA', duration: '1.5 hours', xpReward: 30 },
    { title: 'Study networking: TCP/IP, HTTP, DNS', category: 'CS Fundamentals', duration: '45 min', xpReward: 15 },
    { title: 'Work on backend project feature', category: 'Backend', duration: '1 hour', xpReward: 25 },
    { title: 'Practice mock interview question', category: 'Interview', duration: '30 min', xpReward: 15 },
    { title: 'Revise all topics from the week', category: 'Revision', duration: '15 min', xpReward: 5 },
  ],
};

export async function generateDailyPlan(availableHours, _userProfile) {
  if (DEMO_MODE) return mockDailyPlan(availableHours);
  return mockDailyPlan(availableHours);
}

function mockDailyPlan(hours) {
  const key = Math.min(4, Math.max(1, hours));
  const tasks = taskTemplates[key] || taskTemplates[2];
  return tasks.map((t) => ({ ...t, completed: false }));
}
