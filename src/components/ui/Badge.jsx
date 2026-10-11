/**
 * Badge — Inline status and label chip.
 * Matches the new design system (blue primary, teal success).
 */
import { clsx } from 'clsx'

const variants = {
  default:  'bg-white/[0.06] text-gray-400 border border-white/[0.1]',
  blue:     'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  teal:     'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  indigo:   'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  purple:   'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  cyan:     'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  green:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  yellow:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  red:      'bg-red-500/10 text-red-400 border border-red-500/20',
  orange:   'bg-orange-500/10 text-orange-400 border border-orange-500/20',
}

const dotColors = {
  default: 'bg-gray-500',
  blue:    'bg-blue-400',
  teal:    'bg-teal-400',
  indigo:  'bg-indigo-400',
  purple:  'bg-purple-400',
  cyan:    'bg-cyan-400',
  green:   'bg-emerald-400',
  yellow:  'bg-amber-400',
  red:     'bg-red-400',
  orange:  'bg-orange-400',
}

const sizes = {
  sm: 'px-1.5 py-0.5 text-2xs',
  md: 'px-2    py-0.5 text-xs',
  lg: 'px-2.5  py-1   text-xs',
}

export default function Badge({
  children,
  variant  = 'default',
  size     = 'md',
  dot      = false,
  pulse    = false,
  className = '',
  ...props
}) {
  return (
    <span
      className={clsx(
        'badge',
        variants[variant] || variants.default,
        sizes[size]       || sizes.md,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx(
            'h-1.5 w-1.5 rounded-full flex-shrink-0',
            dotColors[variant] || 'bg-gray-500',
            pulse && 'animate-pulse'
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
