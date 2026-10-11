import {
  evaluateInterviewAnswer,
  getInterviewQuestionSet,
  summarizeInterview,
} from '../../shared/interviewEngine.js';

export function getInterviewQuestions(type, difficulty, count = 10, role = 'SDE') {
  return getInterviewQuestionSet(role, type, difficulty, count);
}

export async function evaluateAnswer(question, answer) {
  return evaluateInterviewAnswer(question, answer);
}

export async function generateInterviewFeedback(interviewQuestions) {
  return summarizeInterview(interviewQuestions);
}
