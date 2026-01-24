import React from 'react'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

// Generate gradient color based on index
export const getGradientColor = (index: number): string => {
  const colors = [
    'from-emerald-500 to-teal-400',
    'from-blue-500 to-indigo-400',
    'from-purple-500 to-violet-400',
    'from-amber-500 to-orange-400',
    'from-rose-500 to-pink-400',
    'from-cyan-500 to-blue-400',
    'from-lime-500 to-green-400',
    'from-fuchsia-500 to-purple-400',
  ]
  return colors[index % colors.length]
}

// Get health icon based on status
export const getHealthIcon = (status: string): React.ReactNode => {
  switch (status) {
    case 'healthy':
      return React.createElement(CheckCircle, { className: 'w-4 h-4 text-green-500' })
    case 'unhealthy':
      return React.createElement(XCircle, { className: 'w-4 h-4 text-red-500' })
    default:
      return React.createElement(AlertTriangle, { className: 'w-4 h-4 text-yellow-500' })
  }
}
