/**
 * AuthContext — Authentication state with offline/demo mode support.
 *
 * When the backend (port 5000) is unavailable, the app falls back to
 * a local demo session so the UI is fully explorable without a server.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'
import { mockUser } from '../data/mockData'

const AuthContext = createContext(null)

const STORAGE_KEYS = {
  USER:             'acc_user',
  TOKEN:            'acc_token',
  ONBOARDING:       'acc_onboarding',
  ONBOARDING_DONE:  'acc_onboarding_done',
  DEMO_MODE:        'acc_demo_mode',
}

// ─── Demo session ─────────────────────────────────────────────
// A synthetic user that works entirely from mock data when the
// backend is offline. Token is a placeholder — never sent to server.
const DEMO_USER = {
  id:    'demo_001',
  name:  mockUser.name,
  email: mockUser.email,
  plan:  'Pro',
  demo:  true,
}
const DEMO_TOKEN = 'demo_offline_token'
const DEMO_CREDENTIALS = { email: 'demo@example.com', password: 'Demo@1234' }

function isBackendError(err) {
  // Status 0 = network / ECONNREFUSED; no status = fetch threw
  return !err.status || err.status === 0
}

function activateDemoSession(setUser) {
  localStorage.setItem(STORAGE_KEYS.USER,      JSON.stringify(DEMO_USER))
  localStorage.setItem(STORAGE_KEYS.TOKEN,     DEMO_TOKEN)
  localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true')
  setUser(DEMO_USER)
}

// ─── Provider ────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,       setUser]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [demoMode,   setDemoMode]   = useState(false)
  const [serverDown, setServerDown] = useState(false)

  /* ── Rehydrate session on mount ── */
  useEffect(() => {
    const rehydrate = async () => {
      try {
        const storedUser  = localStorage.getItem(STORAGE_KEYS.USER)
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
        const isDemo      = localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true'

        if (storedUser && storedToken) {
          if (isDemo || storedToken === DEMO_TOKEN) {
            // Demo session — restore without hitting backend
            setUser(JSON.parse(storedUser))
            setDemoMode(true)
          } else {
            // Real session — try to verify with backend
            try {
              const data = await authAPI.getMe()
              setUser(data.user)
              localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
            } catch (err) {
              if (isBackendError(err)) {
                // Backend down — keep cached user and mark server as down
                setUser(JSON.parse(storedUser))
                setServerDown(true)
              } else {
                // 401 or bad token — clear storage
                localStorage.removeItem(STORAGE_KEYS.USER)
                localStorage.removeItem(STORAGE_KEYS.TOKEN)
              }
            }
          }
        }
      } catch (_) {
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
      } finally {
        setLoading(false)
      }
    }

    rehydrate()
  }, [])

  /* ── Login ── */
  const login = useCallback(async (email, password) => {
    // Demo credentials → always work offline
    const isDemoCreds =
      email.toLowerCase().trim() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password

    try {
      const data = await authAPI.login(email, password)
      const { token, user: loggedInUser } = data
      localStorage.setItem(STORAGE_KEYS.USER,      JSON.stringify(loggedInUser))
      localStorage.setItem(STORAGE_KEYS.TOKEN,     token)
      localStorage.removeItem(STORAGE_KEYS.DEMO_MODE)
      setUser(loggedInUser)
      setDemoMode(false)
      setServerDown(false)
      return loggedInUser
    } catch (err) {
      if (isBackendError(err)) {
        // Server is offline
        setServerDown(true)
        if (isDemoCreds) {
          // Demo credentials → activate local demo session
          activateDemoSession(setUser)
          setDemoMode(true)
          return DEMO_USER
        }
        throw new Error('Server is offline. Use demo@example.com / Demo@1234 to explore the app.')
      }
      throw new Error(err.message || 'Invalid email or password.')
    }
  }, [])

  /* ── Demo login (one-click, always works) ── */
  const loginDemo = useCallback(() => {
    activateDemoSession(setUser)
    setDemoMode(true)
    setServerDown(false)
    return DEMO_USER
  }, [])

  /* ── Register ── */
  const register = useCallback(async (name, email, password) => {
    try {
      const data = await authAPI.register(name, email, password)
      const { token, user: newUser } = data
      localStorage.setItem(STORAGE_KEYS.USER,      JSON.stringify(newUser))
      localStorage.setItem(STORAGE_KEYS.TOKEN,     token)
      localStorage.removeItem(STORAGE_KEYS.DEMO_MODE)
      setUser(newUser)
      setDemoMode(false)
      setServerDown(false)
      return newUser
    } catch (err) {
      if (isBackendError(err)) {
        setServerDown(true)
        throw new Error('Server is offline. Use "Try Demo" on the login page to explore the app.')
      }
      throw new Error(err.message || 'Registration failed. Please try again.')
    }
  }, [])

  /* ── Logout ── */
  const logout = useCallback(async () => {
    if (!demoMode) {
      try { await authAPI.logout() } catch (_) {}
    }
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.DEMO_MODE)
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DONE)
    setUser(null)
    setDemoMode(false)
  }, [demoMode])

  /* ── Onboarding helpers ── */
  const getOnboardingData = useCallback(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ONBOARDING) || '{}') }
    catch (_) { return {} }
  }, [])

  const saveOnboardingData = useCallback((data) => {
    const merged = { ...getOnboardingData(), ...data }
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(merged))
  }, [getOnboardingData])

  const markOnboardingDone = useCallback(async () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true')
    if (!demoMode) {
      try { await authAPI.completeOnboarding(getOnboardingData()) } catch (_) {}
    }
  }, [demoMode, getOnboardingData])

  const isOnboardingDone = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true'
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      demoMode,
      serverDown,
      login,
      loginDemo,
      register,
      logout,
      saveOnboardingData,
      getOnboardingData,
      markOnboardingDone,
      isOnboardingDone,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
