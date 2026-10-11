/**
 * API Client — Centralized HTTP client for the backend
 *
 * All API calls go through this module. It automatically
 * attaches the JWT token and handles common error patterns.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    // Demo sessions use a local-only placeholder token, never a server JWT.
    if (localStorage.getItem('acc_demo_mode') === 'true') return null;
    return localStorage.getItem('acc_token');
  }

  setToken(token) {
    localStorage.setItem('acc_token', token);
  }

  clearToken() {
    localStorage.removeItem('acc_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Auto-logout on 401
        if (response.status === 401 && localStorage.getItem('acc_demo_mode') !== 'true') {
          this.clearToken();
          localStorage.removeItem('acc_user');
          // Only redirect if we're not already on auth pages
          if (!window.location.pathname.match(/^\/(login|register|onboarding)?$/)) {
            window.location.href = '/login';
          }
        }

        throw new ApiError(
          data.error || 'Something went wrong',
          response.status,
          data.details
        );
      }

      return data;
    } catch (err) {
      if (err instanceof ApiError) throw err;

      // Network error — backend unreachable
      throw new ApiError(
        'Unable to connect to server. Please check your connection.',
        0,
        null
      );
    }
  }

  // ─── Convenience Methods ───

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Singleton
const api = new ApiClient();

// ════════════════════════════════════════════════
//  AUTH API
// ════════════════════════════════════════════════

export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  logout: () =>
    api.post('/auth/logout'),

  getMe: () =>
    api.get('/auth/me'),

  completeOnboarding: (data) =>
    api.put('/auth/onboarding', data),
};

// ════════════════════════════════════════════════
//  PROFILE API
// ════════════════════════════════════════════════

export const profileAPI = {
  get: () =>
    api.get('/profile'),

  update: (data) =>
    api.put('/profile', data),
};

// ════════════════════════════════════════════════
//  SKILLS API
// ════════════════════════════════════════════════

export const skillsAPI = {
  getAll: () =>
    api.get('/skills'),

  add: (skill) =>
    api.post('/skills', skill),

  update: (id, data) =>
    api.put(`/skills/${id}`, data),

  getGaps: () =>
    api.get('/skills/gaps'),
};

// ════════════════════════════════════════════════
//  CAREER API
// ════════════════════════════════════════════════

export const careerAPI = {
  getAssessment: () =>
    api.get('/career/assessment'),

  refresh: () =>
    api.post('/career/refresh'),

  simulate: (currentScore, selectedActions) =>
    api.post('/career/simulate', { currentScore, selectedActions }),

  getSkillGaps: (targetRole) =>
    api.post('/career/skill-gaps', { targetRole }),
};

// ════════════════════════════════════════════════
//  RESUME API
// ════════════════════════════════════════════════

export const resumeAPI = {
  analyze: (resumeText, fileName, fileSize) =>
    api.post('/resume/analyze', { resumeText, fileName, fileSize }),

  getHistory: () =>
    api.get('/resume/history'),

  getAnalysis: (id) =>
    api.get(`/resume/${id}`),
};

// ════════════════════════════════════════════════
//  ROADMAP API
// ════════════════════════════════════════════════

export const roadmapAPI = {
  get: () =>
    api.get('/roadmap'),

  generate: (targetRole, skillGaps) =>
    api.post('/roadmap/generate', { targetRole, skillGaps }),

  updateTask: (roadmapId, weekIndex, taskIndex, status) =>
    api.put(`/roadmap/${roadmapId}/task/${weekIndex}/${taskIndex}`, { status }),

  getHistory: () =>
    api.get('/roadmap/history'),
};

// ════════════════════════════════════════════════
//  JOB MATCH API
// ════════════════════════════════════════════════

export const jobAPI = {
  analyze: (jobDescription) =>
    api.post('/jobs/analyze', { jobDescription }),

  getHistory: () =>
    api.get('/jobs/history'),

  getAnalysis: (id) =>
    api.get(`/jobs/${id}`),
};

// ════════════════════════════════════════════════
//  INTERVIEW API
// ════════════════════════════════════════════════

export const interviewAPI = {
  start: (role, type, difficulty, count = 10) =>
    api.post('/interview/start', { role, type, difficulty, count }),

  submitAnswer: (interviewId, questionIndex, answer) =>
    api.post(`/interview/${interviewId}/answer`, { questionIndex, answer }),

  complete: (interviewId) =>
    api.post(`/interview/${interviewId}/complete`),

  getHistory: () =>
    api.get('/interview/history'),
};

// ════════════════════════════════════════════════
//  MENTOR API
// ════════════════════════════════════════════════

export const mentorAPI = {
  chat: (message) =>
    api.post('/mentor/chat', { message }),

  getSuggestions: () =>
    api.get('/mentor/suggestions'),
};

// ════════════════════════════════════════════════
//  PLANNER API
// ════════════════════════════════════════════════

export const plannerAPI = {
  getToday: () =>
    api.get('/planner/today'),

  generate: (availableHours) =>
    api.post('/planner/generate', { availableHours }),

  toggleTask: (taskIndex) =>
    api.put(`/planner/task/${taskIndex}`),
};

// ════════════════════════════════════════════════
//  PROGRESS API
// ════════════════════════════════════════════════

export const progressAPI = {
  get: () =>
    api.get('/progress'),

  addXP: (amount, source) =>
    api.post('/progress/xp', { amount, source }),

  updateStreak: () =>
    api.post('/progress/streak'),

  getBadges: () =>
    api.get('/progress/badges'),
};

export default api;
