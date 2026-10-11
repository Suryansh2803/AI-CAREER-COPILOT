import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  User2,
  Map,
  FileText,
  Briefcase,
  Mic2,
  Bot,
  CalendarDays,
  TrendingUp,
  UserCircle,
  Settings,
  X,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { clsx } from 'clsx'
import Tooltip from '../ui/Tooltip'

// ─── Navigation config ──────────────────────────────────────
const navItems = [
  { label: 'Overview',       icon: LayoutDashboard, path: '/dashboard',      group: 'main' },
  { label: 'Career Twin',    icon: User2,           path: '/career-twin',    group: 'main' },
  { label: 'Career Roadmap', icon: Map,             path: '/career-roadmap', group: 'main' },
  { label: 'Resume Analyzer',icon: FileText,        path: '/resume-analyzer',group: 'tools' },
  { label: 'Job Match',      icon: Briefcase,       path: '/job-match',      group: 'tools' },
  { label: 'Mock Interview', icon: Mic2,            path: '/mock-interview', group: 'tools' },
  { label: 'AI Mentor',      icon: Bot,             path: '/mentor',         group: 'tools' },
  { label: 'Daily Planner',  icon: CalendarDays,    path: '/planner',        group: 'tools' },
  { label: 'Progress',       icon: TrendingUp,      path: '/progress',       group: 'tools' },
]

const bottomItems = [
  { label: 'Profile',  icon: UserCircle, path: '/profile' },
  { label: 'Settings', icon: Settings,   path: '/settings' },
]

const mainItems  = navItems.filter(i => i.group === 'main')
const toolsItems = navItems.filter(i => i.group === 'tools')

// ─── NavItem ────────────────────────────────────────────────
function NavItem({ item, collapsed, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === item.path

  const inner = (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={clsx(
        'nav-item',
        isActive && 'active',
        collapsed && 'justify-center px-0'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active left bar */}
      {isActive && (
        <motion.span
          layoutId="sidebar-active-bar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-400 rounded-full"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}

      <item.icon
        size={16}
        className={clsx(
          'flex-shrink-0 transition-colors',
          isActive ? 'text-blue-400' : 'text-gray-600 group-hover:text-gray-400',
          collapsed && 'mx-auto'
        )}
        aria-hidden="true"
      />

      {!collapsed && (
        <span className="truncate flex-1">{item.label}</span>
      )}

      {isActive && !collapsed && (
        <ChevronRight size={12} className="ml-auto text-blue-400/50 flex-shrink-0" />
      )}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip content={item.label} placement="right">
        {inner}
      </Tooltip>
    )
  }

  return inner
}

// ─── Group label ─────────────────────────────────────────────
// ─── Sidebar ─────────────────────────────────────────────────
export default function Sidebar({ isOpen, onClose, collapsed = false }) {
  const width = collapsed ? 64 : 240

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full z-50 flex flex-col',
          'dashboard-sidebar shadow-sidebar',
          'border-r border-white/[0.07]',
          'transition-[width,transform] duration-300 ease-smooth',
          // Mobile slide
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ width }}
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <div
          className={clsx(
            'flex items-center border-b border-white/[0.07] flex-shrink-0',
          collapsed ? 'h-[68px] justify-center px-4' : 'h-[68px] px-5 gap-3'
          )}
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_22px_rgba(14,165,233,.25)]">
            <Zap size={16} className="text-white" aria-hidden="true" fill="currentColor" />
          </div>

          {!collapsed && (
            <>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-base font-bold text-white leading-tight tracking-tight">
                  Career Copilot
                </p>
              </div>
              {/* Mobile close */}
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-md text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-base"
                aria-label="Close sidebar"
              >
                <X size={15} />
              </button>
            </>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-1">
          {mainItems.map(item => (
            <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
          ))}

          {toolsItems.map(item => (
            <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
          ))}
        </nav>

        {/* ── Bottom items ── */}
        <div className="flex-shrink-0 border-t border-white/[0.07] py-3 px-3 space-y-1">
          {bottomItems.map(item => {
            const inner = (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx('nav-item', isActive && 'active', collapsed && 'justify-center px-0')
                }
              >
                <item.icon
                  size={16}
                  className={clsx('flex-shrink-0 text-gray-600', collapsed && 'mx-auto')}
                  aria-hidden="true"
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )

            return collapsed ? (
              <Tooltip key={item.path} content={item.label} placement="right">
                {inner}
              </Tooltip>
            ) : inner
          })}
        </div>
      </aside>
    </>
  )
}
