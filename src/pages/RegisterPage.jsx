import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Zap, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/* ── Google icon ────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <motion.p
      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AlertCircle size={11} />{msg}
    </motion.p>
  )
}

/* ── Password strength meter ─────────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ chars',    ok: password.length >= 8 },
    { label: 'Uppercase',   ok: /[A-Z]/.test(password) },
    { label: 'Number',      ok: /[0-9]/.test(password) },
    { label: 'Special',     ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.ok).length

  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {checks.map((c) => (
            <span
              key={c.label}
              className={`text-2xs flex items-center gap-0.5 transition-colors ${c.ok ? 'text-emerald-400' : 'text-gray-600'}`}
            >
              <Check size={9} className={c.ok ? 'opacity-100' : 'opacity-0'} />
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-2xs font-semibold ${colors[score - 1].replace('bg-', 'text-')}`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  )
}

const PERKS = [
  'AI-generated career roadmap',
  'Resume analysis & ATS scoring',
  'Smart job matching',
  'Mock interview preparation',
  'Skill gap analysis',
]

/* ══════════════════════════════════════════════════════════════
   REGISTER PAGE
══════════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: '' }))
    setServerError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.'

    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'

    if (!form.password) errs.password = 'Password is required.'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Must contain an uppercase letter.'
    else if (!/[0-9]/.test(form.password)) errs.password = 'Must contain a number.'

    if (!form.confirm) errs.confirm = 'Please confirm your password.'
    else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.'

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register(form.name.trim(), form.email.trim(), form.password)
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-14 items-center relative z-10">
        {/* Left panel */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-7 shadow-glow-cyan">
            <Zap size={26} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Start your AI-powered<br />
            <span className="gradient-text">career journey today</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            Join thousands of students and professionals using AI Career Copilot to land their dream jobs.
          </p>
          <div className="space-y-3.5">
            {PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-cyan-400" />
                </div>
                <span className="text-gray-300 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <div>
          <motion.div
            className="text-center lg:text-left mb-7"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-white mb-1.5">Create your account</h1>
            <p className="text-gray-400">Free forever. No credit card required.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card border border-card-border rounded-2xl p-8 shadow-card"
          >
            {serverError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5"
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                {serverError}
              </motion.div>
            )}

            {/* Google */}
            <div className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-bg-secondary border border-gray-700 rounded-xl text-sm font-medium text-gray-500 mb-5" aria-label="Google sign-up unavailable">
              <GoogleIcon />
              Google sign-up isn’t configured yet
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-500 uppercase tracking-wider">
                <span className="bg-card px-3">or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    id="reg-name"
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Suryansh Dev"
                    autoComplete="name"
                    className={`input-base pl-9 ${errors.name ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  />
                </div>
                <FieldError msg={errors.name} />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`input-base pl-9 ${errors.email ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  />
                </div>
                <FieldError msg={errors.email} />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-pass" className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    id="reg-pass"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    className={`input-base pl-9 pr-10 ${errors.password ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300" tabIndex={-1}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={errors.password} />
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm */}
              <div>
                <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={set('confirm')}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className={`input-base pl-9 pr-10 ${errors.confirm ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300" tabIndex={-1}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={errors.confirm} />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-glow-cyan hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {loading
                  ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  : <><ArrowRight size={16} /> Create Free Account</>}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
