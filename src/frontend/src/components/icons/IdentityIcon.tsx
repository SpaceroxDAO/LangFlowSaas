/**
 * Identity Icon - Person outline for Step 1
 */
interface IdentityIconProps {
  size?: number
  className?: string
  color?: string
}

export function IdentityIcon({ size = 48, className = '', color = 'currentColor' }: IdentityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head */}
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
      {/* Body */}
      <path
        d="M5.5 21C5.5 17.134 8.41 14 12 14C15.59 14 18.5 17.134 18.5 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
