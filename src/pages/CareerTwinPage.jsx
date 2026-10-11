import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Bot,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Code2,
  Cpu,
  Layers,
  Database,
  Compass,
  Briefcase,
  ChevronRight,
  RefreshCw,
  Share2,
  Sliders,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'

const SKILL_DIMENSIONS = [
  { name: 'DSA', icon: Code2, signals: ['dsa', 'algorithm', 'problem solving'] },
  { name: 'Development', icon: Layers, signals: ['react', 'node', 'javascript', 'typescript', 'python', 'java', 'frontend', 'backend', 'web development'] },
  { name: 'Projects', icon: Cpu, signals: [] },
  { name: 'CS Fundamentals', icon: Database, signals: ['sql', 'database', 'operating systems', 'computer networks', 'c++', 'java'] },
  { name: 'Resume', icon: Briefcase, signals: [] },
  { name: 'Communication', icon: Compass, signals: [] },
]

function scoreProfile(profile = {}) {
  const skills = (profile.skills || []).map((skill) => String(skill).toLowerCase())
  const projects = (profile.projects || []).filter((project) => project.name || project.description)
  const stack = projects.map((project) => `${project.techStack || ''} ${project.description || ''}`).join(' ').toLowerCase()
  const dsaBand = String(profile.dsaProblems || '').match(/\d+/g)?.map(Number) || []
  const dsaCount = dsaBand.length ? Math.max(...dsaBand) : 0
  const dsaLevel = String(profile.dsaLevel || '').toLowerCase()
  const dsa = Math.min(98, 20 + Math.min(dsaCount, 500) * 0.09 + ({ beginner: 5, intermediate: 20, advanced: 34, expert: 42 }[dsaLevel] || 0) + Math.min((profile.dsaTopics || []).length * 2, 10))
  const has = (terms) => skills.some((skill) => terms.some((term) => skill.includes(term)))
  const dev = Math.min(96, 24 + (has(['react', 'javascript', 'typescript', 'frontend', 'html', 'css']) ? 18 : 0) + (has(['node', 'python', 'java', 'backend', 'api']) ? 18 : 0) + Math.min(projects.length * 8, 24) + (stack.match(/react|node|api|express|django|spring/g) || []).length * 2)
  const projectScore = Math.min(96, 18 + projects.length * 20 + (stack.includes('github') ? 8 : 0) + (stack.includes('deploy') || stack.includes('live') ? 8 : 0))
  const fundamentals = Math.min(95, 26 + (has(['c++', 'java', 'python', 'sql']) ? 16 : 0) + (has(['sql', 'database', 'dbms']) ? 12 : 0) + Math.min((profile.dsaTopics || []).length * 4, 16) + (/computer|software|information|engineering/i.test(profile.branch || '') ? 10 : 0))
  const resume = profile.resumeFileName ? 58 : 20
  const communication = Math.min(90, 30 + (profile.linkedin ? 12 : 0) + (profile.portfolio ? 12 : 0) + Math.min(projects.filter((project) => (project.description || '').length > 40).length * 12, 24))
  const values = [dsa, dev, projectScore, fundamentals, resume, communication].map((value) => Math.round(value))
  const score = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
  const status = score >= 80 ? 'Excellent' : score >= 60 ? 'On Track' : score >= 40 ? 'Needs Work' : 'Getting Started'
  const radarSkills = SKILL_DIMENSIONS.map((dimension, index) => ({
    name: dimension.name,
    icon: dimension.icon,
    value: values[index],
    status: [
      `${dsaCount ? `${dsaCount}+ problems and ${profile.dsaLevel || 'unspecified'} level` : 'Add your solved problem range and level'}`,
      `${skills.length} listed skills and ${projects.length} project${projects.length === 1 ? '' : 's'}`,
      `${projects.length} project${projects.length === 1 ? '' : 's'} listed in your profile`,
      `${(profile.dsaTopics || []).length} DSA topics selected${profile.branch ? ` · ${profile.branch}` : ''}`,
      profile.resumeFileName ? 'Resume file listed; ATS score not assessed here' : 'Add a resume to assess this area',
      'Estimated from profile links and project descriptions',
    ][index],
  }))
  const sorted = [...radarSkills].sort((a, b) => b.value - a.value)
  const strengths = sorted.slice(0, 3).filter((skill) => skill.value >= 50).map((skill) => ({
    title: skill.name,
    level: `${skill.value}%`,
    badge: skill.value >= 75 ? 'Current Strength' : 'Developing',
    desc: skill.status,
    icon: skill.icon,
  }))
  const gaps = [...radarSkills].sort((a, b) => a.value - b.value).slice(0, 3).map((skill, index) => ({
    priority: index === 0 && skill.value < 50 ? 'Critical' : index === 0 ? 'High' : index === 1 ? 'Medium' : 'Build Next',
    title: skill.name,
    color: ['rose', 'amber', 'cyan'][index],
    border: ['border-rose-500/40 bg-rose-500/10 text-rose-300', 'border-amber-500/40 bg-amber-500/10 text-amber-300', 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'][index],
    badgeColor: ['bg-rose-500/20 text-rose-400 border-rose-500/40', 'bg-amber-500/20 text-amber-400 border-amber-500/40', 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'][index],
    desc: skill.status,
    action: `Improve ${skill.name}`,
    impact: `Priority ${index + 1}`,
  }))
  return { score, status, radarSkills, strengths, weaknesses: [...sorted].reverse().slice(0, 3).map((skill) => ({ title: skill.name, level: `${skill.value}%`, status: skill.value < 45 ? 'Needs Attention' : 'Room to Improve', desc: skill.status, icon: skill.icon })), careerGaps: gaps, targetRole: profile.targetRole || 'Add a target role', targetCompany: profile.targetCompany || '', sourceReady: Boolean(profile.targetRole || skills.length || projects.length) }
}

// ── SVG Radar Chart Component ──────────────────────────────────
function SkillRadarChart({ skills, size = 380 }) {
  const [hoveredSkill, setHoveredSkill] = useState(null)

  const center = size / 2
  const radius = size * 0.38
  const levels = [0.25, 0.5, 0.75, 1.0]

  // Calculate coordinates for a given angle and normalized distance
  const getCoordinates = (index, value) => {
    const total = skills.length
    // Start from top (-PI/2) and rotate clockwise
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2
    const r = radius * (value / 100)
    const x = center + r * Math.cos(angle)
    const y = center + r * Math.sin(angle)
    return { x, y, angle }
  }

  // Polygon points string for the data layer
  const dataPoints = skills.map((s, i) => {
    const { x, y } = getCoordinates(i, s.value)
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        className="overflow-visible select-none max-w-full drop-shadow-2xl"
      >
        <defs>
          {/* Glowing polygon gradient fill */}
          <linearGradient id="radar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.45" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Background Concentric Polygons */}
        {levels.map((lvl, lvlIdx) => {
          const ringPoints = skills.map((_, i) => {
            const { x, y } = getCoordinates(i, lvl * 100)
            return `${x},${y}`
          }).join(' ')

          return (
            <polygon
              key={lvlIdx}
              points={ringPoints}
              fill={lvlIdx === levels.length - 1 ? 'rgba(15, 23, 42, 0.4)' : 'transparent'}
              stroke="rgba(75, 85, 99, 0.35)"
              strokeWidth={lvlIdx === levels.length - 1 ? '1.5' : '1'}
              strokeDasharray={lvlIdx < levels.length - 1 ? '3 3' : undefined}
            />
          )
        })}

        {/* 2. Radial Axis Lines */}
        {skills.map((_, i) => {
          const { x, y } = getCoordinates(i, 100)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(75, 85, 99, 0.4)"
              strokeWidth="1.2"
            />
          )
        })}

        {/* 3. Center Anchor Glow */}
        <circle
          cx={center}
          cy={center}
          r="3"
          fill="#06b6d4"
          className="animate-pulse"
        />

        {/* 4. Animated Data Polygon */}
        <motion.polygon
          points={dataPoints}
          fill="url(#radar-gradient)"
          stroke="#22d3ee"
          strokeWidth="2.5"
          filter="url(#radar-glow)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="transition-all"
        />

        {/* 5. Interactive Vertex Points */}
        {skills.map((s, i) => {
          const { x, y } = getCoordinates(i, s.value)
          const isHovered = hoveredSkill?.name === s.name

          return (
            <g
              key={s.name}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredSkill(s)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {/* Outer pulsing ring on hover */}
              {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill="rgba(6, 182, 212, 0.2)"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                  className="animate-ping"
                />
              )}
              {/* Vertex Dot */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? '6' : '4.5'}
                fill={isHovered ? '#ffffff' : '#22d3ee'}
                stroke="#0f172a"
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>
          )
        })}

        {/* 6. Outer Axis Text Labels */}
        {skills.map((s, i) => {
          const labelDistance = 118
          const { x, y } = getCoordinates(i, labelDistance)
          const isHovered = hoveredSkill?.name === s.name

          // Fine-tune text anchoring based on position
          let textAnchor = 'middle'
          if (x < center - 15) textAnchor = 'end'
          else if (x > center + 15) textAnchor = 'start'

          return (
            <text
              key={s.name}
              x={x}
              y={y + 4}
              textAnchor={textAnchor}
              className={`text-2xs sm:text-xs font-bold transition-colors select-none ${
                isHovered ? 'fill-cyan-300 font-extrabold' : 'fill-gray-300'
              }`}
            >
              {s.name} ({s.value}%)
            </text>
          )
        })}
      </svg>

      {/* Floating Tooltip Pill */}
      <div className="h-6 mt-2">
        {hoveredSkill ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-bold shadow-glow-cyan"
          >
            {hoveredSkill.name}: {hoveredSkill.value}% Proficiency · {hoveredSkill.status}
          </motion.div>
        ) : (
          <span className="text-2xs text-gray-500">
            Hover over radar vertices to inspect calibrated competencies
          </span>
        )}
      </div>
    </div>
  )
}

