/**
 * AI Service — Roadmap Generator
 */

const DEMO_MODE = !process.env.OPENAI_API_KEY;

export async function generateRoadmap(targetRole, skillGaps, _userProfile) {
  if (DEMO_MODE) return mockRoadmap(targetRole, skillGaps);
  return mockRoadmap(targetRole, skillGaps);
}

function mockRoadmap(_targetRole, _gaps) {
  return {
    title: '30-Day Career Roadmap',
    targetRole: 'Software Development Engineer',
    duration: 30,
    weeks: [
      {
        weekNumber: 1,
        title: 'Node.js Fundamentals',
        tasks: [
          { title: 'Install Node.js & setup environment', estimatedTime: '1 hour', difficulty: 'Easy', status: 'pending' },
          { title: 'Learn modules, file system, and events', estimatedTime: '3 hours', difficulty: 'Easy', status: 'pending' },
          { title: 'Async programming: callbacks, promises, async/await', estimatedTime: '4 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Build a CLI tool using Node.js', estimatedTime: '3 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'NPM deep-dive: packages, scripts, versioning', estimatedTime: '2 hours', difficulty: 'Easy', status: 'pending' },
        ],
      },
      {
        weekNumber: 2,
        title: 'Express + REST APIs',
        tasks: [
          { title: 'Express.js setup and routing basics', estimatedTime: '2 hours', difficulty: 'Easy', status: 'pending' },
          { title: 'Middleware, error handling, and validation', estimatedTime: '3 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Build a full CRUD REST API', estimatedTime: '4 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Authentication with JWT', estimatedTime: '3 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'API testing with Postman/Thunder Client', estimatedTime: '2 hours', difficulty: 'Easy', status: 'pending' },
        ],
      },
      {
        weekNumber: 3,
        title: 'MongoDB + Authentication',
        tasks: [
          { title: 'MongoDB basics: collections, documents, queries', estimatedTime: '3 hours', difficulty: 'Easy', status: 'pending' },
          { title: 'Mongoose ODM: schemas, models, validation', estimatedTime: '3 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Implement user registration and login', estimatedTime: '4 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Password hashing and JWT middleware', estimatedTime: '3 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Role-based access control', estimatedTime: '2 hours', difficulty: 'Hard', status: 'pending' },
        ],
      },
      {
        weekNumber: 4,
        title: 'Full-Stack Backend Project',
        tasks: [
          { title: 'Design database schema for project', estimatedTime: '2 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Implement all API endpoints', estimatedTime: '5 hours', difficulty: 'Hard', status: 'pending' },
          { title: 'Add error handling and input validation', estimatedTime: '3 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Connect React frontend to backend API', estimatedTime: '4 hours', difficulty: 'Medium', status: 'pending' },
          { title: 'Deploy to Vercel/Railway and write README', estimatedTime: '3 hours', difficulty: 'Medium', status: 'pending' },
        ],
      },
    ],
  };
}
