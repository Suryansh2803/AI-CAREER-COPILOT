const ROLE_KEYWORDS = {
  backend: ['Node.js', 'REST API', 'SQL', 'MongoDB', 'authentication', 'testing', 'Docker', 'cloud', 'Git'],
  frontend: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'accessibility', 'testing', 'responsive design', 'Git'],
  data: ['Python', 'SQL', 'statistics', 'machine learning', 'data analysis', 'Pandas', 'visualization', 'experimentation'],
  general: ['communication', 'teamwork', 'problem solving', 'projects', 'Git', 'testing', 'API', 'database'],
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const contains = (text, phrase) => new RegExp(`\\b${escapeRegExp(phrase).replace(/\\ /g, '\\s+')}\\b`, 'i').test(text)
const clamp = (score) => Math.max(0, Math.min(100, Math.round(score)))

export function analyzeResumeText(source, targetRole = '') {
  const text = String(source || '').replace(/\s+/g, ' ').trim()
  const lower = text.toLowerCase()
  const role = String(targetRole || '').trim()
  const keywords = /backend|back-end|server|api|software engineer|sde/i.test(role)
    ? ROLE_KEYWORDS.backend
    : /frontend|front-end|ui|web developer/i.test(role)
      ? ROLE_KEYWORDS.frontend
      : /data|machine learning|analyst|ai/i.test(role)
        ? ROLE_KEYWORDS.data
        : ROLE_KEYWORDS.general
  const matched = keywords.filter((word) => contains(lower, word.toLowerCase()))
  const missing = keywords.filter((word) => !contains(lower, word.toLowerCase()))
  const email = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text)
  const links = /linkedin|github|portfolio|https?:\/\//i.test(text)
  const skills = /skills?|technologies|technical stack/i.test(text)
  const projects = /projects?/i.test(text)
  const experience = /experience|internship|employment|work history/i.test(text)
  const education = /education|university|college|bachelor|degree/i.test(text)
  const quantified = /\b\d+(?:\.\d+)?\s*(?:%|\+|x|users|requests|ms|seconds|minutes|hours|projects|students|records)\b/i.test(text)
  const actionVerb = /\b(built|created|developed|designed|implemented|led|improved|launched|automated|optimized|engineered|delivered|maintained)\b/i.test(text)
  const words = text.split(/\s+/).filter(Boolean)
  const sections = [education, skills, projects, experience].filter(Boolean).length

  const scores = {
    ats: clamp(42 + (email ? 10 : 0) + (links ? 7 : 0) + sections * 6 + (text.length > 400 ? 9 : 0)),
    skills: clamp(25 + Math.min(matched.length, 7) * 10 + (skills ? 5 : 0)),
    projects: clamp(22 + (projects ? 28 : 0) + (actionVerb ? 12 : 0) + (quantified ? 18 : 0) + (/(tech stack|built with|using)\b/i.test(text) ? 10 : 0)),
    experience: clamp(25 + (experience ? 35 : 0) + (actionVerb ? 15 : 0) + (quantified ? 15 : 0)),
    keywords: clamp(20 + Math.round((matched.length / Math.max(keywords.length, 1)) * 80)),
  }
  const atsScore = clamp(scores.ats * 0.25 + scores.skills * 0.2 + scores.projects * 0.2 + scores.experience * 0.15 + scores.keywords * 0.2)
  const strengths = []
  const weaknesses = []
  if (email) strengths.push('Contact email is present and readable')
  else weaknesses.push('Add a professional email address near your name')
  if (links) strengths.push('A professional profile or portfolio link is included')
  else weaknesses.push('Add relevant LinkedIn, GitHub, or portfolio links')
  if (skills) strengths.push('A dedicated skills section helps readers find your tools')
  else weaknesses.push('Add a clearly labeled technical skills section')
  if (projects) strengths.push('Projects are included as evidence of hands-on work')
  else weaknesses.push('Add relevant projects and describe your contribution')
  if (quantified) strengths.push('At least one measurable result appears in the resume')
  else weaknesses.push('Add truthful numbers to show the scale or outcome of your work')
  if (education) strengths.push('Education details are present')
  else weaknesses.push('Add your education and expected graduation details')
  if (!experience) weaknesses.push('If applicable, add internships, employment, or relevant experience')

  const lines = String(source || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const sentences = lines.flatMap((line) => line.split(/(?<=[.!?])\s+/)).filter((line) => line.length > 35 && line.length < 260)
  const bullet = lines.find((line) => /^(?:[-•*]|\d+[.)])\s*/.test(line) && line.length < 260)
    || sentences.find((line) => /\b(built|created|worked|made|helped|developed|implemented|designed|led)\b/i.test(line))
  const beforeAfter = bullet ? [{
    section: projects ? 'Projects' : 'Experience',
    before: bullet.slice(0, 220),
    after: `${bullet.replace(/^(?:[-•*]|\d+[.)])\s*/, '').replace(/\.$/, '')}. Add the specific tools you used and the verified result or scale of this work.`,
  }] : []

  const formattingIssues = []
  if (!/\b(?:summary|profile|objective)\b/i.test(text)) formattingIssues.push('No summary or profile heading was found in the extracted text.')
  if (words.length < 180) formattingIssues.push('The extracted resume is brief; confirm that all relevant details are included.')
  if (/(?:\b\w+\b\s*){35,}/.test(text)) formattingIssues.push('Some extracted text runs are long; review the PDF for dense paragraphs.')
  if (!formattingIssues.length) formattingIssues.push('No obvious text-level formatting concerns were detected. Visual layout is not evaluated.')

  const suggestions = [
    ...weaknesses.slice(0, 3),
    ...(missing.length ? [`For ${role || 'your target role'}, consider relevant terms only when they accurately describe your experience: ${missing.slice(0, 4).join(', ')}.`] : []),
  ]

  return {
    atsScore,
    scores,
    strengths,
    weaknesses,
    missingKeywords: missing,
    formattingIssues,
    projectQuality: { score: scores.projects, feedback: quantified ? ['Keep the measurable outcome clear and easy to verify.'] : ['Add a verified result or scope to project bullets; do not guess or invent metrics.'] },
    beforeAfter,
    suggestions,
    matchedKeywords: matched,
    checklist: [
      { label: 'Contact information', done: email },
      { label: 'Education details', done: education },
      { label: 'Technical skills', done: skills },
      { label: 'Projects or relevant experience', done: projects || experience },
      { label: 'Relevant role keywords', done: matched.length >= Math.ceil(keywords.length / 2) },
      { label: 'Quantified impact', done: quantified },
      { label: 'Professional profile links', done: links },
    ],
    analysisNote: `Content-based review${role ? ` for ${role}` : ''}. It checks extracted text and does not emulate a specific employer's ATS.`,
  }
}
