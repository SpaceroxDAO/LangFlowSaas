/**
 * MessageBubble Component Tests
 *
 * Tests for the chat message bubble component.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { MessageBubble, MessageBubbleProps } from './MessageBubble'
import { createMockMessage } from '@/test/test-utils'

// Default props for tests
const defaultProps: MessageBubbleProps = {
  message: createMockMessage(),
  avatarUrl: null,
  entityName: 'Charlie',
  onCopy: vi.fn(),
  isCopied: false,
  isLast: false,
}

describe('MessageBubble', () => {
  describe('rendering', () => {
    it('renders user message content', () => {
      render(<MessageBubble {...defaultProps} />)
      expect(screen.getByText('Hello, world!')).toBeInTheDocument()
    })

    it('renders assistant message content with markdown', () => {
      const assistantMessage = createMockMessage({
        role: 'assistant',
        content: '**Bold text** and *italic*',
      })

      render(<MessageBubble {...defaultProps} message={assistantMessage} />)
      expect(screen.getByText('Bold text')).toBeInTheDocument()
    })

    it('renders user avatar for user messages', () => {
      render(<MessageBubble {...defaultProps} />)
      // User avatar is a violet circle with a user icon
      const avatarContainer = document.querySelector('.bg-violet-500')
      expect(avatarContainer).toBeInTheDocument()
    })

    it('renders agent avatar for assistant messages', () => {
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(<MessageBubble {...defaultProps} message={assistantMessage} />)

      // Agent avatar container should exist (violet-100 background)
      const avatarContainer = document.querySelector('.bg-violet-100')
      expect(avatarContainer).toBeInTheDocument()
    })

    it('renders custom avatar image when provided', () => {
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(
        <MessageBubble
          {...defaultProps}
          message={assistantMessage}
          avatarUrl="https://example.com/avatar.png"
        />
      )

      const avatar = screen.getByAltText('Charlie')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png')
    })
  })

  describe('message status', () => {
    it('shows "Sending..." for messages with sending status', () => {
      const sendingMessage = createMockMessage({ status: 'sending' })
      render(<MessageBubble {...defaultProps} message={sendingMessage} />)
      expect(screen.getByText('Sending...')).toBeInTheDocument()
    })

    it('shows "Failed to send" for messages with error status', () => {
      const errorMessage = createMockMessage({ status: 'error' })
      render(<MessageBubble {...defaultProps} message={errorMessage} />)
      expect(screen.getByText('Failed to send')).toBeInTheDocument()
    })

    it('shows "(edited)" indicator for edited messages', () => {
      const editedMessage = createMockMessage({ isEdited: true })
      render(<MessageBubble {...defaultProps} message={editedMessage} />)
      expect(screen.getByText('(edited)')).toBeInTheDocument()
    })
  })

  describe('copy functionality', () => {
    it('calls onCopy when copy button is clicked', async () => {
      const onCopy = vi.fn()
      render(<MessageBubble {...defaultProps} onCopy={onCopy} />)

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      // Click copy button
      const copyButton = screen.getByTitle('Copy message')
      fireEvent.click(copyButton)

      expect(onCopy).toHaveBeenCalledWith('Hello, world!')
    })

    it('shows checkmark icon when isCopied is true', () => {
      render(<MessageBubble {...defaultProps} isCopied={true} />)

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      // The copy button should have a green checkmark (indicated by text-green-500 class)
      const copyButton = screen.getByTitle('Copy message')
      const icon = copyButton.querySelector('svg')
      expect(icon).toHaveClass('text-green-500')
    })
  })

  describe('edit functionality', () => {
    it('shows edit button for user messages', () => {
      const onStartEdit = vi.fn()
      render(<MessageBubble {...defaultProps} onStartEdit={onStartEdit} />)

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      expect(screen.getByTitle('Edit message')).toBeInTheDocument()
    })

    it('does not show edit button for assistant messages', () => {
      const onStartEdit = vi.fn()
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(
        <MessageBubble
          {...defaultProps}
          message={assistantMessage}
          onStartEdit={onStartEdit}
        />
      )

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      expect(screen.queryByTitle('Edit message')).not.toBeInTheDocument()
    })

    it('calls onStartEdit when edit button is clicked', () => {
      const onStartEdit = vi.fn()
      render(<MessageBubble {...defaultProps} onStartEdit={onStartEdit} />)

      // Hover and click edit
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)
      fireEvent.click(screen.getByTitle('Edit message'))

      expect(onStartEdit).toHaveBeenCalledWith('Hello, world!')
    })

    it('shows textarea in edit mode', () => {
      render(
        <MessageBubble
          {...defaultProps}
          isEditing={true}
          editContent="Edited content"
          onEditContentChange={vi.fn()}
          onCancelEdit={vi.fn()}
          onSaveEdit={vi.fn()}
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveValue('Edited content')
    })

    it('calls onSaveEdit when save button is clicked', () => {
      const onSaveEdit = vi.fn()
      render(
        <MessageBubble
          {...defaultProps}
          isEditing={true}
          editContent="Edited content"
          onEditContentChange={vi.fn()}
          onCancelEdit={vi.fn()}
          onSaveEdit={onSaveEdit}
        />
      )

      fireEvent.click(screen.getByText('Save'))
      expect(onSaveEdit).toHaveBeenCalled()
    })

    it('calls onCancelEdit when cancel button is clicked', () => {
      const onCancelEdit = vi.fn()
      render(
        <MessageBubble
          {...defaultProps}
          isEditing={true}
          editContent="Edited content"
          onEditContentChange={vi.fn()}
          onCancelEdit={onCancelEdit}
          onSaveEdit={vi.fn()}
        />
      )

      fireEvent.click(screen.getByText('Cancel'))
      expect(onCancelEdit).toHaveBeenCalled()
    })
  })

  describe('delete functionality', () => {
    it('shows delete button when onStartDelete is provided', () => {
      const onStartDelete = vi.fn()
      render(<MessageBubble {...defaultProps} onStartDelete={onStartDelete} />)

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      expect(screen.getByTitle('Delete message')).toBeInTheDocument()
    })

    it('shows confirmation buttons when deleting', () => {
      render(
        <MessageBubble
          {...defaultProps}
          isDeleting={true}
          onConfirmDelete={vi.fn()}
          onCancelDelete={vi.fn()}
        />
      )

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      expect(screen.getByTitle('Confirm delete')).toBeInTheDocument()
      expect(screen.getByTitle('Cancel')).toBeInTheDocument()
    })

    it('calls onConfirmDelete when confirm is clicked', () => {
      const onConfirmDelete = vi.fn()
      render(
        <MessageBubble
          {...defaultProps}
          isDeleting={true}
          onConfirmDelete={onConfirmDelete}
          onCancelDelete={vi.fn()}
        />
      )

      // Hover and confirm
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)
      fireEvent.click(screen.getByTitle('Confirm delete'))

      expect(onConfirmDelete).toHaveBeenCalled()
    })
  })

  describe('feedback functionality', () => {
    it('shows feedback buttons for assistant messages', () => {
      const onFeedback = vi.fn()
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(
        <MessageBubble
          {...defaultProps}
          message={assistantMessage}
          onFeedback={onFeedback}
        />
      )

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      expect(screen.getByTitle('Good response')).toBeInTheDocument()
      expect(screen.getByTitle('Bad response')).toBeInTheDocument()
    })

    it('does not show feedback buttons for user messages', () => {
      const onFeedback = vi.fn()
      render(<MessageBubble {...defaultProps} onFeedback={onFeedback} />)

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      expect(screen.queryByTitle('Good response')).not.toBeInTheDocument()
    })

    it('calls onFeedback with "positive" when thumbs up is clicked', () => {
      const onFeedback = vi.fn()
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(
        <MessageBubble
          {...defaultProps}
          message={assistantMessage}
          onFeedback={onFeedback}
        />
      )

      // Hover and click thumbs up
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)
      fireEvent.click(screen.getByTitle('Good response'))

      expect(onFeedback).toHaveBeenCalledWith('positive')
    })

    it('calls onFeedback with "negative" when thumbs down is clicked', () => {
      const onFeedback = vi.fn()
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(
        <MessageBubble
          {...defaultProps}
          message={assistantMessage}
          onFeedback={onFeedback}
        />
      )

      // Hover and click thumbs down
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)
      fireEvent.click(screen.getByTitle('Bad response'))

      expect(onFeedback).toHaveBeenCalledWith('negative')
    })
  })

  describe('regenerate functionality', () => {
    it('shows regenerate button for last assistant message', () => {
      const onRegenerate = vi.fn()
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(
        <MessageBubble
          {...defaultProps}
          message={assistantMessage}
          isLast={true}
          onRegenerate={onRegenerate}
        />
      )

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      expect(screen.getByTitle('Regenerate response')).toBeInTheDocument()
    })

    it('does not show regenerate button for non-last messages', () => {
      const onRegenerate = vi.fn()
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(
        <MessageBubble
          {...defaultProps}
          message={assistantMessage}
          isLast={false}
          onRegenerate={onRegenerate}
        />
      )

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      expect(screen.queryByTitle('Regenerate response')).not.toBeInTheDocument()
    })

    it('disables regenerate button when regenerating', () => {
      const onRegenerate = vi.fn()
      const assistantMessage = createMockMessage({ role: 'assistant' })
      render(
        <MessageBubble
          {...defaultProps}
          message={assistantMessage}
          isLast={true}
          onRegenerate={onRegenerate}
          isRegenerating={true}
        />
      )

      // Hover to show action buttons
      const bubble = screen.getByText('Hello, world!').closest('div')!
      fireEvent.mouseEnter(bubble.parentElement!.parentElement!)

      const regenButton = screen.getByTitle('Regenerate response')
      expect(regenButton).toBeDisabled()
    })
  })
})
