import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', containerClassName = '', rows = 4, ...props },
  ref
) {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'input-base resize-none',
          error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  )
})

export default Textarea
