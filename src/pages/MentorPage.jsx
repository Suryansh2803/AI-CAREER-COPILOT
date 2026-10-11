import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Bot,
  Send,
  Sparkles,
  User,
  ArrowRight,
  Target,
  Calendar,
  Layers,
  Code2,
  Cpu,
  FileText,
  Briefcase,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Check,
  Sliders,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { mentorAPI } from '../services/api'

// ── Suggested Prompt Chips from Requirements ───────────────────
const SUGGESTED_QUESTIONS = [
  'What should I study today?',
  'Am I ready for an SDE internship?',
  'What skill should I learn next?',
  'Review my project.',
  'How can I improve my resume?',
]

// ── Context-Aware Mock AI Knowledge Base ───────────────────────
const MOCK_ANSWERS = {
  'What should I study today?': `Based on your digital twin (78/100 Readiness) and target SDE role at Amazon, your highest leverage task today is:

1. **Backend Development (60 mins):** Implement JWT authentication middleware in Express. This directly addresses your #1 Critical Gap.
2. **DSA Reinforcement (30 mins):** Solve 1 LeetCode Medium on Binary Tree Inversion to maintain your 85% algorithmic score.
3. **Quick Revision (15 mins):** Review B+ Tree vs Hash Index trade-offs for relational DBMS.

Would you like me to add these directly to your **Daily Planner**?`,

  'Am I ready for an SDE internship?': `Here is your honest placement readiness breakdown:

- **Algorithmic Preparation (85%):** **YES.** You comfortably exceed the cutoff for online coding assessments (OA) in C++ and DSA.
- **Academic Standing (CGPA 8.6+):** **YES.** Fully qualified for campus placement shortlists.
- **Backend Architecture (50%):** **NOT YET.** Tier-1 tech interviews will evaluate practical API design and concurrency.
- **Current Job Match:** **84% fit for Amazon SDE-1.**

**Verdict:** You are 3 to 4 weeks of structured backend practice away from being top-bracket interview ready. Follow Week 2 and Week 3 of your 30-Day Roadmap!`,

  'What skill should I learn next?': `Looking at your Skill Radar and Career Gaps:

**Priority 1: Node.js + Express REST APIs.**
You currently have a 30% deficit in backend services compared to SDE hiring benchmarks. Mastering Express request lifecycles, custom middleware, and error handling will grant an estimated **+5.5 Readiness Points**.

**Priority 2: System Design Foundations.**
Learn caching layers (Redis) and database sharding. Amazon SDE-1 loops increasingly test scalability trade-offs.`,

  'Review my project.': `Reviewing your **"Distributed Task Queue & Expense Splitter"** projects:

**Strengths:**
- Clean algorithmic minimization of settlement debts using graph reduction.
- Strong separation between frontend React state and asynchronous jobs.

**Areas to Improve for Resume & Interviews:**
1. **Add Metrics:** Quantify transaction settlement reduction (e.g., *"Reduced redundant transactions by 65%"*).
2. **Add Production Tooling:** Introduce Redis caching for active task queries and Dockerize the deployment.
3. **API Documentation:** Generate a Swagger OpenAPI spec to show professional backend standards.`,

  'How can I improve my resume?': `Your resume scored **76/100 (ATS Certified)**. Here are the 3 fastest ways to lift it to **88+**:

1. **Apply the Google XYZ Formula:** Replace passive lines like *"Made an expense splitter"* with *"Developed a smart expense-splitting application that minimizes settlement transactions using an optimized algorithm."*
2. **Inject Missing Keywords:** Add \`Node.js\`, \`REST API\`, \`System Design\`, \`Docker\`, and \`AWS (S3/EC2)\` to your Skills section.
3. **Quantify Outcomes:** Add metrics on API response latency, database queries optimized, or user volume.`,
}

const DEFAULT_AI_REPLY = `I've analyzed your career profile against SDE requirements at top tier tech firms. Your core foundation in DSA (85%) is exceptional, but your immediate growth area is hands-on backend development and system design. 

How can I assist you with your learning roadmap, interview practice, or resume today?`

export default function MentorPage() {
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  // ── Conversation State ───────────────────────────────────────
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'mentor',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'Suryansh'}! I am your AI Career Mentor. I'm actively tracking your Career Twin readiness (78/100), verified DSA strengths, and target goal of SDE at Amazon.

