// Design tokens — mirrors tailwind.config.js values for use in JS/inline styles

export const colors = {
  bg: {
    primary: '#080B12',
    secondary: '#0D1117',
    tertiary: '#111827',
  },
  accent: {
    cyan: '#06b6d4',
    purple: '#a855f7',
    blue: '#3b82f6',
  },
  border: {
    default: 'rgba(255,255,255,0.06)',
    hover: 'rgba(255,255,255,0.1)',
  },
}

export const gradients = {
  primary: 'linear-gradient(135deg, #22d3ee, #a855f7)',
  cyanPurple: 'linear-gradient(to right, #06b6d4, #a855f7)',
  subtle: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1))',
}

export const shadows = {
  glowCyan: '0 0 20px rgba(6,182,212,0.25)',
  glowPurple: '0 0 20px rgba(168,85,247,0.25)',
  card: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
}

export const transitions = {
  fast: { duration: 0.15 },
  normal: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  slow: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
}

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}
