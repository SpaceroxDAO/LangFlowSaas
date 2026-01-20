import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UserFile } from '@/types'

export function FilesPage() {
  const queryClient = useQueryClient()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Fetch files from backend API
  const { data: filesResponse, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      return api.listFiles()
    },
  })

  const files = filesResponse?.files || []

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return api.uploadFile(file)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      setUploadError(null)
    },
    onError: (error) => {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      return api.deleteFile(fileId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      uploadMutation.mutate(droppedFiles[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      uploadMutation.mutate(selectedFiles[0])
    }
    // Reset input
    e.target.value = ''
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎥'
    if (type.startsWith('audio/')) return '🎵'
    if (type.includes('pdf')) return '📄'
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊'
    if (type.includes('document') || type.includes('word')) return '📝'
    if (type.includes('json')) return '📋'
    if (type.includes('csv')) return '📊'
    if (type.includes('text')) return '📝'
    return '📁'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Files</h1>
        <p className="text-gray-500 dark:text-neutral-400">Upload and manage files for your agents</p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center transition-colors ${
          isDragging
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
            : 'border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-500 dark:bg-neutral-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-neutral-300 mb-2">
          Drag and drop files here, or{' '}
          <label className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer font-medium">
            browse
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.txt,.doc,.docx,.csv,.json,.md,.xlsx,.xls"
            />
          </label>
        </p>
        <p className="text-sm text-gray-400 dark:text-neutral-500">
          Supported formats: PDF, TXT, DOC, DOCX, CSV, JSON, MD, XLSX (max 10MB)
        </p>

        {uploadMutation.isPending && (
          <div className="mt-4 flex items-center justify-center gap-2 text-violet-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-600 border-t-transparent" />
            Uploading...
          </div>
        )}

        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {uploadError}
          </div>
        )}
      </div>

      {/* Files List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
          <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-gray-900 dark:text-white font-medium mb-1">No files yet</h3>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Upload files to use with your agents</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 divide-y divide-gray-100 dark:divide-neutral-800">
          {files.map((file: UserFile) => (
            <div
              key={file.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    {formatFileSize(file.size)} • Uploaded{' '}
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteMutation.mutate(file.id)}
                disabled={deleteMutation.isPending}
                className="p-2 text-gray-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
