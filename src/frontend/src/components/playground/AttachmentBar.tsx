/**
 * AttachmentBar - Displays pending file attachments above the input
 *
 * Shows a horizontal scrollable list of file previews with:
 * - File thumbnails/icons
 * - Upload progress
 * - Remove buttons
 */

import type { UploadedFile } from '@/hooks/useFileUpload'
import { FilePreview } from './FilePreview'

interface AttachmentBarProps {
  files: UploadedFile[]
  onRemoveFile: (fileId: string) => void
}

export function AttachmentBar({ files, onRemoveFile }: AttachmentBarProps) {
  if (files.length === 0) return null

  return (
    <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {files.map((file) => (
          <div key={file.id} className="flex-shrink-0">
            <FilePreview
              file={file}
              onRemove={() => onRemoveFile(file.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
