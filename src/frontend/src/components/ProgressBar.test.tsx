/**
 * ProgressBar Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  describe('rendering', () => {
    it('renders the correct number of steps', () => {
      const { container } = render(<ProgressBar currentStep={1} totalSteps={3} />)
      const segments = container.querySelectorAll('.h-1.w-12')
      expect(segments).toHaveLength(3)
    })

    it('renders 4 steps when totalSteps is 4', () => {
      const { container } = render(<ProgressBar currentStep={1} totalSteps={4} />)
      const segments = container.querySelectorAll('.h-1.w-12')
      expect(segments).toHaveLength(4)
    })
  })

  describe('step coloring', () => {
    it('colors completed steps appropriately', () => {
      const { container } = render(<ProgressBar currentStep={2} totalSteps={3} />)
      const segments = container.querySelectorAll('.h-1.w-12')

      // First step should be violet (completed)
      expect(segments[0]).toHaveClass('bg-violet-500')
      // Second step should be pink (completed)
      expect(segments[1]).toHaveClass('bg-pink-500')
      // Third step should be gray (incomplete)
      expect(segments[2]).toHaveClass('bg-gray-200')
    })

    it('shows all steps as gray when currentStep is 0', () => {
      const { container } = render(<ProgressBar currentStep={0} totalSteps={3} />)
      const segments = container.querySelectorAll('.h-1.w-12')

      segments.forEach((segment) => {
        expect(segment).toHaveClass('bg-gray-200')
      })
    })

    it('colors all steps when currentStep equals totalSteps', () => {
      const { container } = render(<ProgressBar currentStep={3} totalSteps={3} />)
      const segments = container.querySelectorAll('.h-1.w-12')

      expect(segments[0]).toHaveClass('bg-violet-500')
      expect(segments[1]).toHaveClass('bg-pink-500')
      expect(segments[2]).toHaveClass('bg-violet-500')
    })

    it('uses correct color sequence for 4 steps', () => {
      const { container } = render(<ProgressBar currentStep={4} totalSteps={4} />)
      const segments = container.querySelectorAll('.h-1.w-12')

      expect(segments[0]).toHaveClass('bg-violet-500') // Step 1
      expect(segments[1]).toHaveClass('bg-pink-500')   // Step 2
      expect(segments[2]).toHaveClass('bg-violet-500') // Step 3
      expect(segments[3]).toHaveClass('bg-green-500')  // Step 4
    })
  })

  describe('edge cases', () => {
    it('renders with single step', () => {
      const { container } = render(<ProgressBar currentStep={1} totalSteps={1} />)
      const segments = container.querySelectorAll('.h-1.w-12')

      expect(segments).toHaveLength(1)
      expect(segments[0]).toHaveClass('bg-violet-500')
    })

    it('handles currentStep greater than totalSteps gracefully', () => {
      const { container } = render(<ProgressBar currentStep={10} totalSteps={3} />)
      const segments = container.querySelectorAll('.h-1.w-12')

      // All steps should be colored when currentStep > totalSteps
      expect(segments).toHaveLength(3)
      expect(segments[0]).toHaveClass('bg-violet-500')
      expect(segments[1]).toHaveClass('bg-pink-500')
      expect(segments[2]).toHaveClass('bg-violet-500')
    })
  })
})
