import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function PublicLayout() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isAuthPage = ['/login', '/register'].includes(location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={`min-h-screen relative ${isLanding ? 'landing-shell' : isAuthPage ? 'auth-shell' : 'bg-bg-primary bg-grid'}`}>

      {/* Public header */}
      <header className={`fixed top-0 inset-x-0 z-30 ${isLanding ? 'landing-header' : 'border-b border-white/[0.07] bg-bg-secondary/95 backdrop-blur-sm'}`}>
        <div className={`mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between ${isLanding ? 'max-w-[1510px]' : 'max-w-6xl'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="AI Career Copilot home">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_24px_rgba(14,165,233,.35)]">
              <Zap size={16} className="text-white" aria-hidden="true" fill="currentColor" />
            </div>
            <span className="text-[18px] font-bold tracking-tight text-white">Career Copilot</span>
          </Link>

          {isLanding && (
            <nav className="hidden lg:flex items-center gap-9 text-[14px] font-medium text-slate-300" aria-label="Main navigation">
              <a href="#features" className="landing-nav-link">Features</a>
              <a href="#how-it-works" className="landing-nav-link">How It Works</a>
              <a href="#pricing" className="landing-nav-link">Pricing</a>
              <a href="#faq" className="landing-nav-link">FAQ</a>
              <a href="#about" className="landing-nav-link">About</a>
            </nav>
          )}

          <div className="flex items-center gap-3 sm:gap-5">
            {isLanding && (
              <a href="#features" aria-label="Browse features" className="hidden sm:inline-flex p-2 text-slate-300 hover:text-white transition-colors">
                <Search size={19} />
              </a>
            )}
            <nav className="flex items-center gap-2 sm:gap-3" aria-label="Authentication">
            <Link
              to="/login"
              className={isLanding ? 'landing-signin' : 'text-sm text-gray-500 hover:text-gray-200 transition-base px-3 py-1.5 rounded-lg hover:bg-white/[0.05]'}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className={isLanding ? 'landing-get-started' : 'text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-base shadow-btn-primary'}
            >
              Get Started
            </Link>
            </nav>
            {isLanding && (
              <button className="lg:hidden p-2 text-slate-200" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
        {isLanding && menuOpen && (
          <nav className="lg:hidden absolute top-full inset-x-0 p-4 bg-[#071021]/95 border-t border-white/10 backdrop-blur-xl flex flex-col gap-1" aria-label="Mobile navigation">
            {[['Features', '#features'], ['How It Works', '#how-it-works'], ['Pricing', '#pricing'], ['FAQ', '#faq'], ['About', '#about']].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">{label}</a>
            ))}
          </nav>
        )}
      </header>

      {/* Page content */}
      <main className={`${isLanding ? 'pt-[68px]' : 'pt-14'} min-h-screen`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
