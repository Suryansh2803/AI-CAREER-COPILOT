import { clsx } from 'clsx'
import { motion } from 'framer-motion'

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  sublabel,
  variant = 'cyan',
  size = 'md',
  showValue = false,
  animate = true,
  className = '',
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const trackColors = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    gradient: 'bg-gradient-to-r from-cyan-500 to-purple-600',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }

  const heights = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
          {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
          {showValue && <span className="text-xs font-semibold text-cyan-400">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-gray-800 rounded-full overflow-hidden', heights[size])}>
        {animate ? (
          <motion.div
            className={clsx('h-full rounded-full', trackColors[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          />
        ) : (
          <div
            className={clsx('h-full rounded-full transition-all duration-500', trackColors[variant])}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
    </div>
  )
}
