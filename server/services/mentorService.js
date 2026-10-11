/**
 * AI Service — Career Mentor Chat
 */

const DEMO_MODE = !process.env.OPENAI_API_KEY;

const mentorResponses = {
  'what should i study today': {
    message: "Based on your career gaps, I'd recommend focusing on **Backend Development** today. Here's a suggested plan:\n\n1. **Node.js Fundamentals** (1 hour) — Learn about modules, async/await, and the event loop\n2. **Express.js Basics** (1 hour) — Set up a simple REST API with CRUD operations\n3. **Practice** (30 min) — Build a simple task manager API\n\nThis aligns with your goal of becoming an SDE and addresses your most critical skill gap.",
    type: 'study',
  },
  'am i ready for an sde internship': {
    message: "Let me assess your readiness:\n\n✅ **Strong Areas:**\n- DSA (85%) — Above the typical threshold\n- Frontend Development — Solid React knowledge\n- Problem Solving — Consistent practice\n\n⚠️ **Areas to Improve:**\n- Backend Development (40%) — Most companies expect full-stack capability\n- System Design — Basic understanding needed even for internships\n\n📊 **Overall Assessment:** You're about **75% ready**. I'd recommend 3-4 more weeks of focused backend learning before applying. Start applying to companies while you learn — the application process takes time!",
    type: 'assessment',
  },
  'what skill should i learn next': {
    message: "Based on your career analysis, here's my priority recommendation:\n\n🔴 **#1 Priority: Node.js & Express** (Backend Development)\n- This is your biggest skill gap\n- Required for 90% of SDE roles\n- Estimated time: 2-3 weeks of focused study\n\n🟡 **#2 Priority: System Design Basics**\n- Increasingly asked in interviews\n- Start with load balancing, caching, and database design\n\n🟢 **#3 Priority: Advanced DSA**\n- You're already strong, but Graph and DP need more practice\n\nShall I create a detailed roadmap for any of these?",
    type: 'recommendation',
  },
  default: {
    message: "That's a great question! Based on your current career profile with a readiness score of 78/100, here are my thoughts:\n\n1. Your strongest area is DSA — keep maintaining that edge\n2. Focus your energy on backend development — it's the fastest path to improving your score\n3. Consider building a full-stack project to demonstrate your abilities\n\nWould you like me to elaborate on any specific area? I can help with study plans, project ideas, or interview preparation.",
    type: 'general',
  },
};

export async function getMentorResponse(message, _userContext) {
  if (DEMO_MODE) return mockMentorResponse(message);
  return mockMentorResponse(message);
}

function mockMentorResponse(message) {
  const lower = message.toLowerCase().trim();

  for (const [key, response] of Object.entries(mentorResponses)) {
    if (key !== 'default' && lower.includes(key)) {
      return response;
    }
  }

  // Check for partial matches
  if (lower.includes('study') || lower.includes('learn today')) {
    return mentorResponses['what should i study today'];
  }
  if (lower.includes('ready') || lower.includes('internship') || lower.includes('job')) {
    return mentorResponses['am i ready for an sde internship'];
  }
  if (lower.includes('skill') || lower.includes('next') || lower.includes('improve')) {
    return mentorResponses['what skill should i learn next'];
  }
  if (lower.includes('resume')) {
    return {
      message: "Let me review your resume situation:\n\n📄 **Current Resume Score: 76/100**\n\n**Key Improvements Needed:**\n1. Add quantifiable metrics to your project descriptions\n2. Include a professional summary at the top\n3. Add missing keywords: REST API, CI/CD, Cloud Computing\n4. Link your GitHub profile and portfolio\n\nWould you like me to help you rewrite specific bullet points? Upload your resume in the Resume Analyzer for a detailed breakdown!",
      type: 'resume',
    };
  }
  if (lower.includes('project')) {
    return {
      message: "Here are some project ideas that would strengthen your profile:\n\n🚀 **High Impact Projects:**\n1. **Real-time Chat Application** — WebSockets, Node.js, MongoDB\n2. **E-commerce API** — REST API design, authentication, payment integration\n3. **Task Management System** — Full CRUD, user auth, real-time updates\n\n💡 **Pro Tips:**\n- Deploy on AWS/Vercel to show cloud experience\n- Write tests (Jest/Mocha) to show quality\n- Document with a good README\n\nWhich one interests you? I can help you plan it out!",
      type: 'project',
    };
  }

  return mentorResponses.default;
}
