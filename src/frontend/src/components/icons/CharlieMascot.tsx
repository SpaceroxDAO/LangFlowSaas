/**
 * Charlie Mascot Icon - Cute dog face used as brand mascot
 */
interface CharlieMascotProps {
  size?: number
  className?: string
}

export function CharlieMascot({ size = 80, className = '' }: CharlieMascotProps) {
  return (
    <div
      className={`bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dog face outline */}
        <circle cx="24" cy="26" r="16" stroke="white" strokeWidth="2.5" fill="none" />

        {/* Ears */}
        <ellipse cx="12" cy="16" rx="5" ry="7" stroke="white" strokeWidth="2.5" fill="none" />
        <ellipse cx="36" cy="16" rx="5" ry="7" stroke="white" strokeWidth="2.5" fill="none" />

        {/* Eyes */}
        <circle cx="18" cy="24" r="2.5" fill="white" />
        <circle cx="30" cy="24" r="2.5" fill="white" />

        {/* Nose */}
        <ellipse cx="24" cy="30" rx="3" ry="2" fill="white" />

        {/* Mouth */}
        <path
          d="M20 34 Q24 37 28 34"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
