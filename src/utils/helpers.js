// Utility helper functions

/**
 * Clamp a number between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * Format a number as a percentage string
 */
export const toPercent = (value, total = 100) =>
  `${Math.round(clamp((value / total) * 100, 0, 100))}%`

/**
 * Truncate a string to a given length
 */
export const truncate = (str, length = 50) =>
  str.length > length ? `${str.substring(0, length)}...` : str

/**
 * Generate initials from a full name
 */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

/**
 * Format relative time (e.g. "2 hours ago")
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  const intervals = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [interval, label] of intervals) {
    const count = Math.floor(seconds / interval)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

/**
 * Sleep utility for async delays
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
