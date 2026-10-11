import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, X } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import Navbar  from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'

const SIDEBAR_WIDTH           = 244
const SIDEBAR_WIDTH_COLLAPSED =  64

export default function DashboardLayout() {
  const [sidebarOpen,      setSidebarOpen]      = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [bannerDismissed,  setBannerDismissed]  = useState(false)
  const location = useLocation()
  const { demoMode } = useAuth()

  const desktopOffset = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH
  const showBanner    = demoMode && !bannerDismissed

  return (
    <div className="dashboard-shell min-h-screen bg-bg-primary">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
      />

      <div
        className="flex flex-col min-h-screen transition-[padding-left] duration-300 ease-smooth lg:pl-[var(--sidebar-offset)]"
        style={{ '--sidebar-offset': `${desktopOffset}px` }}
      >
        {/* Mobile: remove sidebar padding */}
        <style>{`@media (max-width: 1023px) { .main-column { padding-left: 0 !important; } }`}</style>

        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onCollapseToggle={() => setSidebarCollapsed(c => !c)}
        />

        {/* Demo / offline banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-[68px]"  // sits below fixed navbar
            >
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-500/8 border-b border-amber-500/15 text-amber-400 text-xs">
                <div className="flex items-center gap-2">
                  <WifiOff size={13} className="flex-shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold">Demo mode</strong>
                    {' — '}You’re exploring with sample data. Changes may not be saved to an account.
                  </span>
                </div>
                <button
                  onClick={() => setBannerDismissed(true)}
                  className="flex-shrink-0 p-1 rounded hover:bg-white/[0.08] transition-base"
                  aria-label="Dismiss banner"
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page content */}
        <main
          id="main-content"
          className={`flex-1 ${showBanner ? '' : 'pt-[68px]'}`}
          tabIndex={-1}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
