import { clsx } from 'clsx'

const sizes = {
  xs: 'h-6 w-6 text-2xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const statusColors = {
  online: 'bg-emerald-400',
  offline: 'bg-gray-500',
  busy: 'bg-amber-400',
  away: 'bg-orange-400',
}

export default function Avatar({
  src,
  alt = 'User avatar',
  name,
  size = 'md',
  status,
  className = '',
}) {
  // Generate initials from name
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  // Generate gradient color from name
  const colors = [
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-cyan-600',
    'from-orange-500 to-red-600',
    'from-violet-500 to-purple-600',
    'from-blue-500 to-indigo-600',
  ]
  const colorIndex = name
    ? name.charCodeAt(0) % colors.length
    : 0

  return (
    <div className={clsx('relative inline-flex flex-shrink-0', className)}>
      <div
        className={clsx(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className={clsx('h-full w-full flex items-center justify-center bg-gradient-to-br text-white', colors[colorIndex])}>
            {initials}
          </div>
        )}
      </div>
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-bg-primary',
            statusColors[status],
            size === 'xs' || size === 'sm' ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5'
          )}
        />
      )}
    </div>
  )
}
