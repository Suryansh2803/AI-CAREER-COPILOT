import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight,
  Circle, Clock3, Code2, Database, ExternalLink, FileText, Flag, Layers, Map,
  MessageSquare, NotebookPen, Play, Rocket, Server, SlidersHorizontal,
  Target, Trophy, RotateCcw, Cpu,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STORAGE_PREFIX = 'acc_roadmap_v2'
const TRACKS = {
  dsa: {
    label: 'Data Structures & Algorithms', icon: Code2, color: 'cyan',
    tasks: [
      ['Review arrays, strings, and hash maps', 'Practice patterns and explain time and space complexity.', '2 hours', 'Easy'],
      ['Solve tree and graph traversal problems', 'Work through BFS, DFS, and common tree traversals.', '3 hours', 'Medium'],
      ['Practice dynamic programming patterns', 'Start with one dimensional DP, then solve grid problems.', '3 hours', 'Medium'],
      ['Complete a timed problem set', 'Solve three role-level questions and review every miss.', '2 hours', 'Hard'],
    ],
  },
  frontend: {
    label: 'Frontend Engineering', icon: Layers, color: 'blue',
    tasks: [
      ['Build accessible React components', 'Practice forms, keyboard access, and clear loading states.', '2 hours', 'Easy'],
      ['Manage state and data fetching', 'Build a page with reusable state and resilient API handling.', '3 hours', 'Medium'],
      ['Add tests and performance checks', 'Test key flows and inspect rendering bottlenecks.', '3 hours', 'Medium'],
      ['Ship a polished portfolio project', 'Deploy the app and document decisions with screenshots.', '4 hours', 'Hard'],
    ],
  },
  backend: {
    label: 'Backend & APIs', icon: Server, color: 'cyan',
    tasks: [
      ['Design a REST API', 'Define resources, routes, validation, and consistent responses.', '2 hours', 'Easy'],
      ['Build CRUD endpoints with Node.js', 'Add Express routing, middleware, and error handling.', '3 hours', 'Medium'],
      ['Connect a database and add authentication', 'Use a data model, password hashing, and protected routes.', '4 hours', 'Medium'],
      ['Test and deploy the service', 'Add API tests, environment configuration, and a live deployment.', '4 hours', 'Hard'],
    ],
  },
  database: {
    label: 'Databases & SQL', icon: Database, color: 'violet',
    tasks: [
      ['Practice joins and grouping', 'Answer practical questions using joins, filters, and aggregates.', '2 hours', 'Easy'],
      ['Learn indexes and query plans', 'Compare query plans and choose appropriate indexes.', '2 hours', 'Medium'],
      ['Model data for a product feature', 'Design tables or collections and explain tradeoffs.', '3 hours', 'Medium'],
      ['Build a data-backed feature', 'Implement pagination, validation, and safe query handling.', '4 hours', 'Hard'],
    ],
  },
  systems: {
    label: 'System Design', icon: Cpu, color: 'amber',
    tasks: [
      ['Estimate load and storage needs', 'Practice turning product requirements into rough capacity estimates.', '2 hours', 'Easy'],
      ['Design caching and rate limits', 'Choose cache keys, expiry rules, and protection limits.', '2 hours', 'Medium'],
      ['Sketch a scalable service', 'Draw API, database, queue, and failure boundaries.', '3 hours', 'Medium'],
      ['Present one design under time pressure', 'Explain tradeoffs and likely failure modes in 30 minutes.', '2 hours', 'Hard'],
    ],
  },
  projects: {
    label: 'Projects & Portfolio', icon: Rocket, color: 'purple',
    tasks: [
      ['Choose a project that proves a target skill', 'Write a short problem statement and measurable outcome.', '1 hour', 'Easy'],
      ['Plan the first working version', 'Break the project into small deliverable milestones.', '2 hours', 'Easy'],
      ['Build and review the core feature', 'Complete an end-to-end feature and collect feedback.', '5 hours', 'Medium'],
      ['Publish the project with clear evidence', 'Deploy it and write a README with screenshots and decisions.', '3 hours', 'Medium'],
    ],
  },
  resume: {
    label: 'Resume & Applications', icon: FileText, color: 'blue',
    tasks: [
      ['Write a role-focused summary', 'Connect your target role to evidence in your experience.', '1 hour', 'Easy'],
      ['Rewrite project bullets with outcomes', 'Use action, implementation, and measurable result.', '2 hours', 'Medium'],
      ['Tailor keywords to one real job post', 'Compare your resume with a specific job description.', '1 hour', 'Medium'],
      ['Ask for a review and revise', 'Get feedback, fix unclear claims, and export a clean PDF.', '2 hours', 'Medium'],
    ],
  },
  data: {
    label: 'Data & Analytics', icon: Database, color: 'cyan',
    tasks: [
      ['Explore a dataset with Python', 'Clean missing values and summarize distributions.', '2 hours', 'Easy'],
      ['Practice SQL for analytics', 'Use joins, CTEs, and window functions on product questions.', '3 hours', 'Medium'],
      ['Build a clear analysis or dashboard', 'Choose a metric, explain it, and show useful visual evidence.', '4 hours', 'Medium'],
      ['Present findings and limitations', 'Write concise recommendations and note data quality limits.', '2 hours', 'Hard'],
    ],
  },
  interviews: {
    label: 'Interview Preparation', icon: MessageSquare, color: 'pink',
    tasks: [
      ['Prepare a concise project walkthrough', 'Explain the problem, your contribution, and key tradeoffs.', '1 hour', 'Easy'],
      ['Practice behavioral examples', 'Draft STAR examples for collaboration and problem solving.', '2 hours', 'Medium'],
      ['Run a role-specific mock interview', 'Practice aloud, record it, and note two improvements.', '1 hour', 'Medium'],
      ['Review and retry weak questions', 'Repeat the hardest questions after targeted preparation.', '2 hours', 'Hard'],
    ],
  },
}

