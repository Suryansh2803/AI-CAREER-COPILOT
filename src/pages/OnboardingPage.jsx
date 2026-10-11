import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  GraduationCap,
  Target,
  Code2,
  Binary,
  FolderGit2,
  Award,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  UploadCloud,
  Sparkles,
  Bot,
  Zap,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  Compass,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

// ── Step Configurations ──────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Personal Info', subtitle: 'Academic & College Background', icon: User },
  { id: 2, title: 'Academic Score', subtitle: 'Grades & Academic Percentile', icon: GraduationCap },
  { id: 3, title: 'Career Goal', subtitle: 'Target Role, Company & Package', icon: Target },
  { id: 4, title: 'Tech Stack', subtitle: 'Languages, Frameworks & Cloud', icon: Code2 },
  { id: 5, title: 'DSA & Coding', subtitle: 'Problem Solving & Topics Covered', icon: Binary },
  { id: 6, title: 'Projects', subtitle: 'Key Repositories & Real-World Apps', icon: FolderGit2, skippable: true },
  { id: 7, title: 'Certifications', subtitle: 'Credentials & Verified Skills', icon: Award, skippable: true },
  { id: 8, title: 'Resume Upload', subtitle: 'Upload CV for AI Parsing', icon: FileText, skippable: true },
]

// ── Predefined Options ──────────────────────────────────────
const PREDEFINED_SKILLS = [
  'C++',
  'Java',
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'SQL',
  'MongoDB',
  'AWS',
  'Machine Learning',
]

const DSA_TOPICS = [
  'Arrays & Strings',
  'Linked Lists',
  'Trees & BST',
  'Graphs',
  'Dynamic Programming',
  'Recursion & Backtracking',
  'Stacks & Queues',
  'Sliding Window & Two Pointers',
  'Heaps & Tries',
  'Greedy Algorithms',
]

const DSA_LEVELS = [
  { value: 'Beginner', desc: 'Learning core fundamentals & basic syntax (<50 problems)' },
  { value: 'Intermediate', desc: 'Comfortable with Medium LeetCode & standard patterns (50-200 problems)' },
  { value: 'Advanced', desc: 'Solves LeetCode Hard & contest participants (200-450 problems)' },
  { value: 'Expert', desc: 'Ranked competitive programmer / Candidate Master / Guardian (450+ problems)' },
]

const DSA_PROBLEMS_TIERS = ['< 50', '50 – 150', '150 – 300', '300 – 500', '500+']

const TARGET_ROLES = [
  { value: 'Software Development Engineer (SDE)', label: 'Software Development Engineer (SDE)' },
  { value: 'Frontend Engineer', label: 'Frontend Engineer' },
  { value: 'Backend Engineer', label: 'Backend Engineer' },
  { value: 'Full Stack Engineer', label: 'Full Stack Engineer' },
  { value: 'AI / Machine Learning Engineer', label: 'AI / Machine Learning Engineer' },
  { value: 'Data Scientist / Analyst', label: 'Data Scientist / Analyst' },
  { value: 'Cloud & DevOps Engineer', label: 'Cloud & DevOps Engineer' },
  { value: 'Product Manager', label: 'Product Manager' },
]

const TARGET_PACKAGES = [
  { value: '6 – 10 LPA', label: 'Tier 3 / Entry: ₹6 – 10 LPA' },
  { value: '10 – 18 LPA', label: 'Tier 2 / Growth: ₹10 – 18 LPA' },
  { value: '18 – 30 LPA', label: 'Tier 1 / Product Unicorn: ₹18 – 30 LPA' },
  { value: '30 – 50 LPA', label: 'FAANG / Top Tier: ₹30 – 50 LPA' },
  { value: '50+ LPA / International', label: 'Elite Tier: ₹50+ LPA / Global' },
]

const COLLEGE_YEARS = [
  { value: '1st Year', label: '1st Year (Freshman)' },
  { value: '2nd Year', label: '2nd Year (Sophomore)' },
  { value: '3rd Year', label: '3rd Year (Junior)' },
  { value: '4th Year', label: '4th Year (Senior)' },
  { value: 'Graduate / Alumni', label: 'Recent Graduate / Alumni' },
]

