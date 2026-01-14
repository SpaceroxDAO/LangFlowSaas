/**
 * FilePreview - Displays a file attachment preview
 *
 * Shows:
 * - Image thumbnails
 * - File icons for documents
 * - Upload progress
 * - Remove button
 */

import type { UploadedFile } from '@/hooks/useFileUpload'

interface FilePreviewProps {
  file: UploadedFile
  onRemove: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(fileType: 'text' | 'image' | 'audio'): JSX.Element {
  switch (fileType) {
    case 'image':
      return (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'audio':
      return (
        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    case 'text':
    default:
      return (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
  }
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.fileType === 'image'
  const isUploading = file.status === 'uploading'
  const hasError = file.status === 'error'

  return (
    <div
      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border ${
        hasError
          ? 'bg-red-50 border-red-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      {/* Preview or icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
        {isImage && file.localUrl ? (
          <img
            src={file.localUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          getFileIcon(file.fileType)
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)}
          {hasError && (
            <span className="text-red-500 ml-2">{file.error || 'Upload failed'}</span>
          )}
        </p>
      </div>

      {/* Upload progress */}
      {isUploading && (
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 animate-spin text-violet-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Remove button */}
      {!isUploading && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
          title="Remove file"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Progress bar for uploading */}
      {isUploading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all duration-300"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
