/**
 * WizardLayout - Split-panel layout for create/edit wizard
 * Left panel: Gradient info card with step details
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

const themeStyles: Record<StepTheme, { gradient: string; iconBg: string }> = {
  violet: {
    gradient: 'from-violet-500 to-violet-600',
    iconBg: 'bg-white/20',
  },
  pink: {
    gradient: 'from-pink-500 to-pink-600',
    iconBg: 'bg-white/20',
  },
  orange: {
    gradient: 'from-violet-400 to-violet-500',
    iconBg: 'bg-white/20',
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
      className="min-h-full flex items-center justify-center px-4 py-8"
      style={{
        backgroundColor: '#fafafa',
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Info Card */}
        <div
          className={`lg:w-[360px] flex-shrink-0 bg-gradient-to-br ${styles.gradient} rounded-3xl p-8 text-white flex flex-col`}
        >
          {/* Icon */}
          <div className={`w-16 h-16 ${styles.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
            {icon}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-4">{title}</h2>

          {/* Description */}
          <p className="text-white/90 leading-relaxed flex-1">{description}</p>

          {/* Step Indicator Dots */}
          <div className="flex gap-2 mt-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index + 1 === step
                    ? 'w-8 bg-white'
                    : index + 1 < step
                    ? 'w-2 bg-white/60'
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Form Card */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
