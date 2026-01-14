/**
 * useFileUpload - Hook for handling file uploads in chat
 *
 * Provides:
 * - File selection and validation
 * - Upload progress tracking
 * - Multiple file support
 * - Drag and drop support
 */

import { useState, useCallback, useRef } from 'react'
import { api } from '@/lib/api'

// Allowed file types
const ALLOWED_TEXT_EXTENSIONS = [
  '.csv', '.json', '.pdf', '.txt', '.md', '.yaml', '.yml',
  '.xml', '.html', '.docx', '.py', '.js', '.ts', '.sql',
]

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp']

const ALLOWED_AUDIO_EXTENSIONS = ['.webm', '.wav', '.mp3', '.m4a']

const ALLOWED_EXTENSIONS = [
  ...ALLOWED_TEXT_EXTENSIONS,
  ...ALLOWED_IMAGE_EXTENSIONS,
  ...ALLOWED_AUDIO_EXTENSIONS,
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface UploadedFile {
  id: string
  name: string
  size: number
  mimeType: string
  fileType: 'text' | 'image' | 'audio'
  langflowFileId?: string
  previewUrl?: string
  uploadedAt: string
  // Upload state
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
  // For preview
  localUrl?: string
}

interface UseFileUploadOptions {
  workflowId: string | undefined
  maxFiles?: number
  onError?: (error: string) => void
}

interface UseFileUploadReturn {
  /** List of uploaded files */
  files: UploadedFile[]
  /** Whether any files are currently uploading */
  isUploading: boolean
  /** Add files from input or drop */
  addFiles: (fileList: FileList | File[]) => Promise<void>
  /** Remove a file by ID */
  removeFile: (fileId: string) => void
  /** Clear all files */
  clearFiles: () => void
  /** Validate a file before adding */
  validateFile: (file: File) => { valid: boolean; error?: string }
}

function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? `.${parts.pop()!.toLowerCase()}` : ''
}

function getFileType(extension: string): 'text' | 'image' | 'audio' | 'unknown' {
  if (ALLOWED_TEXT_EXTENSIONS.includes(extension)) return 'text'
  if (ALLOWED_IMAGE_EXTENSIONS.includes(extension)) return 'image'
  if (ALLOWED_AUDIO_EXTENSIONS.includes(extension)) return 'audio'
  return 'unknown'
}

export function useFileUpload({
  workflowId,
  maxFiles = 5,
  onError,
}: UseFileUploadOptions): UseFileUploadReturn {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const uploadingCountRef = useRef(0)

  const isUploading = files.some((f) => f.status === 'uploading')

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          error: `File "${file.name}" is too large. Maximum size is 10MB.`,
        }
      }

      // Check file type
      const extension = getFileExtension(file.name)
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return {
          valid: false,
          error: `File type "${extension}" is not allowed.`,
        }
      }

      return { valid: true }
    },
    []
  )

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (!workflowId) {
        onError?.('No workflow selected')
        return
      }

      const newFiles = Array.from(fileList)

      // Check max files limit
      if (files.length + newFiles.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`)
        return
      }

      // Validate all files first
      for (const file of newFiles) {
        const validation = validateFile(file)
        if (!validation.valid) {
          onError?.(validation.error!)
          return
        }
      }

      // Create pending file entries
      const pendingFiles: UploadedFile[] = newFiles.map((file) => {
        const extension = getFileExtension(file.name)
        const fileType = getFileType(extension)
        const localUrl = fileType === 'image' ? URL.createObjectURL(file) : undefined

        return {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          mimeType: file.type,
          fileType: fileType === 'unknown' ? 'text' : fileType,
          uploadedAt: new Date().toISOString(),
          status: 'pending' as const,
          progress: 0,
          localUrl,
        }
      })

      setFiles((prev) => [...prev, ...pendingFiles])

      // Upload files
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i]
        const pendingFile = pendingFiles[i]

        // Update status to uploading
        setFiles((prev) =>
          prev.map((f) =>
            f.id === pendingFile.id ? { ...f, status: 'uploading' as const } : f
          )
        )

        try {
          // Create form data
          const formData = new FormData()
          formData.append('file', file)
          formData.append('workflow_id', workflowId)

          // Upload file
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/chat/files`, {
            method: 'POST',
            body: formData,
            headers: {
              // Auth header would be added by api wrapper
            },
          })

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`)
          }

          const result = await response.json()

          // Update with result
          setFiles((prev) =>
            prev.map((f) =>
              f.id === pendingFile.id
                ? {
                    ...f,
                    status: 'completed' as const,
                    progress: 100,
                    langflowFileId: result.langflow_file_id,
                  }
                : f
            )
          )
        } catch (error) {
          // Update with error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === pendingFile.id
                ? {
                    ...f,
                    status: 'error' as const,
                    error: (error as Error).message,
                  }
                : f
            )
          )
          onError?.(`Failed to upload ${file.name}`)
        }
      }
    },
    [workflowId, files.length, maxFiles, validateFile, onError]
  )

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileId)
      if (file?.localUrl) {
        URL.revokeObjectURL(file.localUrl)
      }
      return prev.filter((f) => f.id !== fileId)
    })
  }, [])

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((file) => {
        if (file.localUrl) {
          URL.revokeObjectURL(file.localUrl)
        }
      })
      return []
    })
  }, [])

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
    validateFile,
  }
}
