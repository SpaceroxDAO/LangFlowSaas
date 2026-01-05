/**
 * Tricks Icon - Wrench outline for Step 3
 */
interface TricksIconProps {
  size?: number
  className?: string
  color?: string
}

export function TricksIcon({ size = 48, className = '', color = 'currentColor' }: TricksIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.7 6.3C14.3 5.9 13.7 5.9 13.3 6.3L6.3 13.3C5.9 13.7 5.9 14.3 6.3 14.7L9.3 17.7C9.7 18.1 10.3 18.1 10.7 17.7L17.7 10.7C18.1 10.3 18.1 9.7 17.7 9.3L14.7 6.3Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19L7 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 5C19 5 21 7 19 9L17 7L19 5Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
