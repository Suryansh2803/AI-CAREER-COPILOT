import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  ArrowRightLeft,
  Check,
  Plus,
  RotateCcw,
  Sliders,
  Cpu,
  Layers,
  Code2,
  Database,
  Mic2,
  AlertCircle,
  Zap,
  Target,
  Award,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { careerAPI } from '../services/api'

// ── Smooth Number Counter Component ───────────────────────────
function AnimatedNumber({ value, duration = 500 }) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    let startTimestamp = null
    const startValue = prevValue.current
    const endValue = value
    prevValue.current = value

    if (startValue === endValue) {
      setDisplayValue(value)
      return
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (endValue - startValue) * easeProgress)
      setDisplayValue(current)
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    const animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [value, duration])

  return <span>{displayValue}</span>
}

// ── Skill Options Configuration ────────────────────────────────
const SKILL_OPTIONS = [
  {
    id: 'graph-dp',
    title: 'Complete Graph + DP',
    points: 3,
    category: 'Algorithms & Data Structures',
    desc: 'Master Dijkstra, Bellman-Ford, and Multi-dimensional DP memoization patterns.',
    icon: Code2,
    gradient: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400',
    timeEstimate: '3 Weeks',
    leverage: 'High',
  },
  {
    id: 'nodejs',
    title: 'Learn Node.js',
    points: 4,
    category: 'Backend Architecture',
    desc: 'Build production Express servers with async error middleware, JWT, and REST standards.',
    icon: Layers,
    gradient: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-400',
    timeEstimate: '2 Weeks',
    leverage: 'Critical Gap',
  },
  {
    id: 'backend-proj',
    title: 'Build Backend Project',
    points: 3,
    category: 'Hands-on Portfolio',
    desc: 'Deploy a microservice with Redis caching, PostgreSQL persistence, and Docker.',
    icon: Cpu,
    gradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
    timeEstimate: '4 Weeks',
    leverage: 'High',
  },
  {
    id: 'sql',
    title: 'Improve SQL',
    points: 2,
    category: 'Database & Profiling',
    desc: 'Master window functions (RANK, DENSE_RANK), indexing strategies, and query execution plans.',
    icon: Database,
    gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
    timeEstimate: '1.5 Weeks',
    leverage: 'Medium',
  },
  {
    id: 'system-design',
    title: 'Learn System Design',
    points: 4,
    category: 'Distributed Systems',
    desc: 'Understand load balancing, database sharding, caching tiers, message queues, and CAP theorem.',
    icon: Compass,
    gradient: 'from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-400',
    timeEstimate: '3 Weeks',
    leverage: 'Critical Gap',
  },
  {
    id: 'mock-interviews',
    title: 'Complete 3 Mock Interviews',
    points: 2,
    category: 'Interview Communication',
    desc: 'Simulated live technical interviews with algorithmic verbalization and STAR methodology.',
    icon: Mic2,
    gradient: 'from-blue-500/20 to-cyan-500/10 border-blue-500/40 text-blue-400',
    timeEstimate: '1 Week',
    leverage: 'Refinement',
  },
]