const GRADUATION_YEARS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
  { value: '2029', label: '2029' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, saveOnboardingData, markOnboardingDone, getOnboardingData } = useAuth()

  // ── Form State ──────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [errors, setErrors] = useState({})
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: user?.name || '',
    college: '',
    branch: '',
    year: '3rd Year',
    graduationYear: '2026',

    // Step 2: Academic
    cgpa: '',
    tenthPercent: '',
    twelfthPercent: '',

    // Step 3: Career Goal
    targetRole: 'Software Development Engineer (SDE)',
    targetCompany: '',
    targetPackage: '18 – 30 LPA',

    // Step 4: Technical Skills
    skills: ['C++', 'Python', 'React', 'SQL'],

    // Step 5: DSA
    dsaProblems: '150 – 300',
    dsaTopics: ['Arrays & Strings', 'Trees & BST', 'Dynamic Programming'],
    dsaLevel: 'Intermediate',

    // Step 6: Projects
    projects: [
      {
        name: 'AI Code Reviewer',
        description: 'Automated pull-request code reviewer analyzing AST patterns with LLMs.',
        techStack: 'React, Node.js, OpenAI API, TailwindCSS',
        github: 'https://github.com/example/ai-code-reviewer',
        liveUrl: 'https://ai-code-reviewer.demo.app',
      },
    ],

    // Step 7: Certifications
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        year: '2025',
        credentialUrl: 'https://aws.amazon.com/verify/demo',
      },
    ],

    // Step 8: Resume
    resumeFileName: '',
    resumeFileSize: '',
  })

  // Hydrate from stored onboarding if present
  useEffect(() => {
    const saved = getOnboardingData()
    if (saved && Object.keys(saved).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...saved,
        name: saved.name || user?.name || prev.name,
      }))
    } else if (user?.name) {
      setFormData((prev) => ({ ...prev, name: user.name }))
    }
  }, [user, getOnboardingData])

  // ── Handlers ────────────────────────────────────────────────
  const updateField = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  // Skills toggle
  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill)
      const nextSkills = exists
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
      return { ...prev, skills: nextSkills }
    })
    if (errors.skills) setErrors((prev) => ({ ...prev, skills: null }))
  }

  const handleAddCustomSkill = (e) => {
    if (e) e.preventDefault()
    const trimmed = customSkillInput.trim()
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }))
      setCustomSkillInput('')
    }
  }

  // DSA Topics toggle
  const toggleDsaTopic = (topic) => {
    setFormData((prev) => {
      const exists = prev.dsaTopics.includes(topic)
      return {
        ...prev,
        dsaTopics: exists
          ? prev.dsaTopics.filter((t) => t !== topic)
          : [...prev.dsaTopics, topic],
      }
    })
  }

  // Project management
  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: '', description: '', techStack: '', github: '', liveUrl: '' },
      ],
    }))
  }

  const handleUpdateProject = (index, key, val) => {
    setFormData((prev) => {
      const updated = [...prev.projects]
      updated[index] = { ...updated[index], [key]: val }
      return { ...prev, projects: updated }
    })
  }

  const handleRemoveProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  // Certifications management
  const handleAddCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: '', issuer: '', year: '2025', credentialUrl: '' },
      ],
    }))
  }

  const handleUpdateCertification = (index, key, val) => {
    setFormData((prev) => {
      const updated = [...prev.certifications]
      updated[index] = { ...updated[index], [key]: val }
      return { ...prev, certifications: updated }
    })
  }

  const handleRemoveCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  // Simulated Resume Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
      updateField('resumeFileName', file.name)
      updateField('resumeFileSize', `${(file.size / (1024 * 1024)).toFixed(2)} MB`)
      // Simulate smooth upload progress
      setUploadProgress(10)
      const interval = setInterval(() => {
        setUploadProgress((p) => {
          if (p >= 100) {
            clearInterval(interval)
            return 100
          }
          return p + 20
        })
      }, 100)
    }
  }

  // ── Validation ──────────────────────────────────────────────
  const validateCurrentStep = () => {
    const stepErrors = {}
    if (currentStep === 1) {
      if (!formData.name?.trim()) stepErrors.name = 'Full name is required'
      if (!formData.college?.trim()) stepErrors.college = 'College/University name is required'
      if (!formData.branch?.trim()) stepErrors.branch = 'Degree branch / major is required'
      if (!formData.year) stepErrors.year = 'Current year is required'
      if (!formData.graduationYear) stepErrors.graduationYear = 'Graduation year is required'
    } else if (currentStep === 2) {
      if (!formData.cgpa?.trim()) {
        stepErrors.cgpa = 'CGPA is required'
      } else {
        const num = parseFloat(formData.cgpa)
        if (isNaN(num) || num < 0 || num > 10) {
          stepErrors.cgpa = 'CGPA must be between 0.0 and 10.0'
        }
      }
      if (!formData.tenthPercent?.trim()) {
        stepErrors.tenthPercent = '10th percentage is required'
      } else {
        const num = parseFloat(formData.tenthPercent)
        if (isNaN(num) || num < 0 || num > 100) {
          stepErrors.tenthPercent = 'Percentage must be between 0 and 100'
        }
      }
      if (!formData.twelfthPercent?.trim()) {
        stepErrors.twelfthPercent = '12th/Diploma percentage is required'
      } else {
        const num = parseFloat(formData.twelfthPercent)
        if (isNaN(num) || num < 0 || num > 100) {
          stepErrors.twelfthPercent = 'Percentage must be between 0 and 100'
        }
      }
    } else if (currentStep === 3) {
      if (!formData.targetRole?.trim()) stepErrors.targetRole = 'Target role is required'
      if (!formData.targetCompany?.trim()) stepErrors.targetCompany = 'Dream company is required'
    } else if (currentStep === 4) {
      if (formData.skills.length === 0) stepErrors.skills = 'Select at least one skill'
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  // ── Navigation ──────────────────────────────────────────────
  const handleNext = () => {
    if (!validateCurrentStep()) return

    // Save partial progress to localStorage
    saveOnboardingData(formData)

    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleComplete = () => {
    saveOnboardingData(formData)
    markOnboardingDone()
    setIsCompleted(true)
  }

  const handleFinishToDashboard = () => {
    navigate('/dashboard')
  }

  const progressPercent = Math.round((currentStep / STEPS.length) * 100)
  const currentStepConfig = STEPS[currentStep - 1]

  // ── FINAL SCREEN: Career Twin Ready ─────────────────────────
  if (isCompleted) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 sm:p-10 border-cyan-500/30 shadow-glow-cyan bg-card/95 backdrop-blur-xl relative overflow-hidden">
            {/* Background glowing ambient orbs */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center relative z-10">
              {/* Twin Avatar Orb */}
              <div className="relative inline-flex mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/50 p-1 flex items-center justify-center"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Bot size={42} className="text-white drop-shadow-md" />
                  </div>
                </motion.div>
                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center shadow">
                  <Check size={14} className="text-white stroke-[3]" />
                </div>
              </div>

              {/* Tag & Heading */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
                <Sparkles size={13} />
                Profile Synthesized & Calibrated
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Your Career Twin is ready.
              </h1>

              <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base mb-8">
                AI Career Copilot has compiled your academic record,{' '}
                <span className="text-cyan-400 font-semibold">{formData.skills.length} skills</span>, DSA readiness,
                and aspirations into an intelligent simulation twin tailored for{' '}
                <span className="text-purple-400 font-semibold">{formData.targetCompany || 'Top Tech Companies'}</span>.
              </p>

              {/* Digital Twin Snapshot Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
                <div className="p-4 rounded-xl bg-bg-secondary/70 border border-gray-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs uppercase tracking-wider text-gray-500 font-bold">Target Role</span>
                    <Compass size={15} className="text-cyan-400" />
                  </div>
                  <p className="text-sm font-bold text-white line-clamp-1">{formData.targetRole}</p>
                  <p className="text-xs text-gray-400 mt-1">{formData.targetPackage}</p>
                </div>

                <div className="p-4 rounded-xl bg-bg-secondary/70 border border-gray-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs uppercase tracking-wider text-gray-500 font-bold">Readiness Score</span>
                    <TrendingUp size={15} className="text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-extrabold text-emerald-400">78%</p>
                    <span className="text-2xs text-emerald-500 font-medium">+14% post-onboarding</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">High Placement Probability</p>
                </div>

                <div className="p-4 rounded-xl bg-bg-secondary/70 border border-gray-700/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs uppercase tracking-wider text-gray-500 font-bold">Adaptive Roadmap</span>
                    <Clock size={15} className="text-purple-400" />
                  </div>
                  <p className="text-sm font-bold text-white">90-Day Sprint</p>
                  <p className="text-xs text-gray-400 mt-1">Target: {formData.graduationYear} Batch</p>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinishToDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-glow-cyan hover:shadow-cyan-500/40 transition-all cursor-pointer"
              >
                <span>Generate My Career Twin</span>
                <ArrowRight size={18} />
              </motion.button>

              <p className="text-2xs text-gray-500 mt-4">
                Syncs with your personalized dashboard, AI Mock Interview suite & Resume Analyzer.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ── ONBOARDING WIZARD ───────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-center px-4 py-8 max-w-4xl mx-auto">
      {/* ── Top Progress Header ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-cyan-400 font-bold">Step {currentStep}</span>
            <span>of</span>
            <span className="text-white font-semibold">{STEPS.length}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-200 font-semibold">{currentStepConfig.title}</span>
          </div>
          <span className="text-cyan-400 font-mono font-bold text-xs">{progressPercent}% Completed</span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700/50">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full shadow-glow-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Step Icons Pill Bar (Desktop and Mobile) */}
        <div className="hidden sm:flex items-center justify-between mt-4 px-1">
          {STEPS.map((s) => {
            const isDone = s.id < currentStep
            const isCurrent = s.id === currentStep
            const Icon = s.icon
            return (
              <button
                key={s.id}
                type="button"
                disabled={s.id > currentStep}
                onClick={() => {
                  if (s.id < currentStep) setCurrentStep(s.id)
                }}
                className={`flex flex-col items-center group transition-all ${
                  s.id > currentStep ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isDone
                      ? 'bg-cyan-500 text-bg-primary shadow-glow-cyan'
                      : isCurrent
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                      : 'bg-bg-secondary border border-gray-700 text-gray-400 group-hover:border-gray-500'
                  }`}
                >
                  {isDone ? <Check size={14} className="stroke-[3]" /> : <Icon size={14} />}
                </div>
                <span
                  className={`text-2xs font-medium mt-1 transition-colors ${
                    isCurrent ? 'text-cyan-400 font-bold' : isDone ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {s.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Main Step Card ── */}
      <Card className="p-6 sm:p-8 bg-card/90 backdrop-blur-xl border-card-border shadow-2xl relative overflow-hidden">
        {/* Step Banner */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-gray-800/80 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            {(() => {
              const Icon = currentStepConfig.icon
              return <Icon size={22} />
            })()}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentStepConfig.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {currentStepConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* ════════════ STEP 1: PERSONAL INFORMATION ════════════ */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Suryansh Sharma"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    error={errors.name}
                  />

                  <Input
                    label="College / University Name"
                    placeholder="e.g. Indian Institute of Technology / NIT"
                    value={formData.college}
                    onChange={(e) => updateField('college', e.target.value)}
                    error={errors.college}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Branch / Degree Specialization"
                    placeholder="e.g. Computer Science, AI & DS, ECE"
                    value={formData.branch}
                    onChange={(e) => updateField('branch', e.target.value)}
                    error={errors.branch}
                  />

                  <Select
                    label="Current Year of Study"
                    options={COLLEGE_YEARS}
                    value={formData.year}
                    onChange={(e) => updateField('year', e.target.value)}
                    error={errors.year}
                  />

                  <Select
                    label="Expected Graduation Year"
                    options={GRADUATION_YEARS}
                    value={formData.graduationYear}
                    onChange={(e) => updateField('graduationYear', e.target.value)}
                    error={errors.graduationYear}
                  />
                </div>
              </div>
            )}

            {/* ════════════ STEP 2: ACADEMIC DETAILS ════════════ */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-gray-300 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Many top tier recruiters filter candidates through academic cutoffs (typically 7.0+ CGPA).
                    AI Career Copilot computes your placement eligibility thresholds accurately.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Current CGPA (Out of 10)"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="e.g. 8.65"
                    value={formData.cgpa}
                    onChange={(e) => updateField('cgpa', e.target.value)}
                    error={errors.cgpa}
                    hint="Scale of 10.0"
                  />

                  <Input
                    label="10th Board Marks (%)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="e.g. 92.4"
                    value={formData.tenthPercent}
                    onChange={(e) => updateField('tenthPercent', e.target.value)}
                    error={errors.tenthPercent}
                    hint="Secondary School %"
                  />

                  <Input
                    label="12th / Diploma Marks (%)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="e.g. 88.6"
                    value={formData.twelfthPercent}
                    onChange={(e) => updateField('twelfthPercent', e.target.value)}
                    error={errors.twelfthPercent}
                    hint="Higher Secondary %"
                  />
                </div>
              </div>
            )}

            {/* ════════════ STEP 3: CAREER GOALS ════════════ */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Target Career Role"
                    options={TARGET_ROLES}
                    value={formData.targetRole}
                    onChange={(e) => updateField('targetRole', e.target.value)}
                    error={errors.targetRole}
                  />

                  <Input
                    label="Dream Target Company"
                    placeholder="e.g. Google, Microsoft, Atlassian, Uber"
                    value={formData.targetCompany}
                    onChange={(e) => updateField('targetCompany', e.target.value)}
                    error={errors.targetCompany}
                    hint="Or specify target domain like High-Growth Fintech"
                  />
                </div>

                <Select
                  label="Target Compensation Package (CTC)"
                  options={TARGET_PACKAGES}
                  value={formData.targetPackage}
                  onChange={(e) => updateField('targetPackage', e.target.value)}
                />
              </div>
            )}

            {/* ════════════ STEP 4: TECHNICAL SKILLS ════════════ */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Core Technical Skills{' '}
                    <span className="text-xs text-gray-500 font-normal">
                      (Select all that apply)
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {PREDEFINED_SKILLS.map((skill) => {
                      const isSelected = formData.skills.includes(skill)
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                              : 'bg-bg-secondary/60 border-gray-700/60 text-gray-400 hover:text-gray-200 hover:border-gray-600'
                          }`}
                        >
                          <span>{skill}</span>
                          {isSelected ? (
                            <Check size={14} className="text-cyan-400 stroke-[3]" />
                          ) : (
                            <Plus size={14} className="text-gray-600" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {errors.skills && <p className="mt-2 text-xs text-red-400">{errors.skills}</p>}
                </div>

                {/* Custom Skill Input */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Add Other Specialized Technologies
                  </label>
                  <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Docker, TypeScript, Next.js, Kubernetes..."
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      className="input-base flex-1"
                    />
                    <Button type="submit" variant="secondary" size="md">
                      <Plus size={16} /> Add Skill
                    </Button>
                  </form>
                </div>

                {/* Selected Skills Chips */}
                {formData.skills.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-2">
                      Selected Skills ({formData.skills.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="hover:text-red-400 text-gray-400 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════════════ STEP 5: DSA PROFICIENCY ════════════ */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Problems Solved Tier */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total DSA Problems Solved (LeetCode / GFG / Codeforces)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {DSA_PROBLEMS_TIERS.map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => updateField('dsaProblems', tier)}
                        className={`p-2.5 rounded-xl border text-center text-sm font-bold transition-all ${
                          formData.dsaProblems === tier
                            ? 'bg-purple-600/25 border-purple-400 text-purple-300 shadow-glow-purple'
                            : 'bg-bg-secondary/60 border-gray-700/60 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current DSA Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Self-Assessed DSA Proficiency
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DSA_LEVELS.map((lvl) => (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => updateField('dsaLevel', lvl.value)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          formData.dsaLevel === lvl.value
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-glow-cyan'
                            : 'bg-bg-secondary/60 border-gray-700/60 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-sm mb-1">
                          <span className={formData.dsaLevel === lvl.value ? 'text-cyan-400' : 'text-gray-200'}>
                            {lvl.value}
                          </span>
                          {formData.dsaLevel === lvl.value && <Check size={14} className="text-cyan-400 stroke-[3]" />}
                        </div>
                        <p className="text-2xs text-gray-400">{lvl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topics Completed */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    DSA Topics Confidently Completed
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DSA_TOPICS.map((topic) => {
                      const active = formData.dsaTopics.includes(topic)
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleDsaTopic(topic)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            active
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-bg-secondary/50 border-gray-700/50 text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          {topic} {active ? '✓' : '+'}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════ STEP 6: PROJECTS ════════════ */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Add projects that reflect your hands-on development experience.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddProject}
                    className="text-xs flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Project
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-bg-secondary/50 border border-gray-700/60 relative space-y-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-cyan-400">Project #{idx + 1}</span>
                        {formData.projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(idx)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            title="Remove Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Project Name"
                          placeholder="e.g. Distributed Task Queue"
                          value={proj.name}
                          onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                        />
                        <Input
                          label="Tech Stack"
                          placeholder="e.g. Node.js, Redis, Docker, React"
                          value={proj.techStack}
                          onChange={(e) => handleUpdateProject(idx, 'techStack', e.target.value)}
                        />
                      </div>

                      <Textarea
                        label="Description & Key Impact"
                        rows={2}
                        placeholder="Explain what the project solves and key architectural decisions..."
                        value={proj.description}
                        onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="GitHub Repository Link"
                          placeholder="https://github.com/username/project"
                          value={proj.github}
                          onChange={(e) => handleUpdateProject(idx, 'github', e.target.value)}
                        />
                        <Input
                          label="Live Hosted URL (Optional)"
                          placeholder="https://myproject.vercel.app"
                          value={proj.liveUrl}
                          onChange={(e) => handleUpdateProject(idx, 'liveUrl', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════ STEP 7: CERTIFICATIONS ════════════ */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Include industry certifications (AWS, Meta, Google Cloud, Coursera, etc.)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCertification}
                    className="text-xs flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Certification
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-bg-secondary/50 border border-gray-700/60 relative space-y-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-purple-400">Certification #{idx + 1}</span>
                        {formData.certifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCertification(idx)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            title="Remove Certification"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Certification Title"
                          placeholder="e.g. AWS Certified Solutions Architect"
                          value={cert.name}
                          onChange={(e) => handleUpdateCertification(idx, 'name', e.target.value)}
                        />
                        <Input
                          label="Issuing Organization"
                          placeholder="e.g. Amazon Web Services / Coursera"
                          value={cert.issuer}
                          onChange={(e) => handleUpdateCertification(idx, 'issuer', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Year Issued"
                          placeholder="e.g. 2025"
                          value={cert.year}
                          onChange={(e) => handleUpdateCertification(idx, 'year', e.target.value)}
                        />
                        <Input
                          label="Verification URL / Credential ID"
                          placeholder="https://..."
                          value={cert.credentialUrl}
                          onChange={(e) => handleUpdateCertification(idx, 'credentialUrl', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════ STEP 8: RESUME UPLOAD ════════════ */}
            {currentStep === 8 && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-gray-300">
                  <p className="font-semibold text-cyan-400 mb-1">AI Resume Matcher Ready</p>
                  Upload your CV in PDF or DOCX format. The AI Copilot uses this to calibrate your Resume Score,
                  recommend bullet-point improvements, and cross-match with placement jobs.
                </div>

                {/* Upload Drag/Drop Box */}
                <label className="block border-2 border-dashed border-gray-700 hover:border-cyan-500/70 rounded-2xl p-8 text-center cursor-pointer bg-bg-secondary/40 hover:bg-cyan-500/5 transition-all">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
                      <UploadCloud size={28} />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">
                      Click to upload or drag & drop resume
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX up to 10MB (Single-page ATS recommended)
                    </p>
                  </div>
                </label>

                {/* Upload Status Card */}
                {formData.resumeFileName && (
                  <div className="p-4 rounded-xl bg-bg-secondary/80 border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{formData.resumeFileName}</p>
                        <p className="text-2xs text-gray-400">{formData.resumeFileSize || '1.8 MB'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {uploadProgress < 100 ? (
                        <div className="text-xs text-cyan-400 font-mono">{uploadProgress}%</div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                          <Check size={14} className="stroke-[3]" /> Ready
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setResumeFile(null)
                          updateField('resumeFileName', '')
                          updateField('resumeFileSize', '')
                        }}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Card Footer Actions ── */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-800">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStepConfig.skippable && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleSkip}
                className="text-gray-400 hover:text-white"
              >
                Skip for now
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              className="flex items-center gap-2 shadow-glow-cyan"
            >
              <span>{currentStep === STEPS.length ? 'Finish & Generate Twin' : 'Continue'}</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
