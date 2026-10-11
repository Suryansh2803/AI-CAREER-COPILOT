import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  motion,
  useInView,
  AnimatePresence,
} from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Map,
  FileText,
  Briefcase,
  Mic2,
  BarChart3,
  Check,
  ChevronRight,
  Zap,
  Star,
  TrendingUp,
  Users,
  Mail,
  Plus,
  X,
  Search,
  Bell,
  CalendarDays,
  ArrowUpRight,
  Code2,
  MoreHorizontal,
} from 'lucide-react'

/* ── GitHub SVG (removed from Lucide v0.400+) ──────────────── */
function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

/* ── Animated Number Counter ────────────────────────────────── */
/* ── Single animated skill bar (hooks at top level) ─────────── */
function SkillBar({ label, value, color, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1.5 text-sm">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-500 text-xs">{value}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  )
}

/* ── Scroll-reveal section wrapper ─────────────────────────── */
function FadeSection({ children, className = '', id }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.section>
  )
}

/* ── AI Orb Visualization ───────────────────────────────────── */
function ProductPreview() {
  const skills = [
    ['DSA', 85, 'bg-cyan-400'],
    ['Development', 78, 'bg-blue-500'],
    ['Projects', 72, 'bg-violet-500'],
    ['CS Fundamentals', 64, 'bg-cyan-500'],
    ['Communication', 68, 'bg-indigo-500'],
  ]

  return (
    <div className="landing-preview-wrap relative mx-auto w-full max-w-[900px]">
      <motion.div
        className="landing-product-window"
        initial={{ opacity: 0, y: 22, rotateY: -8 }}
        animate={{ opacity: 1, y: 0, rotateY: -5 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="landing-product-topbar">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center"><Zap size={13} fill="currentColor" /></span>
            <span className="font-semibold text-[12px] text-white">Career Copilot</span>
          </div>
          <div className="landing-preview-search"><Search size={13} /><span>Search anything...</span><kbd>⌘ K</kbd></div>
          <div className="flex items-center gap-3 text-slate-400"><Bell size={14} /><span className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-200 to-rose-400 grid place-items-center text-[9px] font-bold text-slate-950">SD</span><span className="text-[10px] text-slate-200">Suryansh</span><ChevronRight size={13} /></div>
        </div>

        <div className="landing-product-body">
          <aside className="landing-product-sidebar">
            <div className="landing-side-active"><BarChart3 size={13} /> Overview</div>
            <div><Brain size={13} /> Career Twin</div>
            <div><Target size={13} /> What-If</div>
            <div><Map size={13} /> Roadmap</div>
            <div><FileText size={13} /> Resume Analyzer</div>
            <div><Briefcase size={13} /> Job Match</div>
            <div><Mic2 size={13} /> Mock Interview</div>
            <div><TrendingUp size={13} /> Progress</div>
          </aside>

          <div className="landing-product-content">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div><p className="text-[18px] font-bold text-white">Good Morning, Suryansh 👋</p><p className="text-[10px] text-slate-400 mt-1">Let’s move one step closer to your dream career.</p></div>
              <span className="landing-preview-chip"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> On track</span>
            </div>

            <div className="grid grid-cols-[1.1fr_.9fr] gap-3 mb-3">
              <div className="landing-preview-card">
                <div className="flex items-center justify-between"><span className="text-[11px] font-semibold text-slate-100">Career Readiness</span><ArrowUpRight size={13} className="text-slate-500" /></div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="landing-readiness-ring"><div><strong>78</strong><span>/100</span></div></div>
                  <div className="flex-1 space-y-2.5">{skills.map(([name, value, color]) => <div key={name}><div className="flex justify-between text-[8px] text-slate-400 mb-1"><span>{name}</span><span>{value}%</span></div><div className="h-1 rounded-full bg-slate-800 overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div></div>)}</div>
                </div>
                <p className="mt-2 text-[8px] text-emerald-400">↑ +6 this month</p>
              </div>

              <div className="landing-preview-card">
                <div className="flex justify-between"><span className="text-[11px] font-semibold text-slate-100">Job Match</span><Briefcase size={13} className="text-blue-400" /></div>
                <p className="text-[9px] text-slate-400 mt-3">Amazon · SDE Intern</p>
                <div className="flex items-baseline gap-1 mt-1"><strong className="text-[25px] leading-none text-cyan-300">84%</strong><span className="text-[8px] text-slate-500">match score</span></div>
                <div className="h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden"><div className="h-full w-[84%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" /></div>
                <p className="text-[8px] text-slate-400 mt-3 mb-1.5">Matched Skills</p>
                <div className="flex gap-1 flex-wrap">{['DSA', 'C++', 'SQL', 'Git'].map((skill) => <span key={skill} className="landing-skill-chip">{skill}</span>)}</div>
                <p className="text-[8px] text-slate-400 mt-2 mb-1.5">Missing Skills</p>
                <div className="flex gap-1 flex-wrap">{['AWS', 'System Design', 'Docker'].map((skill) => <span key={skill} className="landing-skill-chip landing-skill-missing">{skill}</span>)}</div>
              </div>
            </div>

            <div className="grid grid-cols-[1.1fr_.9fr] gap-3">
              <div className="landing-preview-card flex items-center gap-3">
                <div className="landing-preview-icon"><Code2 size={18} /></div>
                <div className="min-w-0 flex-1"><p className="text-[8px] font-bold tracking-[.14em] text-cyan-300 uppercase">Today’s Priority</p><p className="text-[11px] font-semibold text-white mt-1">Build a REST API with Node.js</p><p className="text-[8px] text-slate-400 mt-1"><CalendarDays size={9} className="inline mr-1" />90 minutes · Backend Development</p><div className="mt-2.5 inline-flex rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 text-[8px] font-semibold text-white">Start Task <ArrowRight size={9} className="ml-1" /></div></div>
              </div>
              <div className="landing-preview-card">
                <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-slate-100">30-Day Roadmap</span><MoreHorizontal size={14} className="text-slate-400" /></div>
                <div className="flex items-center justify-between mt-3"><span className="text-[8px] text-slate-400">Day 18 / 30</span><span className="text-[8px] text-cyan-300">60%</span></div>
                <div className="h-1.5 rounded-full bg-slate-800 mt-1.5 overflow-hidden"><div className="h-full w-3/5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" /></div>
                <div className="flex gap-1 mt-3">{Array.from({ length: 10 }, (_, i) => <span key={i} className={`h-4 w-4 rounded-full grid place-items-center ${i < 6 ? 'bg-emerald-400 text-slate-950' : 'border border-slate-700 text-slate-600'}`}>{i < 6 ? <Check size={9} /> : ''}</span>)}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="landing-float-card landing-float-roadmap"><CalendarDays size={21} className="text-cyan-300" /><div><strong>90 Days</strong><span>Personalized Roadmap</span></div></div>
      <div className="landing-float-card landing-float-skills"><BarChart3 size={22} className="text-blue-300" /><div><strong>200+</strong><span>Skills &amp; Problems</span></div></div>
      <div className="landing-float-card landing-float-readiness"><Target size={20} className="text-violet-300" /><div><strong>78%</strong><span>Career Readiness</span></div></div>
      <div className="landing-float-card landing-float-match"><Briefcase size={20} className="text-violet-300" /><div><strong>84%</strong><span>Job Match</span></div></div>
    </div>
  )
}

/* ── Radar Chart (SVG) ──────────────────────────────────────── */
function SkillRadar({ skills }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const cx = 120, cy = 120, r = 85
  const n = skills.length

  const axisPoints = skills.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })

  const dataPoints = skills.map((s, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const rr = (s.value / 100) * r
    return { x: cx + rr * Math.cos(angle), y: cy + rr * Math.sin(angle) }
  })

  const polyline = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div ref={ref} className="flex justify-center">
      <svg width={240} height={240} viewBox="0 0 240 240">
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <polygon
            key={t}
            points={axisPoints
              .map((p) => `${cx + (p.x - cx) * t},${cy + (p.y - cy) * t}`)
              .join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {axisPoints.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {/* Data fill */}
        <motion.polygon
          points={polyline}
          fill="rgba(6,182,212,0.12)"
          stroke="#22d3ee"
          strokeWidth="2"
          initial={{ scale: 0, originX: cx, originY: cy }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* Dots */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#22d3ee"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
          />
        ))}
        {/* Labels */}
        {skills.map((s, i) => {
          const ap = axisPoints[i]
          const lx = cx + (ap.x - cx) * 1.25
          const ly = cy + (ap.y - cy) * 1.25
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#9ca3af"
              fontSize="10"
              fontFamily="Inter, sans-serif"
            >
              {s.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

/* ── What-If Simulator ──────────────────────────────────────── */
const SKILL_OPTIONS = [
  { id: 'backend',       label: 'Backend',       boost: 4 },
  { id: 'system-design', label: 'System Design', boost: 5 },
  { id: 'sql',           label: 'SQL',           boost: 3 },
  { id: 'cloud',         label: 'Cloud (AWS)',   boost: 4 },
  { id: 'ml',            label: 'ML Basics',     boost: 3 },
  { id: 'docker',        label: 'Docker',        boost: 2 },
]
const BASE = 78

/* ── Circular progress ring ─────────────────────────────────── */
function Ring({ value, label, gradient = false }) {
  const circumference = 2 * Math.PI * 54
  const dash = (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
      <div className="relative h-28 w-28 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={gradient ? 'url(#ringGrad)' : '#22d3ee'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            initial={false}
            animate={{ strokeDasharray: `${dash} ${circumference}` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <motion.span
          key={value}
          className={`text-3xl font-black ${gradient ? 'gradient-text' : 'text-white'}`}
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {value}
        </motion.span>
      </div>
      <p className="text-xs text-gray-500">Career Readiness</p>
    </div>
  )
}

function WhatIfSimulator() {
  const [selected, setSelected] = useState([])

  const boost = selected.reduce(
    (acc, id) => acc + (SKILL_OPTIONS.find((s) => s.id === id)?.boost ?? 0),
    0
  )
  const projected = Math.min(BASE + boost, 99)

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    )

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      {/* Controls */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-1.5">
          Select up to 3 skills to add
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          See how learning new skills boosts your career readiness score instantly.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {SKILL_OPTIONS.map((skill) => {
            const active = selected.includes(skill.id)
            return (
              <button
                key={skill.id}
                onClick={() => toggle(skill.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-bg-secondary border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }`}
              >
                {active ? <Check size={13} /> : <Plus size={13} />}
                {skill.label}
                {active && (
                  <span className="text-cyan-400 text-xs">+{skill.boost}%</span>
                )}
              </button>
            )
          })}
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="mt-4 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
          >
            <X size={12} /> Clear selection
          </button>
        )}
      </div>

      {/* Score display */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-end justify-center gap-8 w-full">
          <Ring value={BASE} label="Current" />

          {/* Arrow */}
          <div className="pb-8">
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight size={28} className="text-cyan-400/60" />
            </motion.div>
          </div>

          <Ring value={projected} label="Projected" gradient />
        </div>

        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              key="boost"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="text-center"
            >
              <p className="text-emerald-400 font-bold text-xl">
                +{projected - BASE}% boost
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                by learning {selected.length} skill{selected.length > 1 ? 's' : ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── STATIC DATA ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Brain,
    title: 'AI Career Twin',
    desc: 'A digital persona that mirrors your skills and goals — continuously updated as you grow.',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    border: 'border-cyan-500/20',
    hoverGlow: 'from-cyan-500/10 to-transparent',
  },
  {
    icon: BarChart3,
    title: 'Skill Gap Analysis',
    desc: 'AI identifies what is missing between where you are and your dream role.',
    iconBg: 'bg-purple-500/15 text-purple-400',
    border: 'border-purple-500/20',
    hoverGlow: 'from-purple-500/10 to-transparent',
  },
  {
    icon: Map,
    title: 'Personalized Roadmap',
    desc: 'A step-by-step, AI-curated plan with milestones and timelines tailored to you.',
    iconBg: 'bg-blue-500/15 text-blue-400',
    border: 'border-blue-500/20',
    hoverGlow: 'from-blue-500/10 to-transparent',
  },
  {
    icon: FileText,
    title: 'Resume Analyzer',
    desc: 'Instant ATS scoring, keyword optimization, and actionable improvement suggestions.',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    border: 'border-cyan-500/20',
    hoverGlow: 'from-cyan-500/10 to-transparent',
  },
  {
    icon: Briefcase,
    title: 'Job Match',
    desc: 'Smart job recommendations scored against your unique profile — no more guesswork.',
    iconBg: 'bg-purple-500/15 text-purple-400',
    border: 'border-purple-500/20',
    hoverGlow: 'from-purple-500/10 to-transparent',
  },
  {
    icon: Mic2,
    title: 'AI Mock Interview',
    desc: 'Practice with role-specific AI interviewers and get instant feedback on every answer.',
    iconBg: 'bg-blue-500/15 text-blue-400',
    border: 'border-blue-500/20',
    hoverGlow: 'from-blue-500/10 to-transparent',
  },
]

const SKILL_BARS = [
  { label: 'DSA',             value: 85, color: 'bg-cyan-500' },
  { label: 'Development',     value: 78, color: 'bg-purple-500' },
  { label: 'Projects',        value: 72, color: 'bg-blue-500' },
  { label: 'CS Fundamentals', value: 64, color: 'bg-cyan-400' },
]

const RADAR_SKILLS = [
  { label: 'DSA',      value: 85 },
  { label: 'Dev',      value: 78 },
  { label: 'Projects', value: 72 },
  { label: 'CS Core',  value: 64 },
  { label: 'Comm.',    value: 70 },
]

const HOW_STEPS = [
  { num: '01', title: 'Build Profile',         desc: 'Tell us your skills, goals, experience, and target role in minutes.' },
  { num: '02', title: 'AI Analyzes You',        desc: 'Our AI creates your Career Twin — a deep understanding of where you stand.' },
  { num: '03', title: 'Discover Skill Gaps',    desc: 'See exactly what separates you from your dream company or role.' },
  { num: '04', title: 'Follow Your Roadmap',    desc: 'A personalized day-by-day action plan with resources, problems, and projects.' },
  { num: '05', title: 'Become Placement Ready', desc: 'Achieve a 90%+ career score and land the offer you deserve.' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.4, 0, 0.2, 1] } },
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate()
  const { loginDemo } = useAuth()

  const enterDemo = () => {
    loginDemo()
    navigate('/dashboard')
  }

  return (
    <div className="landing-page relative overflow-hidden">

      {/* ╔══════════════════════════════════════════════════════╗
          ║  HERO                                                ║
          ╚══════════════════════════════════════════════════════╝ */}
      <section className="landing-hero relative flex items-center px-5 sm:px-8">
        {/* Grid + ambient glows */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

        <div className="relative max-w-[1510px] mx-auto w-full grid lg:grid-cols-[.82fr_1.18fr] gap-8 xl:gap-12 items-center">
          {/* ── Left copy ── */}
          <div>
            {/* Pill */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/35 text-slate-100 text-sm font-medium mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
              </span>
              ✨ AI-Powered Career Mentor for Students
            </motion.div>

            {/* H1 */}
            <motion.h1
              className="landing-headline text-[clamp(3.1rem,5.05vw,5rem)] font-bold text-white leading-[1.03] tracking-[-.045em] mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <span className="block">Turn Your Career</span>
              <span className="block">Goals Into a</span>
              <span className="block text-cyan-400">Clear Roadmap.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              className="text-[16px] sm:text-[17px] text-slate-300/85 leading-[1.55] mb-8 max-w-[535px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              AI Career Copilot analyzes your skills, resume, projects and career goals
              to create a personalized path toward placement readiness.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="landing-primary-cta inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm text-white"
                >
                  <Brain size={17} />
                  Build My Career Twin
                  <ArrowRight size={15} />
                </motion.button>
              </Link>
              <motion.button
                  type="button"
                  onClick={enterDemo}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm bg-slate-950/30 border border-slate-400/35 hover:border-slate-200/70 text-slate-100 transition-all duration-200"
                >
                  Explore Demo
                  <ChevronRight size={15} />
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex flex-wrap items-center gap-5 text-xs text-slate-300/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {[
                { icon: Users, label: 'Trusted by 50K+ students' },
                { icon: Star,  label: '4.9 / 5 Rating' },
                { icon: Check, label: 'Free to Start' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <item.icon size={13} className="text-cyan-400/70" />
                  {item.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: product preview ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <ProductPreview />
          </motion.div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  FEATURES                                            ║
          ╚══════════════════════════════════════════════════════╝ */}
      <FadeSection className="landing-features px-4 sm:px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
              Everything You Need to Become Placement Ready
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto">
              Powerful AI tools built for students, designed for real results.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`relative group h-full bg-slate-950/65 border border-white/[0.08] ${f.border} rounded-2xl p-5 overflow-hidden cursor-default`}
                >
                  {/* Hover glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${f.hoverGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                  />
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl ${f.iconBg} mb-3`}>
                      <f.icon size={22} />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </FadeSection>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  CAREER TWIN SHOWCASE                                ║
          ╚══════════════════════════════════════════════════════╝ */}
      <FadeSection className="py-24 px-4 sm:px-6 bg-bg-secondary/40" id="career-twin">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: radar + bars */}
            <div>
              <SkillRadar skills={RADAR_SKILLS} />
              <div className="mt-8 space-y-4">
                {SKILL_BARS.map((bar, i) => (
                  <SkillBar
                    key={bar.label}
                    label={bar.label}
                    value={bar.value}
                    color={bar.color}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Right: copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-widest mb-6">
                <Brain size={12} /> Career Twin
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Your AI understands<br />
                <span className="gradient-text">exactly where you stand.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Your Career Twin continuously analyzes your preparation and tells you
                what to do next — no more guessing, no more wasted effort.
              </p>

              {/* Readiness card */}
              <div className="glass border border-card-border rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-300">Career Readiness</span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <TrendingUp size={12} /> +12 this week
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-black gradient-text">78</span>
                  <span className="text-2xl text-gray-600 mb-1">/100</span>
                </div>
                <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '78%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2.5">
                  12 points away from being Top 10% placement-ready
                </p>
              </div>

              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-glow-cyan"
                >
                  <Zap size={16} />
                  Get My Career Twin
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  WHAT-IF SIMULATOR                                   ║
          ╚══════════════════════════════════════════════════════╝ */}
      <FadeSection className="py-24 px-4 sm:px-6" id="simulator">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-5">
              <Sparkles size={12} /> What-If Simulator
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              See how your next skills can<br />
              <span className="gradient-text">change your career readiness.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Simulate skill additions and watch your career readiness score update in real time.
            </p>
          </div>

          <div className="glass border border-card-border rounded-3xl p-8 sm:p-10">
            <WhatIfSimulator />
          </div>
        </div>
      </FadeSection>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  HOW IT WORKS                                        ║
          ╚══════════════════════════════════════════════════════╝ */}
      <FadeSection className="py-24 px-4 sm:px-6 bg-bg-secondary/40" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-5">
              <Map size={12} /> Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Five simple steps from where you are to where you want to be.
            </p>
          </div>

          {/* Vertical connector on desktop */}
          <div className="relative">
            <div className="hidden lg:block absolute left-[39px] top-8 bottom-8 w-px bg-gradient-to-b from-cyan-500/40 via-purple-500/20 to-transparent" />

            <motion.div
              className="space-y-4"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {HOW_STEPS.map((step) => (
                <motion.div key={step.num} variants={fadeUp}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-5 p-6 rounded-2xl border border-card-border hover:border-gray-600 bg-card hover:bg-card-hover transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/25 flex items-center justify-center">
                      <span className="text-xs font-black gradient-text">{step.num}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400">{step.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-700 group-hover:text-cyan-400 flex-shrink-0 mt-0.5 transition-colors" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </FadeSection>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  FINAL CTA                                           ║
          ╚══════════════════════════════════════════════════════╝ */}
      <FadeSection className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative">
            {/* Ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-56 bg-cyan-500/8 rounded-full blur-3xl" />
            </div>

            <div className="relative gradient-border p-px rounded-3xl">
              <div className="bg-card rounded-3xl px-8 sm:px-16 py-14">
                <motion.div
                  className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-7 shadow-glow-cyan"
                  animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.04, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Brain size={28} className="text-white" />
                </motion.div>

                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                  Ready to take control<br />of your career?
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                  Join 50,000+ professionals using AI Career Copilot to land their dream
                  jobs faster — completely free to start.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-glow-cyan"
                    >
                      <Brain size={18} />
                      Build My Career Twin
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border border-gray-700 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 transition-all duration-200"
                    >
                      Sign in instead
                    </motion.button>
                  </Link>
                </div>

                <p className="text-xs text-gray-600 mt-7">
                  No credit card required · Free plan available · Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ╔══════════════════════════════════════════════════════╗
          ║  FOOTER                                              ║
          ╚══════════════════════════════════════════════════════╝ */}
      <footer className="border-t border-card-border py-12 px-4 sm:px-6 bg-bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">AI Career</span>
                  <span className="text-sm font-bold gradient-text ml-1">Copilot</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Your Personal AI-Powered Career Mentor — transforming how students and
                professionals prepare for their dream careers.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a
                  href="#"
                  className="h-9 w-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                  aria-label="GitHub"
                >
                  <GithubIcon size={15} />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                  aria-label="Email"
                >
                  <Mail size={15} />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {['Features', 'Career Twin', 'Roadmap', 'Job Match', 'Mock Interview'].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-gray-200 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {['About', 'GitHub', 'Contact', 'Privacy Policy', 'Terms'].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-gray-200 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-card-border pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © 2026 AI Career Copilot · Built as a college project — powered by AI.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
