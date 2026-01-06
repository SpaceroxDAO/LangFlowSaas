import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface UserFile {
  id: string
  name: string
  size: number
  type: string
  created_at: string
  url?: string
}

export function FilesPage() {
  const queryClient = useQueryClient()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Fetch files - placeholder that returns empty list until backend is implemented
  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: async (): Promise<UserFile[]> => {
      // TODO: Implement backend API
      // return api.listFiles()
      return []
    },
  })

  // Upload mutation - placeholder
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // TODO: Implement backend file upload
      // const formData = new FormData()
      // formData.append('file', file)
      // return api.uploadFile(formData)
      console.log('Would upload:', file.name)
      throw new Error('File upload not yet implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      setUploadError(null)
    },
    onError: (error) => {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    },
  })

  // Delete mutation - placeholder
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      // TODO: Implement backend file delete
      // return api.deleteFile(fileId)
      console.log('Would delete:', fileId)
      throw new Error('File delete not yet implemented')
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
    return '📁'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Files</h1>
        <p className="text-gray-500">Upload and manage files for your agents</p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center transition-colors ${
          isDragging
            ? 'border-violet-500 bg-violet-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <label className="text-violet-600 hover:text-violet-700 cursor-pointer font-medium">
            browse
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="*/*"
            />
          </label>
        </p>
        <p className="text-sm text-gray-400">
          Supported formats: PDF, TXT, DOC, DOCX, CSV, JSON
        </p>

        {uploadMutation.isPending && (
          <div className="mt-4 flex items-center justify-center gap-2 text-violet-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-600 border-t-transparent" />
            Uploading...
          </div>
        )}

        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {uploadError}
          </div>
        )}
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-medium text-yellow-800">Coming Soon</p>
            <p className="text-sm text-yellow-700 mt-1">
              File storage is being developed. Soon you'll be able to upload documents
              that your agents can reference and use for answering questions.
            </p>
          </div>
        </div>
      </div>

      {/* Files List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-gray-900 font-medium mb-1">No files yet</h3>
          <p className="text-gray-500 text-sm">Upload files to use with your agents</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • Uploaded{' '}
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteMutation.mutate(file.id)}
                disabled={deleteMutation.isPending}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
