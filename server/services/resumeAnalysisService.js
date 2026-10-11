import { analyzeResumeText } from '../../shared/resumeAnalysis.js';

/** Analyze the supplied resume text against the user's saved target role. */
export async function analyzeResume(resumeText, userProfile) {
  const targetRole = userProfile?.onboardingData?.targetRole
    || userProfile?.onboardingData?.careerGoal
    || '';
  return analyzeResumeText(resumeText, targetRole);
}
