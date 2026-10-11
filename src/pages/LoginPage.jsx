/**
 * LoginPage — Sign in with email/password or one-click demo.
 * Handles offline/demo mode when the backend server is unavailable.
 */
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  AlertCircle, Zap, WifiOff, Play,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ── Google SVG icon ───────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// ── Field error ───────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <motion.p
      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
    >
      <AlertCircle size={11} aria-hidden="true" /> {msg}
    </motion.p>
  )
}

// ── Password input with toggle ────────────────────────────────
function PasswordInput({ id, label, value, onChange, error }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" aria-hidden="true" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          autoComplete="current-password"
          className={`input-base pl-9 pr-10 ${error ? 'border-red-500/50 focus:border-red-500' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-base"
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      <span id={`${id}-error`}>
        <FieldError msg={error} />
      </span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  LOGIN PAGE
// ══════════════════════════════════════════════════════════════
export default function LoginPage() {
  const { login, loginDemo, serverDown } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [form,         setForm]         = useState({ email: '', password: '' })
  const [errors,       setErrors]       = useState({})
  const [serverError,  setServerError]  = useState('')
  const [loading,      setLoading]      = useState(false)

  const setField = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
    setServerError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.password) errs.password = 'Password is required.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    loginDemo()
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-sm">

        {/* ── Logo + heading ── */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600 mb-4">
            <Zap size={20} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue your career journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >

          {/* ── Server offline banner ── */}
          <AnimatePresence>
            {serverDown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs mb-4"
                role="alert"
              >
                <WifiOff size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Backend server is offline</p>
                  <p className="text-amber-400/70 mt-0.5">
                    Use demo credentials or click &ldquo;Try Demo&rdquo; to explore the full UI.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Server error ── */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs mb-4"
                role="alert"
              >
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Card ── */}
          <div className="card-base p-6 space-y-4">

            {/* Demo one-click */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-base shadow-btn-primary"
              id="demo-login-btn"
            >
              <Play size={14} fill="currentColor" aria-hidden="true" />
              Try Demo — No account needed
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.07]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-2xs text-gray-600 uppercase tracking-wider bg-[#0F1320]">
                  or sign in with email
                </span>
              </div>
            </div>

            {/* Google */}
            <div className="w-full flex items-center justify-center gap-2.5 h-9 rounded-lg border border-white/[0.1] text-sm font-medium text-gray-500" aria-label="Google sign-in unavailable">
              <GoogleIcon />
              Google sign-in isn’t configured yet
            </div>

            {/* Email + password form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              <div>
                <label htmlFor="login-email" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" aria-hidden="true" />
                  <input
                    id="login-email"
                    type="email"
                    value={form.email}
                    onChange={setField('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`input-base pl-9 ${errors.email ? 'border-red-500/50' : ''}`}
                    aria-invalid={!!errors.email}
                  />
                </div>
                <FieldError msg={errors.email} />
              </div>

              <div>
                <PasswordInput
                  id="login-password"
                  label="Password"
                  value={form.password}
                  onChange={setField('password')}
                  error={errors.password}
                />
                <div className="flex justify-end mt-1">
                  <button type="button" className="text-xs text-gray-600 hover:text-gray-400 transition-base">
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-white/[0.07] hover:bg-white/[0.1] border border-white/[0.1] text-sm font-medium text-gray-200 transition-base disabled:opacity-50 mt-1"
              >
                {loading
                  ? <span className="h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                  : <><ArrowRight size={14} aria-hidden="true" /> Sign in</>}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="pt-1 border-t border-white/[0.07]">
              <p className="text-2xs text-gray-600 text-center">
                Demo credentials:{' '}
                <span className="text-gray-500 font-mono">demo@example.com</span>
                {' / '}
                <span className="text-gray-500 font-mono">Demo@1234</span>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-base">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
