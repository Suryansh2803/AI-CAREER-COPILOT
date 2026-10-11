/**
 * Card — Base surface component.
 * Thin border, restrained shadow, optional hover lift.
 */
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export default function Card({
  children,
  className = '',
  hover     = false,
  padding   = false,   // default OFF — caller controls padding
  animate   = false,
  delay     = 0,
  onClick,
  ...props
}) {
  const Tag = animate ? motion.div : 'div'
  const motionProps = animate
    ? {
        initial:    { opacity: 0, y: 12 },
        animate:    { opacity: 1, y: 0 },
        transition: { duration: 0.25, delay, ease: [0.4, 0, 0.2, 1] },
      }
    : {}

  return (
    <Tag
      onClick={onClick}
      className={clsx(
        'card-base',
        padding && 'p-5',
        hover && 'card-hover',
        onClick && 'cursor-pointer',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Tag>
  )
}

// ── Composable sub-components ──────────────────────────────
Card.Header = function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={clsx('pb-4 border-b border-white/[0.07] mb-4', className)} {...props}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={clsx('text-sm font-semibold text-gray-100', className)}>
      {children}
    </h3>
  )
}

Card.Description = function CardDescription({ children, className = '' }) {
  return (
    <p className={clsx('text-xs text-gray-500 mt-0.5', className)}>
      {children}
    </p>
  )
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={clsx('pt-4 mt-4 border-t border-white/[0.07]', className)}>
      {children}
    </div>
  )
}

Card.Section = function CardSection({ children, className = '' }) {
  return (
    <div className={clsx('px-5 py-4', className)}>
      {children}
    </div>
  )
}
