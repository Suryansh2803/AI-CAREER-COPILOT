import { analyzeJobMatch as analyzeJobDescription } from '../../shared/jobMatchAnalysis.js';

/** Compare the job requirements with skills and project details on the user's profile. */
export async function analyzeJobMatch(jobDescription, userProfile = {}) {
  return analyzeJobDescription(jobDescription, userProfile?.onboardingData || userProfile);
}
