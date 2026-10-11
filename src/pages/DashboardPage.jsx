/**
 * DashboardPage — Overview
 * Premium, data-dense dashboard. Professional SaaS aesthetic.
 * Uses centralized mock data. No duplicate greetings.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Flame,
  Target,
  FileText,
  Briefcase,
  Mic2,
  Bot,
  Play,
  Check,
  Code2,
  Layers,
  Cpu,
  FileCheck,
  MessageSquare,
  Compass,
  Zap,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import ScoreRing from '../components/charts/ScoreRing'
import {
  mockReadiness,
  mockSkills,
  mockCareerGaps,
  mockNextAction,
  mockRoadmap,
  mockJobMatches,
  mockActivity,
  mockUser,
} from '../data/mockData'

// ─── Helpers ────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const skillIcons = {
  dsa:            Code2,
  development:    Layers,
  projects:       Cpu,
  'cs-fundamentals': Zap,
  resume:         FileCheck,
  communication:  MessageSquare,
}

const skillBarColors = {
  blue:    'blue',
  indigo:  'blue',
  purple:  'purple',
  amber:   'amber',
  teal:    'cyan',
  cyan:    'cyan',
}

// Priority badge styles
const priorityMap = {
  Critical: { label: 'Critical', cls: 'bg-red-500/10 border-red-500/20 text-red-400' },
  High:     { label: 'High',     cls: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  Medium:   { label: 'Medium',   cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
}

// Activity type icon colors
const activityColors = {
  dsa:       'text-blue-400 bg-blue-500/10',
  module:    'text-teal-400 bg-teal-500/10',
  resume:    'text-purple-400 bg-purple-500/10',
  interview: 'text-amber-400 bg-amber-500/10',
}

// ─── Stagger animation helper ────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.25, delay, ease: [0.4, 0, 0.2, 1] },
})

// ─── Sub-components ──────────────────────────────────────────

/** Section header with optional right link */
function SectionHeader({ title, subtitle, linkLabel, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-base font-semibold text-gray-100">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {linkLabel && linkTo && (
        <Link
          to={linkTo}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-base flex items-center gap-1"
        >
          {linkLabel}
          <ChevronRight size={12} />
        </Link>
      )}
    </div>
  )
}