// ── Main Page Component ────────────────────────────────────────
export default function CareerTwinPage() {
  const { user, getOnboardingData } = useAuth()
  const [syncing, setSyncing] = useState(false)
  const [profileData, setProfileData] = useState(() => getOnboardingData())
  const analysis = useMemo(() => scoreProfile(profileData), [profileData])
  const { score, status: readinessStatus, radarSkills, strengths, weaknesses, careerGaps, targetRole, targetCompany } = analysis
  const strongest = radarSkills.reduce((best, item) => item.value > best.value ? item : best, radarSkills[0])
  const primaryGap = radarSkills.reduce((weakest, item) => item.value < weakest.value ? item : weakest, radarSkills[0])
  const listedSkills = profileData.skills || []

  const handleResync = async () => {
    setSyncing(true)
    setProfileData(getOnboardingData())
    window.setTimeout(() => setSyncing(false), 450)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ════════════════════ PAGE HEADER ════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800/80"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles size={13} />
            <span>Autonomous Digital Twin · Active Model</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Your AI Career Twin
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            A living snapshot of your career readiness.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResync}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-bg-secondary border border-gray-700/60 hover:border-gray-500 text-xs font-medium text-gray-300 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin text-cyan-400' : ''} />
            <span>{syncing ? 'Calibrating Twin...' : 'Recalibrate Twin'}</span>
          </button>

          <Link to="/simulator">
            <Button variant="secondary" size="sm" icon={Sliders} className="border-purple-500/30 text-purple-300 hover:text-white">
              What-If Simulator
            </Button>
          </Link>

          <Link to="/career-roadmap">
            <Button variant="primary" size="sm" iconRight={ArrowRight} className="shadow-glow-cyan">
              Full Roadmap
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ════════════ TOP SECTION: Central Score & Target Role ════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* CAREER SCORE: Large Central Visualization (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="lg:col-span-7"
        >
          <Card className="h-full p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-card via-card to-cyan-950/25 border-cyan-500/30 shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              {/* Card Meta Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xs uppercase tracking-wider text-gray-400 font-bold">
                    Primary Readiness Index
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Career Readiness
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-400 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {readinessStatus}
                  </span>
                </div>
              </div>

              {/* Central Glowing Hero Score */}
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                {/* Orbital Score Ring */}
                <div className="relative flex items-center justify-center">
                  {/* Outer Pulsing Aura Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 blur-xl animate-pulse" />

                  {/* Concentric SVG Rings */}
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="42%"
                        stroke="rgba(31, 41, 55, 0.7)"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="42%"
                        stroke="url(#hero-score-gradient)"
                        strokeWidth="12"
                        strokeDasharray={2 * Math.PI * 80}
                        initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                        animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - score / 100) }}
                        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                      <defs>
                        <linearGradient id="hero-score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="50%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Central Score Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                          {score}
                        </span>
                        <span className="text-sm font-semibold text-gray-400">/100</span>
                      </motion.div>
                    <span className="text-2xs uppercase tracking-wider text-cyan-400 font-bold mt-1">
                        Readiness
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown & Improvement Details */}
                <div className="flex-1 space-y-3.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                    <TrendingUp size={14} />
                    <span>{analysis.sourceReady ? 'Based on your saved profile' : 'Complete your profile to personalize this score'}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    This estimate uses your saved skills, DSA progress, projects, and profile links. Your strongest listed area is{' '}
                    <strong className="text-cyan-300 font-semibold">{strongest.name}</strong>. Build evidence in{' '}
                    <strong className="text-white">{primaryGap.name}</strong> to improve your fit for the role you selected.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-2xs text-gray-400 pt-1">
                    <div className="p-2 rounded-lg bg-bg-secondary/60 border border-gray-800">
                      <span className="text-gray-500 block">Candidate Cohort</span>
                      <strong className="text-white text-xs">{profileData.currentYear || 'Year not provided'}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-bg-secondary/60 border border-gray-800">
                      <span className="text-gray-500 block">Placement Window</span>
                      <strong className="text-emerald-400 text-xs">{readinessStatus}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Indicator */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-2xs sm:text-xs text-gray-400">
                <span>Assessment basis: <strong className="text-cyan-400">Profile data</strong></span>
                <Link to="/onboarding" className="text-cyan-400 hover:text-cyan-300">Update profile inputs <ArrowRight size={12} className="inline" /></Link>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* TARGET ROLE CARD (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <Card className="h-full p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-card via-card to-purple-950/20 border-purple-500/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wider text-purple-400 font-bold">
                  Target Role & Calibration
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-2xs font-semibold">
                  {analysis.sourceReady ? 'Your selected goal' : 'Profile needed'}
                </span>
              </div>

              {/* Target Role & Company Showcase */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-bg-secondary/80 border border-gray-800">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Target Role
                  </p>
                  <h3 className="text-xl font-black text-white tracking-tight">{targetRole}</h3>
                  <p className="text-xs text-gray-300">
                    Target role from your profile
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Target Company
                  </p>
                  <h3 className="text-2xl font-black text-white tracking-tight flex items-center justify-end gap-1.5">
                    <span>{targetCompany || 'No company selected'}</span>
                  </h3>
                  <span className="inline-block text-2xs text-amber-400 font-medium">
                    {profileData.targetPackage || 'Add a target package'}
                  </span>
                </div>
              </div>

              {/* Job Match Percentage */}
              <div className="p-4 rounded-xl bg-bg-secondary/60 border border-gray-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-300">Profile Coverage Estimate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-purple-400">{score}%</span>
                    <span className="text-2xs text-gray-500 font-bold">MATCH</span>
                  </div>
                </div>

                <ProgressBar value={score} variant="purple" size="md" animate />

                <div className="grid grid-cols-2 gap-2 text-2xs pt-1">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{listedSkills.slice(0, 2).join(', ') || 'No skills listed'} (from profile)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{profileData.dsaLevel ? `${profileData.dsaLevel} DSA` : 'DSA level not provided'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <XCircle size={13} className="text-rose-400 shrink-0" />
                    <span>{primaryGap.name} (focus area)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <XCircle size={13} className="text-rose-400 shrink-0" />
                    <span>{profileData.resumeFileName ? 'Resume listed' : 'Resume not listed'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <Link to="/job-match">
                <Button variant="secondary" size="sm" fullWidth iconRight={ArrowRight}>
                  Explore Job Match Details
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ════════════ SKILL RADAR CHART SECTION ════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card className="p-6 sm:p-8 bg-card/95 border-card-border relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-cyan-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Skill Radar Analysis
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Profile-based estimates across skills and evidence you entered
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="cyan" dot>Profile Estimate</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Radar Chart (7 cols) */}
            <div className="lg:col-span-7 flex justify-center py-2">
              <SkillRadarChart skills={radarSkills} size={370} />
            </div>

            {/* Right Radar Breakdown List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                Evaluated Competencies
              </h4>

              {radarSkills.map((sk) => (
                <div
                  key={sk.name}
                  className="p-3 rounded-xl bg-bg-secondary/70 border border-gray-800 hover:border-gray-700 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white">{sk.name}</p>
                    <p className="text-2xs text-gray-400">{sk.status}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-cyan-400">
                      {sk.value}%
                    </span>
                    <div className="w-20 mt-1">
                      <ProgressBar
                        value={sk.value}
                        variant={sk.value >= 80 ? 'cyan' : sk.value >= 70 ? 'purple' : 'amber'}
                        size="xs"
                        animate
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ════════════ STRENGTHS & WEAKNESSES SECTION ════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STRENGTHS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <Card className="p-6 h-full border-emerald-500/30 bg-gradient-to-br from-card to-emerald-950/10">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Strengths
                </h3>
              </div>
              <Badge variant="green">Top Competencies</Badge>
            </div>

            <div className="space-y-3.5">
              {strengths.map((st) => {
                const Icon = st.icon
                return (
                  <div
                    key={st.title}
                    className="p-3.5 rounded-xl bg-bg-secondary/70 border border-gray-800 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
                          <Icon size={14} />
                        </div>
                        <h4 className="text-sm font-bold text-white">{st.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                          {st.badge}
                        </span>
                        <span className="text-sm font-extrabold text-emerald-400">{st.level}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed pl-7">
                      {st.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* WEAKNESSES */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="p-6 h-full border-rose-500/30 bg-gradient-to-br from-card to-rose-950/10">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Weaknesses
                </h3>
              </div>
              <Badge variant="red">Improvement Areas</Badge>
            </div>

            <div className="space-y-3.5">
              {weaknesses.map((wk) => {
                const Icon = wk.icon
                return (
                  <div
                    key={wk.title}
                    className="p-3.5 rounded-xl bg-bg-secondary/70 border border-gray-800 hover:border-rose-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-rose-500/15 text-rose-400">
                          <Icon size={14} />
                        </div>
                        <h4 className="text-sm font-bold text-white">{wk.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold">
                          {wk.status}
                        </span>
                        <span className="text-sm font-extrabold text-rose-400">{wk.level}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed pl-7">
                      {wk.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ════════════ CAREER GAPS (Priority Cards) ════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22 }}
      >
        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-5">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Career Gaps
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Lowest-scoring profile areas for {targetRole}
              </p>
            </div>
            <Link to="/career-roadmap">
              <Button variant="ghost" size="xs" iconRight={ArrowRight}>
                View Sprint Plan
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {careerGaps.map((gap) => (
              <div
                key={gap.title}
                className={`p-5 rounded-2xl border ${gap.border} flex flex-col justify-between space-y-4`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${gap.badgeColor}`}>
                      {gap.priority}
                    </span>
                    <span className="text-2xs font-bold text-emerald-400">
                      {gap.impact}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">
                    {gap.title}
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {gap.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <Link to="/career-roadmap" className="w-full block">
                    <Button variant="outline" size="xs" fullWidth iconRight={ChevronRight}>
                      {gap.action}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ════════════ AI RECOMMENDATION (Large Hero Card) ════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-card via-purple-950/30 to-cyan-950/30 border-purple-500/40 shadow-glow-purple/20 relative overflow-hidden">
          {/* Ambient Cyber Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <Bot size={15} className="text-cyan-400" />
                <span>Recommended Next Step · Profile Analysis</span>
              </div>

              {/* Personalized recommendation from the lowest profile dimension */}
              <div className="space-y-2 text-white font-medium text-base sm:text-lg leading-relaxed">
                <p className="text-cyan-300 font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                  Your strongest listed area is {strongest.name} ({strongest.value}%).
                </p>
                <p className="text-rose-300 font-bold flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-400 shrink-0" />
                  Your biggest current gap is {primaryGap.name} ({primaryGap.value}%).
                </p>
                <p className="text-gray-200 mt-2 font-normal text-sm sm:text-base leading-relaxed bg-bg-secondary/60 p-3.5 rounded-xl border border-gray-800">
                  Your next best action is to add specific evidence for{' '}
                  <strong className="text-white font-bold">{primaryGap.name}</strong> in your profile, then build a project that demonstrates it.
                </p>
              </div>

              <p className="text-2xs text-gray-400">
                Estimated from your saved onboarding profile. This is not a verified test or ATS evaluation.
              </p>
            </div>

            {/* CTA Button */}
            <div className="shrink-0 w-full md:w-auto">
              <Link to="/career-roadmap" className="w-full block">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-glow-cyan hover:shadow-cyan-500/40 transition-all cursor-pointer"
                >
                  <span>View Recommended Roadmap</span>
                  <ArrowRight size={17} />
                </motion.button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