export default function CareerSimulatorPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Base score from prompt
  const BASE_SCORE = 78

  // Default selection matching user prompt example (+11 total: Node.js 4 + System Design 4 + Graph+DP 3 = 89)
  const [selectedSkillIds, setSelectedSkillIds] = useState(['graph-dp', 'nodejs', 'system-design'])

  // Toggle selection
  const toggleSkill = (id) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Select all or reset
  const handleSelectAll = () => {
    setSelectedSkillIds(SKILL_OPTIONS.map((s) => s.id))
  }

  const handleReset = () => {
    setSelectedSkillIds([])
  }

  // Sync simulation to backend
  useEffect(() => {
    const timer = setTimeout(() => {
      careerAPI.simulate(BASE_SCORE, selectedSkillIds).catch(() => {})
    }, 600)
    return () => clearTimeout(timer)
  }, [selectedSkillIds])

  // Calculate dynamic projected score
  const selectedSkills = SKILL_OPTIONS.filter((s) => selectedSkillIds.includes(s.id))
  const totalImprovement = selectedSkills.reduce((acc, curr) => acc + curr.points, 0)
  const projectedScore = Math.min(100, BASE_SCORE + totalImprovement)

  // Derived analysis
  const hasBackend = selectedSkillIds.includes('nodejs') || selectedSkillIds.includes('backend-proj')
  const hasSysDesign = selectedSkillIds.includes('system-design')

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ════════════════════ PAGE HEADER ════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800/80"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-2">
            <Sliders size={13} />
            <span>Interactive Decision Simulator · Model v2.4</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What If I Improve My Skills?
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Simulate how your next career decisions could improve your estimated readiness.
          </p>
        </div>

        {/* AI Disclaimer Pill */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-secondary/80 border border-gray-700/60 text-2xs text-gray-400 max-w-xs sm:max-w-sm">
          <AlertCircle size={15} className="text-amber-400 shrink-0" />
          <span>
            <strong>AI-based estimate:</strong> Projections represent statistical likelihoods calibrated against SDE benchmarks, not a guaranteed prediction.
          </span>
        </div>
      </motion.div>

      {/* ════════════ HERO COMPARISON CARD: Current vs Projected ════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-card via-card to-cyan-950/20 border-cyan-500/30 shadow-2xl relative overflow-hidden">
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* 1. CURRENT SCORE */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-gray-500">
                Verified Baseline
              </span>
              <p className="text-sm font-semibold text-gray-300">Current Readiness</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  {BASE_SCORE}
                </span>
                <span className="text-base font-bold text-gray-500">/100</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-2xs font-medium text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Current Status: On Track
              </div>
            </div>

            {/* 2. DYNAMIC VISUAL CONNECTOR BEAM */}
            <div className="flex flex-col items-center justify-center px-4 py-2">
              <div className="relative flex items-center justify-center">
                {/* Horizontal animated pulse beam */}
                <div className="w-24 sm:w-36 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 w-12 bg-white/80 rounded-full blur-[2px]"
                    animate={{ x: [-30, 140] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  />
                </div>

                {/* Floating Delta Badge */}
                <motion.div
                  key={totalImprovement}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-6 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black shadow-glow-cyan"
                >
                  +{totalImprovement} PTS
                </motion.div>
              </div>

              <span className="text-2xs text-gray-500 font-mono mt-3">
                {BASE_SCORE} → <AnimatedNumber value={projectedScore} />
              </span>
            </div>

            {/* 3. PROJECTED SCORE */}
            <div className="flex-1 flex flex-col items-center sm:items-end text-center sm:text-right space-y-2">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-purple-400">
                Simulated AI Projection
              </span>
              <p className="text-sm font-semibold text-gray-200">Projected Readiness</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 tracking-tight">
                  <AnimatedNumber value={projectedScore} />
                </span>
                <span className="text-base font-bold text-gray-500">/100</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400 shadow-sm">
                <TrendingUp size={13} />
                <span>+{totalImprovement} improvement</span>
              </div>
            </div>
          </div>

          {/* Visual Dual Progress Track */}
          <div className="mt-8 pt-6 border-t border-gray-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-400">
                Placement Probability Range: <strong className="text-white">84% → {Math.min(98, 84 + totalImprovement)}%</strong>
              </span>
              <span className="text-cyan-400 font-mono">
                Cohort: {projectedScore >= 88 ? 'Top 4% Tier-1 Ready' : projectedScore >= 82 ? 'Top 10% Ready' : 'Top 16% Batch'}
              </span>
            </div>

            <div className="w-full h-3.5 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800 relative">
              {/* Baseline Fill */}
              <div
                className="h-full bg-cyan-500 rounded-l-full absolute top-0.5 left-0.5"
                style={{ width: `${BASE_SCORE}%` }}
              />
              {/* Projected Increment Fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-r-full absolute top-0.5"
                style={{ left: `${BASE_SCORE}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${totalImprovement}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center justify-between text-2xs text-gray-500 pt-1">
              <span>0% Baseline</span>
              <span className="text-cyan-400">78% Verified</span>
              <span className="text-purple-400 font-bold">{projectedScore}% Simulated</span>
              <span>100% Elite</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ════════════ SKILL OPTIONS: Interactive Selection Grid ════════════ */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Select Milestones to Simulate
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Click cards to add or remove learning objectives and observe estimated score dynamics
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3 py-1.5 rounded-lg bg-bg-secondary hover:bg-gray-800 border border-gray-700/60 text-xs font-semibold text-gray-300 transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary hover:bg-gray-800 border border-gray-700/60 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_OPTIONS.map((skill) => {
            const isSelected = selectedSkillIds.includes(skill.id)
            const Icon = skill.icon

            return (
              <motion.div
                key={skill.id}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => toggleSkill(skill.id)}
                className="cursor-pointer"
              >
                <div
                  className={`p-5 rounded-2xl border transition-all duration-200 h-full flex flex-col justify-between relative overflow-hidden select-none ${
                    isSelected
                      ? `bg-gradient-to-br ${skill.gradient} shadow-lg ring-1 ring-cyan-400/50`
                      : 'bg-card/90 border-card-border hover:border-gray-700 opacity-80'
                  }`}
                >
                  <div>
                    {/* Card Top: Category + Points */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xs font-extrabold uppercase tracking-wider text-gray-400">
                        {skill.category}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-glow-cyan'
                            : 'bg-gray-800 text-gray-400 border-gray-700'
                        }`}
                      >
                        +{skill.points} PTS
                      </span>
                    </div>

                    {/* Title + Icon */}
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={`p-2 rounded-xl border shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-bg-secondary border-gray-700 text-gray-400'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white leading-snug">
                          {skill.title}
                        </h3>
                        <span className="text-2xs text-gray-500 font-medium">
                          Est. Duration: {skill.timeEstimate}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      {skill.desc}
                    </p>
                  </div>

                  {/* Card Bottom: Selection Pill */}
                  <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                    <span
                      className={`text-2xs font-semibold px-2 py-0.5 rounded ${
                        skill.leverage === 'Critical Gap'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-bg-secondary text-gray-400 border border-gray-800'
                      }`}
                    >
                      {skill.leverage}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-cyan-500 border-cyan-400 text-bg-primary'
                            : 'border-gray-700 text-transparent'
                        }`}
                      >
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <span className="text-2xs font-bold text-gray-400">
                        {isSelected ? 'Simulated' : 'Select'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ════════════ EXPLANATION & RECOMMENDED ACTION ════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* EXPLANATION CARD (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <Card className="h-full p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
                  <Zap size={16} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Simulation Analysis & Insight
                </h3>
              </div>

              {/* Exact Prompt Required Text */}
              <div className="p-4 rounded-xl bg-bg-secondary/70 border border-gray-800 text-sm text-gray-200 leading-relaxed space-y-2">
                <p className="font-semibold text-cyan-300">
                  &ldquo;Your largest improvement comes from Backend Development and System Design because these are currently high-priority gaps for your target SDE role.&rdquo;
                </p>
                <p className="text-xs text-gray-400 pt-1">
                  While your DSA readiness is already verified at 85%, campus recruiters at Amazon and Tier-1 product firms heavily test practical API design and distributed system trade-offs.
                </p>
              </div>

              {/* Breakdown Tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
                <div className="p-3 rounded-xl bg-card border border-gray-800 space-y-1">
                  <span className="text-2xs font-bold uppercase text-purple-400 block">
                    High-Leverage Factor (+8 Pts)
                  </span>
                  <p className="font-semibold text-white">Node.js + System Design</p>
                  <p className="text-2xs text-gray-400">
                    Bridges your #1 and #2 critical qualification gaps.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-card border border-gray-800 space-y-1">
                  <span className="text-2xs font-bold uppercase text-cyan-400 block">
                    Refinement Factor (+3 Pts)
                  </span>
                  <p className="font-semibold text-white">Graph + DP Mastery</p>
                  <p className="text-2xs text-gray-400">
                    Elevates you into top-bracket contest tier solutions.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-2xs text-gray-500">
              Simulation models are recalibrated weekly based on actual interview trends from 2026 hiring batches.
            </p>
          </Card>
        </motion.div>

        {/* RECOMMENDED ACTION CARD (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-5"
        >
          <Card className="h-full p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-card via-card to-purple-950/25 border-purple-500/40 shadow-glow-purple/20 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <Target size={14} />
                <span>Next Best Action</span>
              </div>

              <div>
                <span className="text-2xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                  Prescribed Learning Track
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Start Backend Roadmap
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Transform these simulated numbers into verified points. Follow our structured 30-day curriculum covering Node.js, Express, MongoDB schemas, and containerization.
              </p>

              <div className="p-3 rounded-xl bg-bg-secondary/70 border border-gray-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Target Role</span>
                  <strong className="text-white">Amazon SDE-1</strong>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Projected Completion</span>
                  <strong className="text-emerald-400 font-bold">89/100 Readiness</strong>
                </div>
              </div>
            </div>

            {/* Recommended Action Button */}
            <div className="pt-6 mt-4 border-t border-gray-800/80">
              <Link to="/career-roadmap" className="w-full block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-glow-cyan hover:shadow-cyan-500/40 transition-all cursor-pointer"
                >
                  <span>Start Backend Roadmap</span>
                  <ArrowRight size={17} />
                </motion.button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
