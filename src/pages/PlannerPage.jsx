import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  Sparkles,
  CheckCircle2,
  Check,
  Flame,
  Award,
  Trophy,
  Zap,
  Code2,
  Database,
  Server,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Star,
  Layers,
  Bot,
  Cpu,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { plannerAPI } from '../services/api'

// ── Storage key for persisting planner state ───────────────────
const PLANNER_STORAGE_KEY = 'acc_planner_tasks_v1'
const XP_STORAGE_KEY = 'acc_gamification_xp_v1'

// ── Time Presets & Associated Tasks ────────────────────────────
const TIME_OPTIONS = ['1 hour', '2 hours', '3 hours', '4+ hours']

const MODULE_TASKS = {
  '1 hour': [
    {
      id: 'p1-dsa',
      module: 'DSA',
      icon: Code2,
      variant: 'cyan',
      title: 'Solve 1 LeetCode Medium (Binary Tree Inversion)',
      duration: '25 mins',
      xp: 50,
      desc: 'Focus on recursive post-order traversal and space complexity O(H).',
    },
    {
      id: 'p1-backend',
      module: 'Backend',
      icon: Server,
      variant: 'purple',
      title: 'Review Express Router Modular Architecture',
      duration: '20 mins',
      xp: 40,
      desc: 'Inspect separation of controllers and routes in Node.js.',
    },
    {
      id: 'p1-revision',
      module: 'Revision',
      icon: BookOpen,
      variant: 'amber',
      title: 'Flashcards: Process vs Thread Differences',
      duration: '15 mins',
      xp: 30,
      desc: 'Quick recap of memory space isolation and context-switch latency.',
    },
  ],
  '2 hours': [
    {
      id: 'p2-dsa',
      module: 'DSA',
      icon: Code2,
      variant: 'cyan',
      title: 'Solve 2 LeetCode Mediums (Tree DFS + Sliding Window)',
      duration: '45 mins',
      xp: 80,
      desc: 'Practice boundary conditions and window pointer invariants under timed conditions.',
    },
    {
      id: 'p2-backend',
      module: 'Backend',
      icon: Server,
      variant: 'purple',
      title: 'Build JWT Authentication Middleware in Express',
      duration: '40 mins',
      xp: 75,
      desc: 'Implement bearer token verification, header decoding, and 401 error handling.',
    },
    {
      id: 'p2-dbms',
      module: 'DBMS',
      icon: Database,
      variant: 'green',
      title: 'Study B+ Tree Indexing & Range Queries',
      duration: '20 mins',
      xp: 45,
      desc: 'Understand why relational databases favor B+ Trees over Hash indexes for range scans.',
    },
    {
      id: 'p2-revision',
      module: 'Revision',
      icon: BookOpen,
      variant: 'amber',
      title: 'Core OS Concurrency Flashcards & Deadlock Conditions',
      duration: '15 mins',
      xp: 35,
      desc: 'Review Coffman deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
    },
  ],
  '3 hours': [
    {
      id: 'p3-dsa',
      module: 'DSA',
      icon: Code2,
      variant: 'cyan',
      title: 'Solve 2 Mediums + 1 Hard (Dynamic Programming & Trees)',
      duration: '60 mins',
      xp: 110,
      desc: 'Construct 2D state-space memoization tables and trace overlapping subproblems.',
    },
    {
      id: 'p3-backend',
      module: 'Backend',
      icon: Server,
      variant: 'purple',
      title: 'Implement MongoDB Mongoose Schema & JWT Rotation',
      duration: '60 mins',
      xp: 100,
      desc: 'Connect Atlas cluster, configure compound indexes, and implement refresh token rotation.',
    },
    {
      id: 'p3-dbms',
      module: 'DBMS',
      icon: Database,
      variant: 'green',
      title: 'Query Plan Profiling (EXPLAIN ANALYZE) & Index Tuning',
      duration: '35 mins',
      xp: 60,
      desc: 'Analyze sequential scans vs index scans on 100,000 synthetic rows.',
    },
    {
      id: 'p3-revision',
      module: 'Revision',
      icon: BookOpen,
      variant: 'amber',
      title: 'Behavioral STAR Story Preparation for SDE',
      duration: '25 mins',
      xp: 50,
      desc: 'Draft Situation, Task, Action, and Result for a challenging engineering bug.',
    },
  ],
  '4+ hours': [
    {
      id: 'p4-dsa',
      module: 'DSA',
      icon: Code2,
      variant: 'cyan',
      title: 'Intensive Algorithmic Sprint: Graphs, Tries & DP',
      duration: '75 mins',
      xp: 140,
      desc: 'Implement Dijkstra shortest-path and Prefix Tree search algorithms.',
    },
    {
      id: 'p4-backend',
      module: 'Backend',
      icon: Server,
      variant: 'purple',
      title: 'Architect Distributed Task Queue Service (Express + Redis)',
      duration: '80 mins',
      xp: 150,
      desc: 'Deploy asynchronous background workers with rate limiting and exponential backoff retry.',
    },
    {
      id: 'p4-dbms',
      module: 'DBMS',
      icon: Database,
      variant: 'green',
      title: 'ACID Properties, Isolation Levels & Distributed Transactions',
      duration: '45 mins',
      xp: 75,
      desc: 'Compare Read Committed, Repeatable Read, and Serializable anomalies (Dirty Read, Phantom Read).',
    },
    {
      id: 'p4-revision',
      module: 'Revision',
      icon: BookOpen,
      variant: 'amber',
      title: 'Full SDE Mock Interview Practice & System Design Recap',
      duration: '40 mins',
      xp: 85,
      desc: 'Complete an end-to-end technical interview session and analyze feedback.',
    },
  ],
}

