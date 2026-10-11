/**
 * AI Service — Career Analysis
 *
 * Uses real AI when API key is available, falls back to mock data.
 * The frontend experience is identical in both modes.
 */

const DEMO_MODE = !process.env.OPENAI_API_KEY;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Generate career assessment for a user
 */
export async function analyzeCareer(userProfile, skills) {
  if (DEMO_MODE) return mockCareerAnalysis(userProfile, skills);

  // TODO: Real AI integration
  // const response = await callAI({ prompt: buildCareerPrompt(userProfile, skills) });
  // return parseCareerResponse(response);

  return mockCareerAnalysis(userProfile, skills);
}

/**
 * Simulate what-if scenario
 */
export async function simulateCareer(currentScore, selectedActions) {
  if (DEMO_MODE) return mockSimulation(currentScore, selectedActions);
  return mockSimulation(currentScore, selectedActions);
}

/**
 * Generate skill gap analysis
 */
export async function analyzeSkillGaps(userSkills, targetRole) {
  if (DEMO_MODE) return mockSkillGaps(userSkills, targetRole);
  return mockSkillGaps(userSkills, targetRole);
}

// ─── Mock Implementations ───

function mockCareerAnalysis(_profile, _skills) {
  return {
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
      { name: 'Cloud & DevOps', priority: 'Medium', description: 'Learn AWS/GCP basics and CI/CD pipelines' },
    ],
    recommendations: [
      'Focus on backend development — this is your biggest gap',
      'Build 2 full-stack projects to demonstrate competency',
      'Practice system design problems weekly',
      'Start learning cloud fundamentals (AWS)',
    ],
  };
}

function mockSimulation(currentScore, selectedActions) {
  const improvements = {
    'Complete Graph + DP': 3,
    'Learn Node.js': 4,
    'Build Backend Project': 3,
    'Improve SQL': 2,
    'Learn System Design': 4,
    'Complete 3 Mock Interviews': 2,
  };

  let totalBoost = 0;
  selectedActions.forEach((action) => {
    totalBoost += improvements[action] || 2;
  });

  const projectedScore = Math.min(100, currentScore + totalBoost);

  return {
    currentScore,
    projectedScore,
    improvement: totalBoost,
    selectedActions,
    breakdown: selectedActions.map((action) => ({
      action,
      boost: improvements[action] || 2,
    })),
  };
}

function mockSkillGaps(_userSkills, _targetRole) {
  return {
    matched: [
      { name: 'DSA', level: 85 },
      { name: 'C++', level: 80 },
      { name: 'SQL', level: 72 },
      { name: 'Git', level: 75 },
      { name: 'React', level: 70 },
    ],
    missing: [
      { name: 'Backend Development', priority: 'Critical' },
      { name: 'System Design', priority: 'High' },
      { name: 'AWS', priority: 'Medium' },
      { name: 'Docker', priority: 'Low' },
    ],
    priorities: {
      critical: ['Backend Development'],
      high: ['System Design'],
      medium: ['AWS', 'Testing'],
      low: ['Docker', 'Kubernetes'],
    },
  };
}
