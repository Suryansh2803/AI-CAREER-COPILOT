const SKILLS = [
  { name: 'Data Structures & Algorithms', aliases: ['data structures and algorithms', 'data structures', 'algorithms', 'dsa'], group: 'Core Computer Science', priority: 'High' },
  { name: 'Problem Solving', aliases: ['problem solving', 'problem-solving'], group: 'Core Computer Science', priority: 'High' },
  { name: 'C++', aliases: ['c++', 'cpp'], group: 'Programming', priority: 'Medium' },
  { name: 'Java', aliases: ['java'], group: 'Programming', priority: 'Medium' },
  { name: 'Python', aliases: ['python'], group: 'Programming', priority: 'Medium' },
  { name: 'JavaScript', aliases: ['javascript', 'js'], group: 'Programming', priority: 'Medium' },
  { name: 'TypeScript', aliases: ['typescript'], group: 'Programming', priority: 'Medium' },
  { name: 'React', aliases: ['react', 'react.js', 'reactjs'], group: 'Web Development', priority: 'Medium' },
  { name: 'Node.js', aliases: ['node.js', 'nodejs', 'node'], group: 'Backend', priority: 'Medium' },
  { name: 'REST API', aliases: ['rest api', 'restful api', 'restful services'], group: 'Backend', priority: 'High' },
  { name: 'HTML/CSS', aliases: ['html', 'css'], group: 'Web Development', priority: 'Low' },
  { name: 'SQL', aliases: ['sql', 'relational database', 'relational databases'], group: 'Databases', priority: 'Medium' },
  { name: 'NoSQL', aliases: ['nosql', 'no-sql'], group: 'Databases', priority: 'Medium' },
  { name: 'MongoDB', aliases: ['mongodb', 'mongo db'], group: 'Databases', priority: 'Medium' },
  { name: 'PostgreSQL', aliases: ['postgresql', 'postgres'], group: 'Databases', priority: 'Medium' },
  { name: 'System Design', aliases: ['system design', 'distributed systems', 'distributed system'], group: 'Architecture', priority: 'High' },
  { name: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'], group: 'Cloud', priority: 'High' },
  { name: 'Docker', aliases: ['docker', 'containerization', 'containers'], group: 'Cloud & DevOps', priority: 'Medium' },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s'], group: 'Cloud & DevOps', priority: 'Low' },
  { name: 'CI/CD', aliases: ['ci/cd', 'continuous integration', 'continuous delivery'], group: 'Cloud & DevOps', priority: 'Low' },
  { name: 'Git', aliases: ['git', 'version control'], group: 'Tools', priority: 'Low' },
  { name: 'Linux', aliases: ['linux'], group: 'Tools', priority: 'Low' },
  { name: 'Communication', aliases: ['communication', 'communicate effectively'], group: 'Collaboration', priority: 'Low' },
  { name: 'Agile', aliases: ['agile', 'scrum'], group: 'Collaboration', priority: 'Low' },
  { name: 'Machine Learning', aliases: ['machine learning', 'deep learning'], group: 'Data & AI', priority: 'Medium' },
  { name: 'Data Analysis', aliases: ['data analysis', 'data analytics'], group: 'Data & AI', priority: 'Medium' },
]

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const hasTerm = (text, term) => {
  const escaped = escapeRegExp(term).replace(/\\ /g, '\\s+')
  const boundaryStart = /^[a-z0-9]/i.test(term) ? '(?<![a-z0-9])' : ''
  const boundaryEnd = /[a-z0-9]$/i.test(term) ? '(?![a-z0-9])' : ''
  return new RegExp(`${boundaryStart}${escaped}${boundaryEnd}`, 'i').test(text)
}
const normalizeList = (value) => Array.isArray(value) ? value.filter(Boolean).join(' ') : String(value || '')

export function analyzeJobMatch(jobDescription, candidate = {}) {
  const description = String(jobDescription || '').trim().slice(0, 5000)
  const profileText = [
    normalizeList(candidate.skills),
    normalizeList(candidate.dsaTopics),
    normalizeList(candidate.dsaLevel),
    normalizeList(candidate.dsaProblems),
    normalizeList(candidate.certifications),
    (candidate.projects || []).map((project) => [project?.name, project?.description, project?.techStack].filter(Boolean).join(' ')).join(' '),
  ].join(' ')
  const normalizedProfile = profileText.toLowerCase()
  const lines = description.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const title = (lines.find((line) => line.length > 3 && line.length < 110) || 'Job description').replace(/^job title\s*:\s*/i, '')
  const companies = ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Adobe', 'Atlassian', 'Flipkart', 'Uber', 'Deloitte', 'Accenture']
  const company = companies.find((name) => hasTerm(description, name)) || ''
  const optionalBoundary = description.search(/\b(preferred|nice to have|bonus points|optional|good to have)\b/i)
  const requested = SKILLS.filter((skill) => skill.aliases.some((term) => hasTerm(description, term))).map((skill) => {
    const firstIndex = Math.min(...skill.aliases.map((term) => {
      const i = description.toLowerCase().indexOf(term.toLowerCase())
      return i < 0 ? Number.POSITIVE_INFINITY : i
    }))
    const optional = optionalBoundary >= 0 && firstIndex >= optionalBoundary
    const present = skill.aliases.some((term) => hasTerm(normalizedProfile, term))
    return { ...skill, required: !optional, present }
  })
  const required = requested.filter((skill) => skill.required)
  const optional = requested.filter((skill) => !skill.required)
  const matchedSkills = required.filter((skill) => skill.present).map(({ name }) => name)
  const missingSkills = required.filter((skill) => !skill.present).map(({ name, group, priority }) => ({ name, group, priority }))
  const matchedOptionalSkills = optional.filter((skill) => skill.present).map(({ name }) => name)
  const missingOptionalSkills = optional.filter((skill) => !skill.present).map(({ name, group, priority }) => ({ name, group, priority }))
  const matchScore = required.length ? Math.round(matchedSkills.length / required.length * 100) : 0

  const guidance = {
    'Data Structures & Algorithms': 'Review the relevant data structures and practice problems similar to those mentioned in the posting.',
    'Problem Solving': 'Show your problem-solving approach through a project example or a concise technical explanation.',
    AWS: 'Build a small deployment using the specific AWS services named in the posting.',
    'System Design': 'Practice designing a small service and explain its data flow, scaling choices, and trade-offs.',
    Docker: 'Containerize one of your existing projects and document how to run it.',
    Kubernetes: 'Learn the core deployment and service concepts, then deploy a small containerized app.',
    'REST API': 'Build or document an API project that demonstrates the methods and data handling you know.',
    SQL: 'Practice joins, aggregation, and schema design with a small dataset.',
    Git: 'Describe a project workflow that shows branches, reviews, and version control clearly.',
  }
  const recommendations = missingSkills.slice(0, 5).map((skill) => ({
    skill: skill.name,
    title: `Build evidence in ${skill.name}`,
    description: guidance[skill.name] || `Review the ${skill.name} requirements in this posting and add a small project or concrete example if it fits your background.`,
    priority: skill.priority,
  }))
  const summary = !required.length
    ? 'No recognized technical skill requirements were found. Add a job description with its responsibilities and requirements for a useful comparison.'
    : !profileText.trim()
      ? `This posting mentions ${required.length} recognized skills. Add your skills and projects in your profile to see which requirements your background covers.`
      : `${matchedSkills.length} of ${required.length} recognized required skills appear in your saved profile. ${missingSkills.length ? `Review ${missingSkills.slice(0, 3).map((skill) => skill.name).join(', ')} if they match your experience.` : 'All recognized required skills appear in your saved profile.'}`

  return {
    matchScore,
    jobTitle: title.slice(0, 100),
    company,
    matchedSkills,
    missingSkills,
    matchedOptionalSkills,
    missingOptionalSkills,
    recommendations,
    skillComparison: requested.map(({ name, group, priority, required: isRequired, present }) => ({
      skill: name,
      group,
      required: isRequired ? 100 : 50,
      current: present ? 100 : 0,
      priority,
      isOptional: !isRequired,
    })),
    summary,
    requirementCount: required.length,
    optionalCount: optional.length,
    profileSkillCount: Array.isArray(candidate.skills) ? candidate.skills.length : 0,
  }
}
