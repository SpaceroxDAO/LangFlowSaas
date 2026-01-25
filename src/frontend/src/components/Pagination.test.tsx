/**
 * Pagination Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    onPageChange: vi.fn(),
  }

  describe('rendering', () => {
    it('renders pagination controls', () => {
      render(<Pagination {...defaultProps} />)
      expect(screen.getByText('1-10 of 50 agents')).toBeInTheDocument()
      expect(screen.getByText('of 5 pages')).toBeInTheDocument()
    })

    it('returns null when totalPages is 1', () => {
      const { container } = render(
        <Pagination {...defaultProps} totalPages={1} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('shows correct item range on middle page', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)
      expect(screen.getByText('21-30 of 50 agents')).toBeInTheDocument()
    })

    it('shows correct item range on last page with partial items', () => {
      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          totalItems={45}
        />
      )
      expect(screen.getByText('41-45 of 45 agents')).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls onPageChange with previous page when previous button is clicked', () => {
      const onPageChange = vi.fn()
      render(
        <Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />
      )

      // Find and click the previous button (first button)
      const buttons = screen.getAllByRole('button')
      fireEvent.click(buttons[0])

      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('calls onPageChange with next page when next button is clicked', () => {
      const onPageChange = vi.fn()
      render(
        <Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />
      )

      // Find and click the next button (last button)
      const buttons = screen.getAllByRole('button')
      fireEvent.click(buttons[1])

      expect(onPageChange).toHaveBeenCalledWith(4)
    })

    it('disables previous button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeDisabled()
    })

    it('disables next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons[1]).toBeDisabled()
    })

    it('calls onPageChange when selecting page from dropdown', () => {
      const onPageChange = vi.fn()
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />)

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: '3' } })

      expect(onPageChange).toHaveBeenCalledWith(3)
    })
  })

  describe('dropdown options', () => {
    it('renders correct number of page options', () => {
      render(<Pagination {...defaultProps} />)

      const select = screen.getByRole('combobox')
      const options = select.querySelectorAll('option')

      expect(options).toHaveLength(5)
    })

    it('shows current page as selected', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)

      const select = screen.getByRole('combobox')
      expect(select).toHaveValue('3')
    })
  })
})