How can I accelerate your placement journey today?`,
      time: 'Just now',
    },
  ])

  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim()
    if (!query) return

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputMessage('')
    setIsTyping(true)

    try {
      const res = await mentorAPI.chat(query)
      const replyText = res?.response?.message || DEFAULT_AI_REPLY
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'mentor',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (_) {
      const matchedKey = Object.keys(MOCK_ANSWERS).find(
        (k) => k.toLowerCase() === query.toLowerCase()
      )
      const replyText = matchedKey ? MOCK_ANSWERS[matchedKey] : DEFAULT_AI_REPLY
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'mentor',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'mentor',
        text: `Session refreshed. I have your full career profile loaded. What would you like to explore?`,
        time: 'Just now',
      },
    ])
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ════════════════════ PAGE HEADER ════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800/80"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-2">
            <Bot size={13} />
            <span>Personalized Conversational Copilot</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            AI Career Mentor
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Personalized career advice deeply grounded in your real-time skills, gaps, and dream roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/planner">
            <Button variant="secondary" size="sm" icon={Calendar} className="border-purple-500/30 text-purple-300 hover:text-white">
              Daily Planner
            </Button>
          </Link>
          <Link to="/career-roadmap">
            <Button variant="primary" size="sm" iconRight={ArrowRight} className="shadow-glow-cyan">
              Roadmap
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ════════════ MAIN CONVERSATION LAYOUT ════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Student Career Context Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 bg-card/95 border-card-border shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-cyan-400">
                Active Candidate Context
              </span>
              <Badge variant="cyan" dot>Synchronized</Badge>
            </div>

            {/* Profile Snapshot */}
            <div className="p-3.5 rounded-xl bg-bg-secondary/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Target Role</span>
                <strong className="text-white">SDE (Software Dev)</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Dream Company</span>
                <strong className="text-purple-300">Amazon</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Career Readiness</span>
                <strong className="text-emerald-400 font-mono">78 / 100</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">ATS Score</span>
                <strong className="text-cyan-400 font-mono">76 / 100</strong>
              </div>
            </div>

            {/* Strength vs Bottleneck */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                <span>Top Strength:</span>
                <strong className="font-bold">DSA (85%)</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between">
                <span>Top Bottleneck:</span>
                <strong className="font-bold">Backend Dev (28%)</strong>
              </div>
            </div>

            <p className="text-2xs text-gray-500 leading-relaxed">
              Every mentor recommendation dynamically adapts to your verified LeetCode progress, project repos, and roadmap achievements.
            </p>
          </Card>

          {/* Quick Prompts Panel */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-cyan-400" /> Suggested Questions
              </h3>
            </div>

            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-bg-secondary hover:bg-cyan-500/10 border border-gray-800 hover:border-cyan-500/40 text-xs text-gray-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{q}</span>
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Conversational Chat Stream (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="h-[640px] flex flex-col justify-between p-0 overflow-hidden bg-card/95 border-card-border shadow-2xl relative">
            {/* Chat Window Header */}
            <div className="p-4 px-6 border-b border-gray-800 flex items-center justify-between bg-bg-secondary/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-glow-cyan text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    AI Mentor Copilot
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-2xs text-gray-400">Trained on FAANG & Tier-1 Hiring Rubrics</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetChat}
                className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                title="Reset Conversation"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isMentor = msg.sender === 'mentor'
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 ${isMentor ? 'justify-start' : 'justify-end'}`}
                  >
                    {isMentor && (
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        isMentor
                          ? 'bg-bg-secondary/80 border border-gray-800 text-gray-200'
                          : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-medium shadow-glow-cyan/20'
                      }`}
                    >
                      {msg.text}
                      <span className={`block text-3xs mt-2 text-right ${isMentor ? 'text-gray-500' : 'text-cyan-200'}`}>
                        {msg.time}
                      </span>
                    </div>

                    {!isMentor && (
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                        <User size={16} />
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {isTyping && (
                <div className="flex gap-3 items-center text-xs text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-2xl bg-bg-secondary border border-gray-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 border-t border-gray-800 bg-bg-secondary/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your AI Career Mentor anything about skills, prep, or resume..."
                  className="input-base flex-1 text-xs sm:text-sm py-3 px-4 bg-bg-secondary/80 border-gray-700/80 focus:border-cyan-400"
                />

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center shadow-glow-cyan hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  <Send size={15} />
                </motion.button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
