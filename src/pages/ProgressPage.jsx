import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  Flame,
  Award,
  Zap,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Target,
  Trophy,
  ArrowUpRight,
  BookOpen,
  Code2,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { progressAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const DEFAULT_BADGES = [
  { id: 'welcome', name: 'Welcome Aboard', description: 'Joined AI Career Copilot and setup profile', icon: '🚀', unlocked: true, date: 'Oct 1' },
  { id: 'first-plan', name: 'Master Planner', description: 'Completed first daily focused study plan', icon: '📋', unlocked: true, date: 'Oct 3' },
  { id: 'dsa-warrior', name: 'DSA Warrior', description: 'Solved 50+ DSA graph and tree problems', icon: '⚔️', unlocked: true, date: 'Oct 7' },
  { id: 'streak-5', name: 'Consistency King', description: 'Maintained a 5-day continuous learning streak', icon: '🔥', unlocked: true, date: 'Yesterday' },
  { id: 'interview-ace', name: 'Interview Ace', description: 'Scored 80%+ on an AI technical mock interview', icon: '🎙️', unlocked: false, progress: 85 },
  { id: 'fullstack-dev', name: 'System Architect', description: 'Completed all Week 3 backend roadmap milestones', icon: '🏛️', unlocked: false, progress: 60 },
  { id: 'resume-ats', name: 'ATS Champion', description: 'Achieved an ATS score greater than 80 on resume', icon: '📄', unlocked: false, progress: 76 },
  { id: 'job-hunter', name: 'Precision Hunter', description: 'Analyzed 10 job descriptions and bridged gaps', icon: '🎯', unlocked: false, progress: 40 },
]

const WEEKLY_ACTIVITY = [
  { day: 'Mon', xp: 45, date: 'Oct 2', active: true },
  { day: 'Tue', xp: 60, date: 'Oct 3', active: true },
  { day: 'Wed', xp: 30, date: 'Oct 4', active: true },
  { day: 'Thu', xp: 55, date: 'Oct 5', active: true },
  { day: 'Fri', xp: 50, date: 'Oct 6', active: true },
  { day: 'Sat', xp: 0, date: 'Oct 7', active: false },
  { day: 'Sun', xp: 40, date: 'Today', active: true },
]

const MILESTONES = [
  { id: 1, title: 'Build React + Vite Frontend Foundation', category: 'Frontend', completed: true, xp: '+50 XP', date: 'Oct 2' },
  { id: 2, title: 'Design RESTful Express Backend Architecture', category: 'Backend', completed: true, xp: '+60 XP', date: 'Oct 5' },
  { id: 3, title: 'Complete Operating System Process & Thread Concepts', category: 'CS Fundamentals', completed: true, xp: '+40 XP', date: 'Oct 8' },
  { id: 4, title: 'Integrate Full-Stack API Authentication & MongoDB', category: 'Full-Stack', completed: true, xp: '+70 XP', date: 'Just now' },
  { id: 5, title: 'Deploy Scalable Dockerized Microservice', category: 'DevOps', completed: false, xp: '+80 XP', date: 'Upcoming' },
  { id: 6, title: 'Pass 3 Full-Length Mock SDE Technical Interviews', category: 'Interviews', completed: false, xp: '+100 XP', date: 'Upcoming' },
]

export default function ProgressPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState({
    totalXP: 240,
    level: 3,
    streak: { current: 5, longest: 12 },
    badges: DEFAULT_BADGES,
  })
  const [xpClaimed, setXpClaimed] = useState(false)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await progressAPI.get()
        if (res.success && res.progress) {
          setProgressData((prev) => ({
            ...prev,
            totalXP: res.progress.totalXP ?? prev.totalXP,
            level: res.progress.level ?? prev.level,
            streak: res.progress.streak ?? prev.streak,
          }))
        }
      } catch (err) {
        // Fallback to initial state
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  const currentLevel = progressData.level || 3
  const currentXP = progressData.totalXP || 240
  const xpInCurrentLevel = currentXP % 100
  const xpToNextLevel = 100 - xpInCurrentLevel
  const progressPercent = Math.min(100, Math.max(0, xpInCurrentLevel))

  const handleClaimDailyXP = async () => {
    if (xpClaimed) return
    try {
      const res = await progressAPI.addXP(25, 'Daily Login')
      if (res.success && res.progress) {
        setProgressData((prev) => ({
          ...prev,
          totalXP: res.progress.totalXP,
          level: res.progress.level,
        }))
      } else {
        setProgressData((prev) => ({
          ...prev,
          totalXP: prev.totalXP + 25,
        }))
      }
      setXpClaimed(true)
    } catch (_) {
      setProgressData((prev) => ({
        ...prev,
        totalXP: prev.totalXP + 25,
      }))
      setXpClaimed(true)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp size={20} />
            </span>
            <span className="text-xs uppercase font-semibold tracking-wider text-purple-400">
              Career Gamification & Growth
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Progress & Achievements
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track your skill velocity, maintain streaks, and level up your career readiness.
          </p>
        </div>

        {/* Daily Bonus Claim Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant={xpClaimed ? 'secondary' : 'primary'}
            icon={Zap}
            disabled={xpClaimed}
            onClick={handleClaimDailyXP}
            className="shadow-glow-cyan"
          >
            {xpClaimed ? 'Daily +25 XP Claimed!' : 'Claim Daily Streak Bonus (+25 XP)'}
          </Button>
        </motion.div>
      </div>

      {/* ── Top Level & Stats Cards ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Card */}
        <Card className="bg-gradient-to-br from-card-bg via-card-bg to-purple-950/20 border-purple-500/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Developer Rank</p>
              <h3 className="text-2xl font-black text-white mt-1">Level {currentLevel}</h3>
              <p className="text-xs text-purple-300 mt-0.5 font-semibold">Associate Engineer Tier</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-black text-lg shadow-glow-purple">
              L{currentLevel}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/80">
            <div className="flex justify-between text-2xs text-gray-400 mb-1">
              <span>Level Progress</span>
              <span className="font-semibold text-gray-200">{xpInCurrentLevel}/100 XP</span>
            </div>
            <ProgressBar value={progressPercent} variant="purple" size="sm" />
            <p className="text-3xs text-gray-500 mt-1.5">{xpToNextLevel} XP needed for Level {currentLevel + 1}</p>
          </div>
        </Card>

        {/* Total XP */}
        <Card className="bg-gradient-to-br from-card-bg via-card-bg to-cyan-950/20 border-cyan-500/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Career XP</p>
              <h3 className="text-2xl font-black text-cyan-300 mt-1">{currentXP} XP</h3>
              <p className="text-xs text-cyan-400 mt-0.5 flex items-center gap-1 font-medium">
                <ArrowUpRight size={13} /> +65 XP this week
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
              <Sparkles size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
            <span>Next Milestone:</span>
            <span className="text-cyan-300 font-semibold">300 XP (Level 4)</span>
          </div>
        </Card>

        {/* Learning Streak */}
        <Card className="bg-gradient-to-br from-card-bg via-card-bg to-amber-950/20 border-amber-500/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Active Streak</p>
              <h3 className="text-2xl font-black text-amber-300 mt-1 flex items-center gap-1.5">
                {progressData.streak?.current || 5} Days
                <Flame size={22} className="text-amber-400 fill-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-amber-400 mt-0.5 font-medium">Personal Best: {progressData.streak?.longest || 12} Days</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Flame size={24} className="fill-amber-400/30" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
            <span>Study today to keep it alive!</span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>
        </Card>

        {/* Badges Unlocked */}
        <Card className="bg-gradient-to-br from-card-bg via-card-bg to-emerald-950/20 border-emerald-500/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Badges Unlocked</p>
              <h3 className="text-2xl font-black text-emerald-300 mt-1">4 / 8</h3>
              <p className="text-xs text-emerald-400 mt-0.5 font-medium">50% Completed</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <Award size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
            <span>Next Badge:</span>
            <span className="text-emerald-300 font-semibold">Interview Ace (85%)</span>
          </div>
        </Card>
      </div>

      {/* ── Middle: Weekly Activity & Daily Streak Calendar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly XP Activity */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <Card.Title className="flex items-center gap-2">
                  <Calendar size={18} className="text-cyan-400" />
                  Weekly Learning Consistency
                </Card.Title>
                <Card.Description>Daily study habits and XP earned over the last 7 days</Card.Description>
              </div>
              <Badge variant="cyan" dot>7-Day Rolling</Badge>
            </div>
          </Card.Header>

          {/* Activity Bars */}
          <div className="pt-4 grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 border-b border-gray-800 pb-4">
            {WEEKLY_ACTIVITY.map((item, idx) => {
              const heightPct = Math.max(15, (item.xp / 60) * 100)
              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-2xs text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    {item.xp} XP
                  </span>
                  <div className="w-full max-w-[42px] bg-gray-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-32 relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`w-full rounded-t-md ${
                        item.active
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300'
                          : 'bg-gray-700/50'
                      }`}
                    />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${item.active ? 'text-gray-200' : 'text-gray-500'}`}>
                    {item.day}
                  </span>
                  <span className="text-3xs text-gray-500">{item.date}</span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Study Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-700" /> Rest Day
              </span>
            </div>
            <span className="text-gray-300 font-medium">Average: 45 min/day</span>
          </div>
        </Card>

        {/* Skill Velocity Overview */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Target size={18} className="text-purple-400" />
              Skill Velocity
            </Card.Title>
            <Card.Description>Improvement over last 30 days</Card.Description>
          </Card.Header>

          <div className="space-y-4 pt-2">
            {[
              { skill: 'DSA & Algorithms', gain: '+6%', level: 85, color: 'cyan' },
              { skill: 'Development', gain: '+6%', level: 78, color: 'purple' },
              { skill: 'Projects & Systems', gain: '+4%', level: 72, color: 'emerald' },
              { skill: 'CS Fundamentals', gain: '+6%', level: 64, color: 'amber' },
              { skill: 'Interview Readiness', gain: '+5%', level: 80, color: 'cyan' },
            ].map((s) => (
              <div key={s.skill} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300 font-medium">{s.skill}</span>
                  <span className="text-emerald-400 font-bold">{s.gain}</span>
                </div>
                <ProgressBar value={s.level} variant={s.color} size="sm" />
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
            <Trophy size={16} className="text-purple-400 shrink-0" />
            <span>Top 15% momentum among 3rd year CS students this month!</span>
          </div>
        </Card>
      </div>

      {/* ── Badges & Achievements Grid ─────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award size={20} className="text-amber-400" />
              Achievements & Badges
            </h2>
            <p className="text-xs text-gray-400">Unlock special badges as you hit key career preparation milestones.</p>
          </div>
          <span className="text-xs font-semibold text-gray-400">4 Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEFAULT_BADGES.map((b) => (
            <motion.div
              key={b.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all ${
                b.unlocked
                  ? 'bg-card-bg/90 border-cyan-500/30 hover:border-cyan-400/50 shadow-sm'
                  : 'bg-card-bg/40 border-gray-800/80 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl border ${
                  b.unlocked
                    ? 'bg-cyan-500/10 border-cyan-500/30 shadow-glow-cyan'
                    : 'bg-gray-800/60 border-gray-700/60 grayscale'
                }`}>
                  {b.icon}
                </div>
                {b.unlocked ? (
                  <Badge variant="cyan" size="xs">Unlocked</Badge>
                ) : (
                  <Badge variant="default" size="xs">Locked</Badge>
                )}
              </div>

              <h4 className={`text-sm font-bold ${b.unlocked ? 'text-white' : 'text-gray-400'}`}>
                {b.name}
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {b.description}
              </p>

              {b.unlocked ? (
                <div className="mt-3 pt-2 border-t border-gray-800/80 flex items-center justify-between text-2xs text-gray-500">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck size={12} /> Claimed
                  </span>
                  <span>{b.date}</span>
                </div>
              ) : (
                <div className="mt-3 pt-2 border-t border-gray-800/80 space-y-1">
                  <div className="flex justify-between text-3xs text-gray-400">
                    <span>Progress</span>
                    <span>{b.progress}%</span>
                  </div>
                  <ProgressBar value={b.progress} variant="purple" size="xs" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Milestones Timeline ───────────────────────────── */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <Card.Title className="flex items-center gap-2">
                <Target size={18} className="text-emerald-400" />
                Milestone Timeline
              </Card.Title>
              <Card.Description>Key engineering milestones completed along your road to SDE</Card.Description>
            </div>
            <Badge variant="emerald" dot>4 Completed</Badge>
          </div>
        </Card.Header>

        <div className="divide-y divide-gray-800/70 pt-2">
          {MILESTONES.map((m) => (
            <div key={m.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.completed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-800/80 text-gray-500 border border-gray-700/60'
                }`}>
                  {m.completed ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 rounded-full bg-gray-600" />}
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${m.completed ? 'text-white' : 'text-gray-400'}`}>
                    {m.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xs text-cyan-400 font-medium">{m.category}</span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-2xs text-gray-500">{m.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={m.completed ? 'purple' : 'default'} size="sm">
                  {m.xp}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
