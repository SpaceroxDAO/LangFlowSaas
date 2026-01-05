/**
 * Coaching Icon - Brain outline for Step 2
 */
interface CoachingIconProps {
  size?: number
  className?: string
  color?: string
}

export function CoachingIcon({ size = 48, className = '', color = 'currentColor' }: CoachingIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain shape - simplified */}
      <path
        d="M12 4C8.5 4 6 6.5 6 9C6 10.5 6.5 11.5 7 12.5C6.5 13.5 6 14.5 6 16C6 18.5 8 20 10 20H14C16 20 18 18.5 18 16C18 14.5 17.5 13.5 17 12.5C17.5 11.5 18 10.5 18 9C18 6.5 15.5 4 12 4Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Brain center line */}
      <path
        d="M12 4V20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Brain folds left */}
      <path
        d="M9 8C8 8.5 7.5 9 7.5 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 14C8 14.5 7.5 15 7.5 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Brain folds right */}
      <path
        d="M15 8C16 8.5 16.5 9 16.5 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 14C16 14.5 16.5 15 16.5 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
