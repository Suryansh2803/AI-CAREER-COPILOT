/**
 * RadarChart — Pure SVG skill radar for Career Twin
 * No external dependencies. Clean, readable polygon rendering.
 */

function polarToCartesian(cx, cy, r, angleRad) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  }
}

function buildPolygonPoints(cx, cy, r, n, values, maxVal, startAngle = -Math.PI / 2) {
  return values.map((v, i) => {
    const angle = startAngle + (2 * Math.PI / n) * i
    const rScaled = (v / maxVal) * r
    const pt = polarToCartesian(cx, cy, rScaled, angle)
    return `${pt.x},${pt.y}`
  }).join(' ')
}

export default function RadarChart({
  data = [],         // [{ label, value, fullMark }]
  size = 220,
  rings = 4,
  primaryColor = '#3b82f6',
  compareColor = '#14b8a6',
  compareData = null, // optional second dataset (What-If)
  className = '',
}) {
  const cx = size / 2
  const cy = size / 2
  const r  = (size / 2) - 32   // inner radius leaves room for labels
  const n  = data.length
  const angleStep = (2 * Math.PI) / n
  const startAngle = -Math.PI / 2

  if (!data.length) return null

  const values     = data.map(d => d.value)
  const fullMark   = data[0]?.fullMark || 100
  const cmpValues  = compareData ? compareData.map(d => d.value) : null

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label="Skill radar chart"
        role="img"
      >
        <defs>
          <radialGradient id="radar-fill-primary" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={primaryColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id="radar-fill-compare" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={compareColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={compareColor} stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* ── Grid rings ── */}
        {Array.from({ length: rings }).map((_, i) => {
          const ri = (r / rings) * (i + 1)
          const pts = Array.from({ length: n }).map((__, j) => {
            const angle = startAngle + angleStep * j
            const pt = polarToCartesian(cx, cy, ri, angle)
            return `${pt.x},${pt.y}`
          }).join(' ')
          return (
            <polygon
              key={i}
              points={pts}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          )
        })}

        {/* ── Axis lines ── */}
        {data.map((_, i) => {
          const angle = startAngle + angleStep * i
          const outer = polarToCartesian(cx, cy, r, angle)
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={outer.x} y2={outer.y}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          )
        })}

        {/* ── Compare polygon (What-If) ── */}
        {cmpValues && (
          <polygon
            points={buildPolygonPoints(cx, cy, r, n, cmpValues, fullMark, startAngle)}
            fill="url(#radar-fill-compare)"
            stroke={compareColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.85"
          />
        )}

        {/* ── Primary polygon ── */}
        <polygon
          points={buildPolygonPoints(cx, cy, r, n, values, fullMark, startAngle)}
          fill="url(#radar-fill-primary)"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* ── Data point dots ── */}
        {values.map((v, i) => {
          const angle = startAngle + angleStep * i
          const rScaled = (v / fullMark) * r
          const pt = polarToCartesian(cx, cy, rScaled, angle)
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={3}
              fill={primaryColor}
              stroke="#07090F"
              strokeWidth="1.5"
            />
          )
        })}

        {/* ── Axis labels ── */}
        {data.map((d, i) => {
          const angle  = startAngle + angleStep * i
          const labelR = r + 20
          const pt     = polarToCartesian(cx, cy, labelR, angle)
          const anchor = Math.abs(pt.x - cx) < 5 ? 'middle' : pt.x > cx ? 'start' : 'end'
          return (
            <text
              key={i}
              x={pt.x}
              y={pt.y}
              textAnchor={anchor}
              dominantBaseline="central"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
              fill="#6b7280"
            >
              {d.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