const RESOURCE_MAP = {
  dsa: [['LeetCode Study Plans', 'https://leetcode.com/studyplan/'], ['VisuAlgo', 'https://visualgo.net/en'], ['NeetCode Roadmap', 'https://neetcode.io/roadmap']],
  frontend: [['React Documentation', 'https://react.dev/learn'], ['MDN Web Docs', 'https://developer.mozilla.org/'], ['Web.dev Learn', 'https://web.dev/learn/']],
  backend: [['Node.js Documentation', 'https://nodejs.org/en/learn'], ['Express Guide', 'https://expressjs.com/en/guide/routing.html'], ['MongoDB University', 'https://learn.mongodb.com/']],
  database: [['SQLBolt', 'https://sqlbolt.com/'], ['PostgreSQL Tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'], ['Use The Index, Luke', 'https://use-the-index-luke.com/']],
  systems: [['System Design Primer', 'https://github.com/donnemartin/system-design-primer'], ['ByteByteGo Blog', 'https://blog.bytebytego.com/'], ['AWS Architecture Center', 'https://aws.amazon.com/architecture/']],
  projects: [['GitHub Skills', 'https://skills.github.com/'], ['The Odin Project', 'https://www.theodinproject.com/'], ['Render Docs', 'https://render.com/docs']],
  resume: [['Harvard Resume Guide', 'https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/'], ['LinkedIn Career Advice', 'https://www.linkedin.com/business/talent/blog'], ['STAR Method Guide', 'https://www.themuse.com/advice/star-interview-method']],
  data: [['Kaggle Learn', 'https://www.kaggle.com/learn'], ['Pandas Getting Started', 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/'], ['Mode SQL Tutorial', 'https://mode.com/sql-tutorial/']],
  interviews: [['Pramp Practice', 'https://www.pramp.com/'], ['Big Interview Advice', 'https://biginterview.com/blog/'], ['STAR Method Guide', 'https://www.themuse.com/advice/star-interview-method']],
}

function makePlan(profile, duration) {
  profile = profile && typeof profile === 'object' ? profile : {}
  const role = String(profile.targetRole || '').toLowerCase()
  const skills = (Array.isArray(profile.skills) ? profile.skills : []).map((skill) => String(skill).toLowerCase())
  const projects = (Array.isArray(profile.projects) ? profile.projects : []).filter((project) => project && (project.name || project.description))
  const has = (...terms) => skills.some((skill) => terms.some((term) => skill.includes(term)))
  const dsaCount = Number(String(profile.dsaProblems || '').match(/\d+/)?.[0] || 0)
  const dsaScore = Math.min(95, dsaCount / 4 + ({ beginner: 10, intermediate: 28, advanced: 42, expert: 55 }[String(profile.dsaLevel || '').toLowerCase()] || 0))
  const frontendScore = 25 + (has('react', 'frontend', 'javascript', 'html', 'css') ? 35 : 0) + projects.length * 8
  const backendScore = 20 + (has('node', 'express', 'backend', 'api', 'java', 'spring') ? 35 : 0) + projects.filter((project) => /api|backend|node|express/i.test(`${project.techStack || ''} ${project.description || ''}`)).length * 15
  const databaseScore = 20 + (has('sql', 'mysql', 'postgres', 'mongodb', 'database') ? 35 : 0)
  const projectsScore = Math.min(90, 15 + projects.length * 22)
  const systemsScore = 20 + (has('system design', 'distributed systems') ? 40 : 0)
  const resumeScore = profile.resumeFileName ? 60 : 15
  let candidates
  if (/data|analyst|scientist|machine learning|ml engineer/.test(role)) {
    candidates = [['data', Math.min(95, 20 + (has('python', 'pandas', 'analytics') ? 40 : 0))], ['database', databaseScore], ['projects', projectsScore], ['dsa', dsaScore], ['resume', resumeScore], ['interviews', 35]]
  } else if (/frontend|ui engineer|web developer/.test(role)) {
    candidates = [['frontend', frontendScore], ['projects', projectsScore], ['dsa', dsaScore], ['database', databaseScore], ['systems', systemsScore], ['resume', resumeScore]]
  } else {
    candidates = [['dsa', dsaScore], ['backend', backendScore], ['database', databaseScore], ['systems', systemsScore], ['projects', projectsScore], ['resume', resumeScore]]
  }
  const modules = candidates.sort((a, b) => a[1] - b[1]).map(([key, score]) => ({ key, score, ...TRACKS[key] }))
  const moduleCount = duration === 30 ? 3 : duration === 60 ? 4 : 5
  return { modules: modules.slice(0, moduleCount), role: profile.targetRole || 'Set a target role', company: profile.targetCompany || 'Add a target company', duration, projects }
}

function makeTasks(modules) {
  return modules.flatMap((module, moduleIndex) => module.tasks.map(([title, description, time, difficulty], taskIndex) => ({
    id: `${module.key}-${taskIndex + 1}`,
    moduleKey: module.key,
    moduleIndex,
    title,
    description,
    time,
    difficulty,
  })))
}

function readProgress(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch { return {} }
}

function readNotes(key) {
  try { return localStorage.getItem(key) || '' } catch { return '' }
}

export default function CareerRoadmapPage() {
  const { user, getOnboardingData } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => getOnboardingData() || {})
  const [duration, setDuration] = useState(90)
  const [activeTab, setActiveTab] = useState('Roadmap')
  const [selectedModuleKey, setSelectedModuleKey] = useState('')
  const [notesContext, setNotesContext] = useState('')
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [notes, setNotes] = useState(() => readNotes(`${STORAGE_PREFIX}_${user?.id || user?.email}_notes`))
  const userKey = user?.id || user?.email || 'guest'
  const progressKey = `${STORAGE_PREFIX}_${userKey}_${duration}`
  const plan = useMemo(() => makePlan(profile, duration), [profile, duration])
  const tasks = useMemo(() => makeTasks(plan.modules), [plan])
  const [completed, setCompleted] = useState(() => Array.isArray(readProgress(progressKey).completed) ? readProgress(progressKey).completed : [])
  const completeSet = useMemo(() => new Set(completed), [completed])
  const progress = tasks.length ? Math.round(completed.filter((id) => tasks.some((task) => task.id === id)).length / tasks.length * 100) : 0
  const completedCount = tasks.filter((task) => completeSet.has(task.id)).length
  const nextModule = plan.modules.find((module) => tasks.some((task) => task.moduleKey === module.key && !completeSet.has(task.id))) || plan.modules.at(-1)
  const currentModule = plan.modules.find((module) => module.key === selectedModuleKey) || nextModule
  const moduleTaskList = currentModule ? tasks.filter((task) => task.moduleKey === currentModule.key) : []
  const currentModuleDone = moduleTaskList.filter((task) => completeSet.has(task.id)).length
  const currentWeekLabel = plan.modules.findIndex((module) => module.key === currentModule?.key) + 1

  useEffect(() => {
    const stored = readProgress(progressKey).completed
    setCompleted(Array.isArray(stored) ? stored : [])
  }, [progressKey])

  useEffect(() => {
    try { localStorage.setItem(progressKey, JSON.stringify({ completed })) } catch (_) {}
  }, [progressKey, completed])

  useEffect(() => {
    try { localStorage.setItem(`${STORAGE_PREFIX}_${userKey}_notes`, notes) } catch (_) {}
  }, [userKey, notes])

  const refreshProfile = () => setProfile(getOnboardingData() || {})
  const toggleTask = (taskId) => setCompleted((current) => current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId])
  const roadmapTabs = [
    { label: 'Roadmap', icon: Map }, { label: 'Resources', icon: BookOpen },
    { label: 'Projects', icon: Rocket }, { label: 'Milestones', icon: Flag }, { label: 'Notes', icon: NotebookPen },
  ]
  const focusTasks = currentModule?.tasks.slice(0, 3) || []
  const resources = RESOURCE_MAP[currentModule?.key] || RESOURCE_MAP.projects
  const monthDate = new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, 1)
  const monthTitle = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = monthDate.getDay()
  const monthDays = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  const today = new Date()
  const selectedDay = selectedDate.getDate()
  const targetLabels = ['Complete priority track', 'Publish a project', 'Prepare for interviews', 'Reach your target role']

  return (
    <div className="roadmap-page max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-7 pb-8 space-y-3">
      <motion.header className="roadmap-welcome rounded-b-2xl px-5 sm:px-7 pt-5 pb-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-blue-100/65">A plan shaped by your profile</p>
            <h1 className="text-2xl sm:text-[28px] font-bold text-white">Your Personalized Career Roadmap</h1>
            <p className="text-sm text-blue-100/80 mt-1">A step-by-step plan to help you reach your dream career.</p>
          </div>
          <div className="roadmap-quote hidden xl:block">“Consistency today creates opportunities tomorrow.”</div>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 mt-4">
          <SummaryCard icon={Target} label="Target Role" value={`${plan.role}${plan.company !== 'Add a target company' ? ` at ${plan.company}` : ''}`} />
          <label className="roadmap-summary-card"><span className="roadmap-summary-icon blue"><CalendarDays size={21} /></span><span className="min-w-0"><small>Time Frame</small><select value={duration} onChange={(event) => setDuration(Number(event.target.value))} aria-label="Roadmap duration"><option value={30}>30 Days</option><option value={60}>60 Days</option><option value={90}>90 Days</option></select></span></label>
          <div className="roadmap-summary-card"><span className="roadmap-summary-icon purple"><Layers size={22} /></span><span className="min-w-0 flex-1"><small>Overall Progress</small><strong className="flex items-center gap-2">{progress}% <span className="roadmap-mini-track"><i style={{ width: `${progress}%` }} /></span></strong></span></div>
          <SummaryCard icon={Trophy} label="Current Phase" value={currentModule?.label || 'Plan complete'} detail={currentWeekLabel ? `Phase ${currentWeekLabel}` : ''} />
        </div>
      </motion.header>

      <nav className="roadmap-tabs" aria-label="Roadmap sections">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">{roadmapTabs.map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => setActiveTab(label)} className={`roadmap-tab ${activeTab === label ? 'active' : ''}`}><Icon size={15} />{label}</button>)}</div>
        <span className="roadmap-duration-pill">{duration} Days Plan <ChevronRight size={14} className="rotate-90" /></span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_295px] gap-3 items-start">
        <main className="roadmap-main-panel">
          {activeTab === 'Roadmap' && <>
            <div className="roadmap-timeline">
              {plan.modules.map((module, index) => {
                const Icon = module.icon
                const moduleTasks = tasks.filter((task) => task.moduleKey === module.key)
                const done = moduleTasks.filter((task) => completeSet.has(task.id)).length
                const active = currentModule?.key === module.key
                const finished = done === moduleTasks.length
                return <button key={module.key} type="button" onClick={() => setSelectedModuleKey(module.key)} className={`roadmap-phase ${active ? 'active' : ''} ${finished ? 'finished' : ''}`}><span className="roadmap-phase-node">{finished ? <Check size={15} /> : active ? <Icon size={15} /> : <Circle size={13} />}</span><span><small>{index === 0 ? 'Phase 1' : `Phase ${index + 1}`}</small><strong>{module.label}</strong><em>{finished ? 'Completed' : active ? 'In Progress' : 'Not Started'}</em></span></button>
              })}
            </div>
            <section id={`phase-${currentModule?.key}`} className="roadmap-task-panel">
              <div className="flex items-start justify-between gap-4 mb-4"><div><h2>{`Phase ${currentWeekLabel} – ${currentModule?.label || 'Plan Complete'}`}</h2><p>{currentModule ? `Focus on your highest priority gap for ${plan.role}.` : 'You completed every task in this plan.'}</p></div><span className="roadmap-completed-label">{currentModuleDone}/{moduleTaskList.length} completed</span></div>
              {moduleTaskList.map((task) => <TaskRow key={task.id} task={task} done={completeSet.has(task.id)} onToggle={() => toggleTask(task.id)} onNotes={() => { setNotesContext(task.title); setActiveTab('Notes') }} />)}
              <div className="roadmap-project-callout"><span className="roadmap-project-icon"><Rocket size={23} /></span><div className="flex-1"><strong>Mini Project · {currentModule?.label || 'Next Step'}</strong><p>Apply this phase in a small deliverable and add it to your portfolio.</p></div><button type="button" onClick={() => setActiveTab('Projects')}>View project ideas <ArrowRight size={15} /></button></div>
            </section>
          </>}
          {activeTab === 'Resources' && <ContentPanel title={`Resources for ${currentModule?.label || 'your goals'}`} subtitle="A short list to support the phase you are working on.">{resources.map(([label, href]) => <a className="roadmap-resource-row" key={label} href={href} target="_blank" rel="noreferrer"><BookOpen size={17} /><span>{label}</span><ExternalLink size={14} /></a>)}</ContentPanel>}
          {activeTab === 'Projects' && <ContentPanel title="Projects that build proof" subtitle="Turn learning into evidence you can discuss in interviews.">{plan.projects.length ? plan.projects.map((project, index) => <div className="roadmap-list-card" key={`${project.name}-${index}`}><Rocket size={18} /><div><strong>{project.name || `Project ${index + 1}`}</strong><p>{project.techStack || project.description || 'Add a description and tech stack in your onboarding profile.'}</p></div></div>) : <div className="roadmap-project-callout"><Rocket size={23} /><div><strong>Start with a small, complete project</strong><p>Choose one user problem, build a working version, deploy it, and document what you learned.</p></div><button onClick={() => navigate('/onboarding')} type="button">Update profile <ArrowRight size={15} /></button></div>}</ContentPanel>}
          {activeTab === 'Milestones' && <ContentPanel title="Milestones" subtitle="Track progress toward your selected role.">{targetLabels.map((label, index) => <div className="roadmap-milestone" key={label}><span className={`roadmap-phase-node ${index === 0 && progress > 0 ? 'done' : ''}`}>{index === 0 && progress > 0 ? <Check size={14} /> : <Flag size={14} />}</span><div><strong>{label}</strong><p>{index === 0 ? `${completedCount} of ${tasks.length} roadmap tasks complete` : `Target window: day ${Math.round((duration / 4) * (index + 1))}`}</p></div><span>{index === 0 ? `${progress}%` : 'Planned'}</span></div>)}</ContentPanel>}
          {activeTab === 'Notes' && <ContentPanel title="Roadmap notes" subtitle={notesContext ? `Notes for: ${notesContext} · saved in this browser for your account.` : 'Notes are saved in this browser for your account.'}><textarea id="roadmap-notes" value={notes} onChange={(event) => setNotes(event.target.value)} className="roadmap-notes" placeholder="Capture questions, useful links, blockers, or what you learned this week…" /></ContentPanel>}
        </main>

        <aside className="space-y-3">
          <section className="roadmap-side-card">
            <div className="flex items-center justify-between mb-3"><h3>{monthTitle}</h3><div className="flex gap-1"><button aria-label="Previous month" onClick={() => setMonthOffset((value) => value - 1)}><ChevronLeft size={16} /></button><button aria-label="Next month" onClick={() => setMonthOffset((value) => value + 1)}><ChevronRight size={16} /></button></div></div>
            <div className="roadmap-calendar-grid">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}{Array.from({ length: firstDay }, (_, index) => <span key={`empty-${index}`} />)}{Array.from({ length: monthDays }, (_, index) => { const day = index + 1; const isToday = monthOffset === 0 && day === today.getDate(); const isSelected = day === selectedDay && selectedDate.getMonth() === monthDate.getMonth() && selectedDate.getFullYear() === monthDate.getFullYear(); return <button key={day} type="button" onClick={() => setSelectedDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), day))} className={`${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}>{day}</button> })}</div>
            <p className="text-[11px] text-slate-400 mt-3">Selected: {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </section>
          <section className="roadmap-side-card"><div className="flex items-center gap-2 mb-3"><Target size={17} className="text-fuchsia-300" /><h3>This Week&apos;s Focus</h3></div><ul className="roadmap-focus-list">{focusTasks.map((task) => <li key={task[0]}><span />{task[0]}</li>)}<li><span className="teal" />Spend {profile.studyHours || '6–10'} hours on focused practice</li></ul></section>
          <section className="roadmap-side-card"><div className="flex items-center justify-between mb-3"><h3>Helpful Resources</h3><button className="roadmap-view-all" onClick={() => setActiveTab('Resources')}>View All</button></div>{resources.slice(0, 5).map(([label, href]) => <a className="roadmap-resource-row compact" key={label} href={href} target="_blank" rel="noreferrer"><BookOpen size={15} /><span>{label}</span><ExternalLink size={12} /></a>)}</section>
          <section className="roadmap-side-card"><div className="flex items-center justify-between mb-3"><h3>Plan controls</h3><SlidersHorizontal size={15} className="text-blue-300" /></div><button className="roadmap-control" onClick={refreshProfile}><RotateCcw size={14} /> Refresh from profile</button><button className="roadmap-control" onClick={() => setCompleted([])}><RotateCcw size={14} /> Reset this plan&apos;s progress</button><Link to="/onboarding" className="roadmap-control"><Target size={14} /> Edit target and skills</Link></section>
        </aside>
      </div>

      <section className="roadmap-targets"><div className="flex items-center justify-between mb-3"><h2>Your Targets</h2><span>{completedCount}/{tasks.length} tasks complete</span></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">{plan.modules.slice(0, 4).map((module, index) => { const moduleTasks = tasks.filter((task) => task.moduleKey === module.key); const done = moduleTasks.filter((task) => completeSet.has(task.id)).length; const percent = Math.round(done / moduleTasks.length * 100); const Icon = module.icon; return <div className={`roadmap-target ${module.color}`} key={module.key}><div className="flex gap-3 items-center"><span className="target-icon"><Icon size={19} /></span><div><strong>{module.label}</strong><small>By Day {Math.round(duration * (index + 1) / plan.modules.length)}</small></div></div><div className="flex items-center gap-2 mt-3"><span className="roadmap-mini-track"><i style={{ width: `${percent}%` }} /></span><b>{percent}%</b></div></div> })}</div></section>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, detail }) {
  return <div className="roadmap-summary-card"><span className="roadmap-summary-icon cyan"><Icon size={21} /></span><span className="min-w-0"><small>{label}</small><strong>{value}</strong>{detail && <em>{detail}</em>}</span></div>
}

function TaskRow({ task, done, onToggle, onNotes }) {
  return <div className={`roadmap-task-row ${done ? 'done' : ''}`}><button type="button" className="task-check" aria-label={done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`} onClick={onToggle}>{done ? <Check size={14} /> : <Circle size={19} />}</button><div className="min-w-0 flex-1"><strong>{task.title}</strong><p>{task.description}</p></div><span className="task-time"><Clock3 size={13} />{task.time}</span><span className={`task-difficulty ${task.difficulty.toLowerCase()}`}>{task.difficulty}</span><button type="button" className="task-notes" onClick={onNotes}><NotebookPen size={13} /> Notes</button><button type="button" onClick={onToggle} className={`task-start ${done ? 'completed' : ''}`}>{done ? 'Completed' : <><Play size={12} /> Start</>}</button></div>
}

function ContentPanel({ title, subtitle, children }) {
  return <section className="roadmap-content-panel"><h2>{title}</h2><p className="panel-subtitle">{subtitle}</p><div className="mt-5 space-y-2.5">{children}</div></section>
}