/** Inline stat chip */
function StatChip({ icon: Icon, label, value, color = 'text-gray-300' }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs">
      {Icon && <Icon size={13} className="text-gray-500" aria-hidden="true" />}
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const [taskStarted, setTaskStarted] = useState(false)

  const firstName = (user?.name || mockUser.name).split(' ')[0]
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })
  const topJob = mockJobMatches[0]

  return (
    <div className="dashboard-overview px-4 sm:px-6 lg:px-7 pb-8 max-w-[1600px] mx-auto space-y-3">

      {/* ══════════════ PAGE HEADER ══════════════ */}
      <motion.div {...fadeUp(0)} className="dashboard-welcome relative overflow-hidden rounded-b-2xl px-5 sm:px-7 pt-5 pb-4">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-start justify-between gap-4">
          <div>
            <p className="text-xs text-blue-100/65 mb-1">{today}</p>
            <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-sm sm:text-base text-blue-100/80 mt-1">
              Let&apos;s move one step closer to your dream career.
            </p>
          </div>
          <div className="dashboard-quote hidden xl:block max-w-[260px] rounded-xl px-4 py-3 text-sm text-blue-50 leading-relaxed">
            “Small consistent steps today lead to big opportunities tomorrow.”
          </div>
        </div>
        <div className="relative z-10 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-[760px]">
          <div className="dashboard-stat"><span>Current Goal</span><strong>SDE at {mockUser.targetCompany.split('/')[0].trim()}</strong></div>
          <div className="dashboard-stat"><span>CGPA</span><strong>8.66</strong></div>
          <div className="dashboard-stat"><span>DSA Problems</span><strong>200+</strong></div>
          <div className="dashboard-stat"><span>Roadmap Progress</span><strong>Day {mockRoadmap.currentDay} / {mockRoadmap.totalDays}</strong></div>
        </div>
        <div className="absolute right-6 top-5 z-10 hidden sm:flex items-center gap-2">
          <StatChip icon={Flame} label="Streak" value={`${mockUser.streakDays} days`} color="text-amber-300" />
          <Link to="/onboarding" className="dashboard-update-goals"><Target size={13} /> Update Goals</Link>
        </div>
      </motion.div>

      {/* ══════════════ HERO ROW ══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ── Career Readiness Card (7 cols) ── */}
        <motion.div {...fadeUp(0.04)} className="lg:col-span-7">
          <Card className="h-full p-6 relative overflow-hidden border-white/[0.08]">
            {/* Subtle ambient — top right only */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 flex flex-col h-full gap-5">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">Placement Calibration</p>
                  <h2 className="text-base font-semibold text-gray-100 mt-0.5">Career Readiness</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" aria-hidden="true" />
                  On Track
                </span>
              </div>

              {/* Score + insights row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <ScoreRing
                  value={mockReadiness.score}
                  max={mockReadiness.maxScore}
                  size={132}
                  strokeWidth={9}
                  color="blue"
                  label="Readiness"
                  animate
                />

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                    <TrendingUp size={12} aria-hidden="true" />
                    {mockReadiness.trend}
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    You are in the{' '}
                    <strong className="text-white font-semibold">
                      top {mockReadiness.topPercentile}%
                    </strong>{' '}
                    of candidates targeting{' '}
                    <strong className="text-gray-200">{mockUser.targetRole}</strong>.
                    Closing backend and system design gaps will push your score above 90.
                  </p>

                  {/* Metadata chips */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                    {[
                      `Target: ${mockUser.targetCompany}`,
                      `Day ${mockReadiness.sprintDay} / ${mockReadiness.sprintTotal}`,
                    ].map(t => (
                      <span key={t} className="text-2xs px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-gray-500">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Placement probability:{' '}
                  <strong className="text-teal-400">{mockReadiness.placementProbability}%</strong>
                </span>
                <Link
                  to="/career-roadmap"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-base"
                >
                  Detailed roadmap <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ── Today's Priority / Next Best Action (5 cols) ── */}
        <motion.div {...fadeUp(0.07)} className="lg:col-span-5">
          <Card className="h-full p-6 flex flex-col gap-4 relative overflow-hidden border-white/[0.08]">
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 flex flex-col flex-1 gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                  <Sparkles size={11} aria-hidden="true" />
                  Today&apos;s Priority
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={11} aria-hidden="true" />
                  <span>{mockNextAction.estimatedMinutes} min</span>
                </div>
              </div>

              {/* Task */}
              <div className="flex-1">
                <p className="section-label mb-1">Your next best action</p>
                <h3 className="text-base font-semibold text-white leading-snug">
                  {mockNextAction.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {mockNextAction.description}
                </p>
              </div>

              {/* Impact box */}
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.07] px-3 py-2.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Target area</span>
                  <span className="text-gray-300 font-medium">{mockNextAction.category}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Readiness impact</span>
                  <span className="text-teal-400 font-semibold">+{mockNextAction.readinessImpact} pts</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setTaskStarted(s => !s)}
                className={`
                  w-full flex items-center justify-center gap-2 h-10 rounded-lg
                  text-sm font-semibold transition-base cursor-pointer
                  ${taskStarted
                    ? 'bg-teal-500/10 border border-teal-500/25 text-teal-400'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-btn-primary'
                  }
                `}
                aria-pressed={taskStarted}
              >
                {taskStarted ? (
                  <>
                    <Check size={15} aria-hidden="true" />
                    Task started
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" aria-hidden="true" />
                    Start Task
                  </>
                )}
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ══════════════ SKILL OVERVIEW ══════════════ */}
      <motion.div {...fadeUp(0.1)}>
        <SectionHeader
          title="Skill Overview"
          subtitle="Proficiency across key placement dimensions"
          linkLabel="Skill tree"
          linkTo="/career-roadmap"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mockSkills.map((skill, idx) => {
            const Icon = skillIcons[skill.id] || Zap
            return (
              <motion.div key={skill.id} {...fadeUp(0.1 + idx * 0.03)}>
                <Card className="p-4 h-full flex flex-col gap-3 hover:border-white/[0.12] transition-base">
                  <div className="flex items-center justify-between">
                    <div className="h-7 w-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                      <Icon size={14} className="text-gray-400" aria-hidden="true" />
                    </div>
                    <span className="text-base font-bold text-white tabular-nums">{skill.score}</span>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-200">{skill.name}</p>
                    <p className="text-2xs text-gray-600 mt-0.5 leading-tight line-clamp-2">{skill.description}</p>
                  </div>

                  <ProgressBar value={skill.score} variant={skillBarColors[skill.color] || 'blue'} size="sm" animate />
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ══════════════ MIDDLE ROW ══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ── Career Gaps (7 cols) ── */}
        <motion.div {...fadeUp(0.13)} className="lg:col-span-7">
          <Card className="h-full p-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.07] mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Top Career Gaps</h2>
                <p className="text-xs text-gray-500 mt-0.5">High-impact deficiencies for your target role</p>
              </div>
              <Badge variant="blue">{mockCareerGaps.length} detected</Badge>
            </div>

            <div className="space-y-3">
              {mockCareerGaps.map((gap, i) => {
                const p = priorityMap[gap.priority] || priorityMap.Medium
                return (
                  <div
                    key={gap.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xs text-gray-600 font-mono font-bold">0{i + 1}</span>
                        <span className="text-sm font-semibold text-gray-100">{gap.name}</span>
                        <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${p.cls}`}>
                          {p.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pl-5">
                        {gap.description}
                      </p>
                      <div className="pl-5 flex items-center gap-3 text-2xs text-gray-600">
                        <span className="text-teal-500 font-medium">{gap.impact}</span>
                        <span>·</span>
                        <span>~{gap.timeToFix} to close</span>
                      </div>
                    </div>

                    <Link to="/career-roadmap" className="flex-shrink-0">
                      <Button variant="ghost" size="xs" iconRight={ArrowRight}>
                        Roadmap
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className="pt-3 mt-3 border-t border-white/[0.07] flex items-center justify-between text-xs text-gray-600">
              <span>Closing gaps increases mock interview pass rate ~42%</span>
              <Link to="/mentor" className="text-blue-400 hover:text-blue-300 transition-base font-medium">
                Ask Mentor →
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* ── Roadmap + Job Match (5 cols) ── */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* Roadmap progress */}
          <motion.div {...fadeUp(0.15)}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center">
                    <Compass size={14} className="text-blue-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-100">30-Day Sprint</p>
                    <p className="text-2xs text-gray-600">Day {mockRoadmap.currentDay} of {mockRoadmap.totalDays}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-blue-400 tabular-nums">
                  {mockRoadmap.completionPercent}%
                </span>
              </div>

              <ProgressBar value={mockRoadmap.completionPercent} variant="blue" size="md" animate />

              <div className="mt-4 grid grid-cols-4 gap-1.5">
                {mockRoadmap.phases.map(phase => (
                  <div
                    key={phase.id}
                    className={`
                      text-center py-1.5 px-1 rounded-lg text-2xs font-semibold border transition-base
                      ${phase.status === 'completed'
                        ? 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                        : phase.status === 'active'
                        ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                        : 'bg-white/[0.03] border-white/[0.07] text-gray-600'
                      }
                    `}
                    aria-label={`${phase.label}: ${phase.status}`}
                  >
                    {phase.status === 'completed' && '✓ '}
                    {phase.status === 'active' && '● '}
                    {phase.label}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Top job match */}
          <motion.div {...fadeUp(0.18)}>
            <Card className="p-5 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="section-label mb-0.5">Latest Job Match</p>
                  <h3 className="text-sm font-semibold text-gray-100">{topJob.role}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{topJob.company} · {topJob.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-white tabular-nums leading-none">{topJob.matchScore}%</p>
                  <p className="text-2xs text-gray-600 mt-0.5">Match</p>
                </div>
              </div>

              <ProgressBar value={topJob.matchScore} variant="purple" size="sm" animate />

              <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <p className="text-2xs font-semibold text-teal-400 uppercase tracking-wider mb-1.5">Matched</p>
                  <ul className="space-y-1">
                    {topJob.matchedSkills.slice(0, 3).map(s => (
                      <li key={s} className="flex items-center gap-1.5 text-gray-400">
                        <CheckCircle2 size={11} className="text-teal-500 flex-shrink-0" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-2xs font-semibold text-red-400 uppercase tracking-wider mb-1.5">Missing</p>
                  <ul className="space-y-1">
                    {topJob.missingSkills.map(s => (
                      <li key={s} className="flex items-center gap-1.5 text-gray-500">
                        <XCircle size={11} className="text-red-400/70 flex-shrink-0" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link to="/job-match" className="block mt-3">
                <Button variant="outline" size="sm" fullWidth iconRight={ArrowRight}>
                  Full breakdown
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ══════════════ BOTTOM ROW ══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ── Recent Activity (6 cols) ── */}
        <motion.div {...fadeUp(0.2)} className="lg:col-span-6">
          <Card className="h-full p-5">
            <SectionHeader title="Recent Activity" subtitle="Last 48 hours" />
            <div className="space-y-2">
              {mockActivity.map(item => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.09] transition-base"
                >
                  <div className={`mt-0.5 h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0 ${activityColors[item.type] || activityColors.module}`}>
                    <Check size={12} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{item.detail}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-2xs text-gray-600 font-mono">{item.time}</span>
                    <p className="text-2xs text-teal-500 font-semibold mt-0.5">+{item.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ── Quick Actions (6 cols) ── */}
        <motion.div {...fadeUp(0.22)} className="lg:col-span-6">
          <Card className="h-full p-5">
            <SectionHeader title="Quick Actions" subtitle="Jump to a tool" />
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { title: 'Resume',    desc: 'ATS score & keywords',    icon: FileText,  path: '/resume-analyzer' },
                { title: 'Job Match', desc: 'Match skills to JD',      icon: Briefcase, path: '/job-match'        },
                { title: 'Interview', desc: 'AI mock voice test',       icon: Mic2,      path: '/mock-interview'   },
                { title: 'AI Mentor', desc: 'Career roadmap advice',    icon: Bot,       path: '/mentor'          },
              ].map(action => {
                const Icon = action.icon
                return (
                  <Link key={action.title} to={action.path}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] transition-base cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-7 w-7 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
                          <Icon size={14} className="text-blue-400" aria-hidden="true" />
                        </div>
                        <ArrowRight size={12} className="text-gray-600" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-semibold text-gray-200">{action.title}</p>
                      <p className="text-2xs text-gray-600 mt-0.5">{action.desc}</p>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Career Twin call-to-action */}
            <Link to="/career-twin" className="block mt-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/15 transition-base cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Zap size={15} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-300">View Career Twin</p>
                    <p className="text-2xs text-blue-400/60">Score: {mockReadiness.score}/100 · {mockReadiness.status}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-blue-400/60 group-hover:text-blue-400 transition-base" aria-hidden="true" />
              </div>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
