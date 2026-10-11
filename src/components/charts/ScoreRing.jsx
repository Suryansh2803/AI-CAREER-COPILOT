/**
 * ScoreRing — Clean circular score visualization
 * No animation library dependency; uses SVG stroke-dasharray.
 */
import { useEffect, useRef, useState } from 'react'

export default function ScoreRing({
  value = 78,
  max = 100,
  size = 140,
  strokeWidth = 10,
  color = 'blue',     // 'blue' | 'teal' | 'purple' | 'gradient'
  label = 'Score',
  sublabel,
  animate = true,
  className = '',
}) {
  const [displayed, setDisplayed] = useState(animate ? 0 : value)
  const radius    = (size - strokeWidth) / 2
  const circ      = 2 * Math.PI * radius
  const progress  = Math.min(100, Math.max(0, (displayed / max) * 100))
  const offset    = circ - (progress / 100) * circ

  // Animate the number counter
  useEffect(() => {
    if (!animate) { setDisplayed(value); return }
    const start = Date.now()
    const duration = 1200
    const from = 0
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start
      const t = Math.min(1, elapsed / duration)
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayed(Math.round(from + (value - from) * eased))
      if (t < 1) requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [value, animate])

  const gradId = `ring-grad-${color}`

  const strokeColors = {
    blue:    '#3b82f6',
    teal:    '#14b8a6',
    purple:  '#a855f7',
    indigo:  '#6366f1',
    amber:   '#f59e0b',
  }

  const textColors = {
    blue:   'text-blue-400',
    teal:   'text-teal-400',
    purple: 'text-purple-400',
    indigo: 'text-indigo-400',
    amber:  'text-amber-400',
  }

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${value} out of ${max}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#3b82f6" />
            <stop offset="50%"  stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color === 'gradient' ? `url(#${gradId})` : strokeColors[color] || strokeColors.blue}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          style={{
            transition: animate
              ? 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl font-extrabold text-white leading-none tabular-nums">
            {displayed}
          </span>
          <span className="text-xs text-gray-500 font-medium">/{max}</span>
        </div>
        {label && (
          <span className={`text-2xs font-semibold uppercase tracking-wider mt-1 ${textColors[color] || 'text-blue-400'}`}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-2xs text-gray-600 mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  )
}
