import { clsx } from 'clsx'

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-4',
}

const variants = {
  cyan: 'border-cyan-500 border-t-transparent',
  purple: 'border-purple-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-400 border-t-transparent',
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'cyan',
  className = '',
  fullScreen = false,
  label,
}) {
  const spinner = (
    <div className={clsx('flex flex-col items-center gap-3', className)}>
      <div
        className={clsx(
          'rounded-full animate-spin',
          sizes[size],
          variants[variant]
        )}
      />
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}
