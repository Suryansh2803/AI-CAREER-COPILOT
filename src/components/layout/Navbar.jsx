import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserCircle,
  Settings,
  LogOut,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  X,
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { useAuth } from '../../context/AuthContext'
import { mockNotifications } from '../../data/mockData'
import { clsx } from 'clsx'

// ─── Page title map ──────────────────────────────────────────
const pageTitles = {
  '/dashboard':      'Overview',
  '/career-twin':    'Career Twin',
  '/simulator':      'What-If Simulator',
  '/career-roadmap': 'Roadmap',
  '/resume-analyzer':'Resume Analyzer',
  '/job-match':      'Job Match',
  '/mock-interview': 'Mock Interview',
  '/mentor':         'AI Mentor',
  '/planner':        'Daily Planner',
  '/progress':       'Progress',
  '/profile':        'Profile',
  '/settings':       'Settings',
}

// ─── Search ─────────────────────────────────────────────────
function SearchBar() {
  const [focused, setFocused] = useState(false)
  const [query, setQuery]     = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const down = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div
      className={clsx(
        'relative transition-[width] duration-200',
        'w-full max-w-[590px]',
        'hidden sm:block'
      )}
    >
      <Search
        size={13}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search anything... (e.g. DSA, Resume, Amazon SDE...)"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full h-10 pl-10 pr-14 bg-[#0c1a2d]/90 border border-blue-200/[0.08] rounded-2xl text-xs text-gray-300 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-base"
        aria-label="Search"
      />
      {!focused && (
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-2xs text-gray-600 bg-white/[0.05] border border-white/[0.07] rounded pointer-events-none">
          Ctrl&nbsp; K
        </kbd>
      )}
      {focused && query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-base"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}

// ─── Notification dropdown ────────────────────────────────────
function NotificationBtn() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const unread = mockNotifications.filter(n => n.unread).length

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const typeColors = { success: 'bg-teal-500', info: 'bg-blue-500', warning: 'bg-amber-500' }

  return (
    <div className="relative" ref={ref}>
      <button
        id="notifications-btn"
        onClick={() => setOpen(o => !o)}
        className="relative h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-base"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span
            className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full ring-2 ring-bg-secondary"
            aria-hidden="true"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-80 bg-bg-secondary border border-white/[0.08] rounded-xl shadow-card-lg z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
              <span className="text-sm font-semibold text-gray-100">Notifications</span>
              {unread > 0 && (
                <Badge variant="blue" size="sm">{unread} new</Badge>
              )}
            </div>
            <div className="divide-y divide-white/[0.05]">
              {mockNotifications.map(n => (
                <div
                  key={n.id}
                  className={clsx(
                    'flex gap-3 px-4 py-3 cursor-pointer transition-base hover:bg-white/[0.03]',
                    n.unread && 'bg-blue-500/[0.04]'
                  )}
                >
                  <div className={clsx('mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full', typeColors[n.type] || 'bg-gray-500')} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-200">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{n.body}</p>
                    <p className="text-2xs text-gray-600 mt-1 font-mono">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-white/[0.07]">
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-base font-medium">
                View all notifications →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Profile dropdown ─────────────────────────────────────────
function ProfileBtn() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const name  = user?.name  || 'Suryansh Yadav'
  const email = user?.email || 'suryansh@example.com'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const menuItems = [
    { label: 'View Profile', icon: UserCircle, path: '/profile' },
    { label: 'Settings',     icon: Settings,   path: '/settings' },
    { label: 'Help',         icon: HelpCircle, path: '/help' },
  ]

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        id="profile-btn"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 h-8 px-1.5 rounded-lg hover:bg-white/[0.05] transition-base group"
        aria-expanded={open}
        aria-label="Profile menu"
      >
        <Avatar name={name} size="sm" status="online" />
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-gray-300 leading-none">{name.split(' ')[0]}</p>
          <p className="text-2xs text-gray-600 leading-none mt-0.5">3rd Year CSE</p>
        </div>
        <ChevronDown
          size={12}
          className={clsx('text-gray-600 transition-transform duration-150', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-52 bg-bg-secondary border border-white/[0.08] rounded-xl shadow-card-lg z-50 overflow-hidden py-1"
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            <div className="px-3 py-2.5 border-b border-white/[0.07]">
              <p className="text-xs font-semibold text-gray-200">{name}</p>
              <p className="text-2xs text-gray-500 mt-0.5">{email}</p>
            </div>
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-gray-100 hover:bg-white/[0.04] transition-base"
              >
                <item.icon size={13} aria-hidden="true" />
                {item.label}
              </button>
            ))}
            <div className="border-t border-white/[0.07] mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/[0.07] transition-base"
              >
                <LogOut size={13} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────
export default function Navbar({ onMenuClick, sidebarCollapsed, onCollapseToggle }) {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] || 'Dashboard'

  return (
    <header
      className="dashboard-navbar fixed top-0 right-0 left-0 h-[68px] bg-bg-secondary/95 backdrop-blur-sm border-b border-white/[0.07] z-30 flex items-center px-4 sm:px-6 gap-4 shadow-navbar"
      role="banner"
      style={{ left: 'var(--sidebar-offset)' }}
    >
      {/* Left — menu / collapse toggles */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-base"
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </button>

        <button
          onClick={onCollapseToggle}
          className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-base"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
        </button>

        {/* Page breadcrumb */}
        <span className="hidden sm:block text-sm font-semibold text-gray-400 ml-1">
          {pageTitle}
        </span>
      </div>

      {/* Center — search */}
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <NotificationBtn />
        <div className="w-px h-4 bg-white/[0.08] mx-1 hidden sm:block" aria-hidden="true" />
        <ProfileBtn />
      </div>
    </header>
  )
}
