import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Construction } from 'lucide-react'
import Button from './Button'
import Badge from './Badge'

export default function PlaceholderPage({
  title,
  description,
  icon: Icon,
  phase = 'Phase 2',
  color = 'cyan',
  features = [],
}) {
  const colors = {
    cyan: {
      icon: 'bg-cyan-500/15 border-cyan-500/25 text-cyan-400',
      badge: 'cyan',
      glow: 'bg-cyan-500/5',
    },
    purple: {
      icon: 'bg-purple-500/15 border-purple-500/25 text-purple-400',
      badge: 'purple',
      glow: 'bg-purple-500/5',
    },
    blue: {
      icon: 'bg-blue-500/15 border-blue-500/25 text-blue-400',
      badge: 'blue',
      glow: 'bg-blue-500/5',
    },
  }

  const c = colors[color] || colors.cyan

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      {/* Ambient glow */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
        <div className={`w-96 h-96 ${c.glow} rounded-full blur-3xl opacity-30`} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10"
      >
        {/* Icon */}
        <div className={`inline-flex p-5 rounded-3xl border mb-6 ${c.icon}`}>
          {Icon && <Icon size={36} />}
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <Badge variant={c.badge}>Coming in {phase}</Badge>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">{description}</p>

        {/* Feature preview */}
        {features.length > 0 && (
          <div className="bg-card border border-card-border rounded-2xl p-6 mb-8 text-left w-full max-w-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              What&apos;s coming
            </p>
            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 h-4 w-4 rounded-full border flex-shrink-0 ${c.icon} flex items-center justify-center`}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <span className="text-sm text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/dashboard">
            <Button variant="secondary" size="lg">
              ← Back to Dashboard
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="gradient" size="lg" iconRight={ArrowRight}>
              Complete Profile
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