// ── Gamification Badges & Achievements Data ───────────────────
const BADGES = [
  {
    id: 'b-recursion',
    name: 'Recursion Wizard',
    category: 'Algorithms',
    icon: Code2,
    unlocked: true,
    desc: 'Solved 25+ Tree and Backtracking problems with optimal stack depth.',
    color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  },
  {
    id: 'b-backend',
    name: 'Backend Initiate',
    category: 'Architecture',
    icon: Server,
    unlocked: true,
    desc: 'Completed first Express REST API service with JWT authentication.',
    color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
  },
  {
    id: 'b-ats',
    name: 'ATS 75+ Master',
    category: 'Resume',
    icon: Award,
    unlocked: true,
    desc: 'Calibrated resume layout to exceed 75/100 automated screening threshold.',
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
  {
    id: 'b-grinder',
    name: 'Daily Grinder',
    category: 'Consistency',
    icon: Flame,
    unlocked: true,
    desc: 'Maintained a 10+ day consecutive learning streak on career roadmap.',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  },
  {
    id: 'b-architect',
    name: 'System Architect',
    category: 'Distributed Systems',
    icon: Cpu,
    unlocked: false,
    desc: 'Master caching, load balancing, and database sharding principles.',
    color: 'border-gray-700 bg-bg-secondary text-gray-500 opacity-60',
  },
]

const ACHIEVEMENTS = [
  {
    title: 'Solved 100+ LeetCode Problems',
    metric: '100 / 100 Solved',
    percent: 100,
    completed: true,
    reward: '+300 XP',
  },
  {
    title: 'First Mock Interview Score 80%+',
    metric: '82% Achieved',
    percent: 100,
    completed: true,
    reward: '+250 XP',
  },
  {
    title: 'Roadmap Week 1 Milestone Complete',
    metric: '4 / 4 Tasks Finished',
    percent: 100,
    completed: true,
    reward: '+200 XP',
  },
  {
    title: '14-Day Consistency Master',
    metric: '12 / 14 Days Active',
    percent: 85,
    completed: false,
    reward: '+500 XP',
  },
]

export default function PlannerPage() {
  const { user } = useAuth()

  // ── Selected Time Budget ─────────────────────────────────────
  const [selectedTime, setSelectedTime] = useState('2 hours')

  // Completed tasks state
  const [completedTaskIds, setCompletedTaskIds] = useState(() => {
    try {
      const saved = localStorage.getItem(PLANNER_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    // Initial 80% default (e.g. 3 of 4 completed in 2 hours = 75%-80%)
    return ['p2-dsa', 'p2-backend', 'p2-dbms']
  })

  // Dynamic user XP
  const [userXP, setUserXP] = useState(() => {
    try {
      const saved = localStorage.getItem(XP_STORAGE_KEY)
      if (saved) return parseInt(saved, 10)
    } catch (_) {}
    return 2450
  })

  // Persist completed tasks
  useEffect(() => {
    try {
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(completedTaskIds))
    } catch (_) {}
  }, [completedTaskIds])

  // Persist XP
  useEffect(() => {
    try {
      localStorage.setItem(XP_STORAGE_KEY, userXP.toString())
    } catch (_) {}
  }, [userXP])

  // Sync with backend planner API
  useEffect(() => {
    plannerAPI.getToday().catch(() => {})
  }, [])

  // Active task list for selected time
  const currentTasks = MODULE_TASKS[selectedTime] || MODULE_TASKS['2 hours']

  const toggleTask = (task) => {
    const isDone = completedTaskIds.includes(task.id)
    if (isDone) {
      setCompletedTaskIds((prev) => prev.filter((id) => id !== task.id))
      setUserXP((prev) => Math.max(0, prev - task.xp))
    } else {
      setCompletedTaskIds((prev) => [...prev, task.id])
      setUserXP((prev) => prev + task.xp)
    }
  }

  const handleResetTasks = () => {
    const activeIds = currentTasks.map((t) => t.id)
    setCompletedTaskIds((prev) => prev.filter((id) => !activeIds.includes(id)))
  }

  const handleCompleteAllToday = () => {
    const activeIds = currentTasks.map((t) => t.id)
    setCompletedTaskIds((prev) => Array.from(new Set([...prev, ...activeIds])))
  }

  // Progress calculations
  const todayCompletedCount = currentTasks.filter((t) => completedTaskIds.includes(t.id)).length
  const todayTotalCount = currentTasks.length
  const todayProgressPercent = Math.round((todayCompletedCount / todayTotalCount) * 100)

  // Current level
  const currentLevel = Math.floor(userXP / 400) + 1
  const levelProgress = ((userXP % 400) / 400) * 100

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
            <CalendarDays size={13} />
            <span>AI Daily Curriculum & Gamified Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Daily Planner
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Dynamic schedule tailored to your available hours across DSA, DBMS, Backend, and Revision.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/mentor">
            <Button variant="secondary" size="sm" icon={Bot} className="border-purple-500/30 text-purple-300 hover:text-white">
              Ask AI Mentor
            </Button>
          </Link>
          <Link to="/career-roadmap">
            <Button variant="primary" size="sm" iconRight={ArrowRight} className="shadow-glow-cyan">
              Roadmap
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ════════════ GAMIFICATION BANNER: XP, Streak, Level ════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-r from-card via-card to-cyan-950/20 border-card-border shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* 1. XP LEDGER */}
            <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-gray-800 pb-4 sm:pb-0 pr-4">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Zap size={13} /> Total Experience Points
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">{userXP.toLocaleString()}</span>
                <span className="text-xs font-bold text-cyan-300">XP</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-3xs text-gray-400">
                  <span>Level {currentLevel}: SDE Apprentice</span>
                  <span>{Math.round(levelProgress)}% to Lvl {currentLevel + 1}</span>
                </div>
                <ProgressBar value={levelProgress} variant="cyan" size="xs" animate />
              </div>
            </div>

            {/* 2. ACTIVE STREAK */}
            <div className="space-y-1.5 border-b sm:border-b-0 lg:border-r border-gray-800 pb-4 sm:pb-0 pr-4">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Flame size={13} /> Consistency Streak
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">12</span>
                <span className="text-xs font-bold text-amber-300">Days Active 🔥</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-2xs text-gray-400">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-3xs ${
                      i < 5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. TODAY'S PROGRESS HERO SCORE */}
            <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-gray-800 pb-4 sm:pb-0 pr-4">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Today&apos;s Progress
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  {todayProgressPercent}%
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  ({todayCompletedCount}/{todayTotalCount} Tasks)
                </span>
              </div>
              <ProgressBar
                value={todayProgressPercent}
                variant={todayProgressPercent >= 80 ? 'green' : 'gradient'}
                size="xs"
                animate
              />
            </div>

            {/* 4. UNLOCKED BADGES COUNT */}
            <div className="space-y-1.5 pl-2">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Trophy size={13} /> Earned Badges
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">4</span>
                <span className="text-xs font-bold text-gray-400">/ 5 Unlocked</span>
              </div>
              <p className="text-2xs text-gray-400">Next: &ldquo;System Architect&rdquo; at 3,000 XP</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ════════════ TIME BUDGET SELECTOR: "How much time do you have today?" ════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <Card className="p-6 sm:p-7 bg-card/95 border-card-border shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-cyan-400" />
                <span className="text-2xs uppercase tracking-wider text-cyan-400 font-extrabold">
                  Time-Budget Optimization
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                How much time do you have today?
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Select your available commitment — the AI automatically generates calibrated tasks across DSA, DBMS, Backend, and Revision
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCompleteAllToday}
                className="px-3 py-1 rounded-lg bg-bg-secondary hover:bg-gray-800 border border-gray-700/60 text-2xs font-semibold text-gray-300 transition-colors cursor-pointer"
              >
                Mark All Done
              </button>
              <button
                type="button"
                onClick={handleResetTasks}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-bg-secondary hover:bg-gray-800 border border-gray-700/60 text-2xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>
          </div>

          {/* Time Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIME_OPTIONS.map((t) => {
              const isSelected = selectedTime === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan'
                      : 'bg-bg-secondary/70 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <span
                    className={`text-lg font-black block ${
                      isSelected ? 'text-cyan-300' : 'text-gray-200'
                    }`}
                  >
                    {t}
                  </span>
                  <span className="text-2xs text-gray-500">
                    {t === '1 hour'
                      ? 'Quick Focused Sprint'
                      : t === '2 hours'
                      ? 'Recommended Daily Routine'
                      : t === '3 hours'
                      ? 'Deep Mastery Session'
                      : 'Comprehensive Placement Immersion'}
                  </span>
                </button>
              )
            })}
          </div>

          {/* GENERATED MODULE TASKS (DSA, DBMS, Backend, Revision) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="font-bold text-gray-300">
                Generated Modules ({currentTasks.length} Key Tasks)
              </span>
              <span>Click items to check off completed milestones</span>
            </div>

            <div className="space-y-3">
              {currentTasks.map((task) => {
                const isDone = completedTaskIds.includes(task.id)
                const Icon = task.icon

                return (
                  <motion.div
                    key={task.id}
                    layout
                    onClick={() => toggleTask(task)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-bg-secondary/70 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {/* Left: Checkbox + Module + Info */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Interactive Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition-all shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-bg-primary shadow-glow-cyan'
                            : 'border-gray-600 bg-bg-secondary hover:border-cyan-400'
                        }`}
                      >
                        {isDone && <Check size={13} className="stroke-[3]" />}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-2xs font-extrabold uppercase px-2 py-0.5 rounded border ${
                              task.module === 'DSA'
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                : task.module === 'Backend'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : task.module === 'DBMS'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {task.module}
                          </span>

                          <h4
                            className={`text-sm font-bold transition-all ${
                              isDone ? 'text-gray-300 line-through opacity-80' : 'text-white'
                            }`}
                          >
                            {task.title}
                          </h4>

                          {isDone && (
                            <span className="text-2xs font-extrabold px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              +Done
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed">
                          {task.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right: Duration + XP */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                      <span className="text-2xs text-gray-400 font-mono flex items-center gap-1">
                        <Clock size={11} className="text-cyan-400" />
                        {task.duration}
                      </span>

                      <span className="text-2xs font-black px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                        +{task.xp} XP
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ════════════ GAMIFICATION: Badges & Achievements Section ════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* BADGES SHOWCASE (6 cols) */}
        <div className="lg:col-span-6">
          <Card className="h-full p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Trophy size={17} className="text-amber-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Skill Badges
                </h3>
              </div>
              <Badge variant="cyan">4 Unlocked</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES.map((b) => {
                const Icon = b.icon
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${b.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xs uppercase font-extrabold tracking-wider opacity-70">
                        {b.category}
                      </span>
                      {b.unlocked ? (
                        <span className="text-3xs font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-3xs font-bold text-gray-500">Locked</span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-0.5">
                        <Icon size={14} />
                        {b.name}
                      </h4>
                      <p className="text-3xs text-gray-400 leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* ACHIEVEMENTS PROGRESS (6 cols) */}
        <div className="lg:col-span-6">
          <Card className="h-full p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Award size={17} className="text-purple-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Milestone Achievements
                </h3>
              </div>
              <span className="text-2xs text-gray-500 font-semibold">Tier-1 SDE Milestones</span>
            </div>

            <div className="space-y-3.5">
              {ACHIEVEMENTS.map((ach) => (
                <div
                  key={ach.title}
                  className="p-3.5 rounded-xl bg-bg-secondary/70 border border-gray-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {ach.title}
                    </span>
                    <span className="text-2xs font-mono font-bold text-cyan-300">
                      {ach.reward}
                    </span>
                  </div>

                  <ProgressBar
                    value={ach.percent}
                    variant={ach.completed ? 'green' : 'gradient'}
                    size="xs"
                    animate
                  />

                  <div className="flex items-center justify-between text-3xs text-gray-400">
                    <span>{ach.metric}</span>
                    <span>{ach.completed ? 'Claimed' : `${ach.percent}% Complete`}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
