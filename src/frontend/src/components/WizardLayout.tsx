/**
 * WizardLayout - Split-panel layout for create/edit wizard
 * Left panel: Solid color info card with step details
 * Right panel: White card with form content
 */
import type { ReactNode } from 'react'

type StepTheme = 'violet' | 'pink' | 'orange'

interface WizardLayoutProps {
  step: number
  totalSteps: number
  theme: StepTheme
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}

const themeStyles: Record<StepTheme, { bg: string; iconBg: string; dotActive: string }> = {
  violet: {
    bg: 'bg-violet-500',
    iconBg: 'bg-white/20',
    dotActive: 'bg-white',
  },
  pink: {
    bg: 'bg-pink-500',
    iconBg: 'bg-white/20',
    dotActive: 'bg-white',
  },
  orange: {
    bg: 'bg-emerald-500',
    iconBg: 'bg-white/20',
    dotActive: 'bg-white',
  },
}

export function WizardLayout({
  step,
  totalSteps,
  theme,
  title,
  description,
  icon,
  children,
}: WizardLayoutProps) {
  const styles = themeStyles[theme]

  return (
    <div
      className="min-h-full flex items-center justify-center px-4 py-8 bg-[#fafafa] dark:bg-neutral-950"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--dot-color, #e5e7eb) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        ['--dot-color' as string]: 'var(--tw-dark, #333) var(--tw-light, #e5e7eb)',
      }}
    >
      <style>{`.dark [style*="--dot-color"] { --dot-color: #333 !important; }`}</style>
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Info Card */}
        <div
          className={`lg:w-[360px] flex-shrink-0 ${styles.bg} rounded-3xl p-8 text-white flex flex-col relative overflow-hidden`}
        >
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />

          {/* Icon */}
          <div className={`relative w-16 h-16 ${styles.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/10`}>
            {icon}
          </div>

          {/* Title */}
          <h2 className="relative text-2xl font-bold mb-4">{title}</h2>

          {/* Description */}
          <p className="relative text-white/90 leading-relaxed flex-1">{description}</p>

          {/* Step Indicator Dots */}
          <div className="relative flex gap-2 mt-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index + 1 === step
                    ? `w-8 ${styles.dotActive}`
                    : index + 1 < step
                    ? 'w-2 bg-white/60'
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Form Card */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
