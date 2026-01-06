import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Project } from '@/types'

interface ProjectMenuProps {
  project: Project
  onRename?: () => void
}

export function ProjectMenu({ project, onRename }: ProjectMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowDeleteConfirm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Archive/delete project mutation
  const archiveMutation = useMutation({
    mutationFn: () => api.archiveProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-with-agents'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsOpen(false)
      setShowDeleteConfirm(false)
    },
  })

  // Export project (download as JSON)
  const handleExport = async () => {
    try {
      const projectData = await api.getProjectWithAgents(project.id)
      const exportData = {
        project: {
          name: project.name,
          description: project.description,
          icon: project.icon,
          color: project.color,
        },
        agents: projectData.agents,
        exported_at: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to export project:', error)
    }
  }

  const handleRename = () => {
    setIsOpen(false)
    onRename?.()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
        title="Project options"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 py-1">
          {/* Download/Export */}
          <button
            onClick={handleExport}
            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>

          {/* Rename */}
          <button
            onClick={handleRename}
            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Rename
          </button>

          {/* Divider */}
          <div className="border-t border-gray-700 my-1" />

          {/* Delete */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={project.is_default}
              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={project.is_default ? "Cannot delete default project" : "Delete project"}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          ) : (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-400 mb-2">Delete this project?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => archiveMutation.mutate()}
                  disabled={archiveMutation.isPending}
                  className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {archiveMutation.isPending ? '...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
