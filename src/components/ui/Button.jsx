/**
 * Button — Design system primary interactive element.
 * Variants: primary (blue), secondary, ghost, danger, outline, gradient.
 */
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const variants = {
  primary:
    'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/30 shadow-btn-primary',
  secondary:
    'bg-white/[0.06] hover:bg-white/[0.09] text-gray-200 border border-white/[0.1] hover:border-white/[0.15]',
  ghost:
    'bg-transparent hover:bg-white/[0.05] text-gray-400 hover:text-gray-200 border border-transparent hover:border-white/[0.08]',
  danger:
    'bg-red-500/10 hover:bg-red-500/15 text-red-400 border border-red-500/20 hover:border-red-400/40',
  outline:
    'bg-transparent border border-white/[0.1] hover:border-white/[0.18] text-gray-300 hover:text-white hover:bg-white/[0.04]',
  gradient:
    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-btn-primary',
  teal:
    'bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/25 hover:border-teal-400/40',
}

const sizes = {
  xs: 'h-6 px-2.5 text-xs rounded-md gap-1',
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-10 px-5 text-sm rounded-xl gap-2',
  xl: 'h-12 px-6 text-base rounded-xl gap-2.5',
}

const iconSizes = { xs: 11, sm: 13, md: 14, lg: 15, xl: 17 }

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  className = '',
  disabled  = false,
  loading   = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  type    = 'button',
  fullWidth = false,
  ...props
}) {
  const iconSize = iconSizes[size] || 14

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-base cursor-pointer select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant] || variants.primary,
        sizes[size]   || sizes.md,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <span
          className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0"
          aria-hidden="true"
        />
      ) : Icon ? (
        <Icon size={iconSize} aria-hidden="true" className="flex-shrink-0" />
      ) : null}

      {children}

      {IconRight && !loading && (
        <IconRight size={iconSize} aria-hidden="true" className="flex-shrink-0" />
      )}
    </motion.button>
  )
}
