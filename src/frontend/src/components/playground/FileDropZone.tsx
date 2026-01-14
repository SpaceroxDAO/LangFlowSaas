/**
 * FileDropZone - Drag and drop area for file uploads
 *
 * Features:
 * - Drag and drop file upload
 * - Clipboard paste for images
 * - Visual feedback during drag
 */

import { useState, useCallback, useRef, type ReactNode, type DragEvent, type ClipboardEvent } from 'react'

interface FileDropZoneProps {
  children: ReactNode
  onFilesAdded: (files: FileList | File[]) => void
  disabled?: boolean
}

export function FileDropZone({ children, onFilesAdded, disabled }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      dragCounterRef.current++
      if (e.dataTransfer?.items?.length) {
        setIsDragging(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(false)
      dragCounterRef.current = 0

      if (disabled) return

      const files = e.dataTransfer?.files
      if (files?.length) {
        onFilesAdded(files)
      }
    },
    [disabled, onFilesAdded]
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (disabled) return

      const items = e.clipboardData?.items
      if (!items) return

      const files: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) {
            files.push(file)
          }
        }
      }

      if (files.length > 0) {
        onFilesAdded(files)
      }
    },
    [disabled, onFilesAdded]
  )

  return (
    <div
      className="relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      {children}

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-violet-50 border-2 border-dashed border-violet-400 rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-violet-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-violet-600 font-medium">Drop files here</p>
            <p className="text-violet-400 text-sm">Max 10MB per file</p>
          </div>
        </div>
      )}
    </div>
  )
}
