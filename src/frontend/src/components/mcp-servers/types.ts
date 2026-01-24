import type { MCPServer, MCPServerTemplate, MCPTransportType, Workflow } from '@/types'
import type { ReactNode } from 'react'

export type ViewMode = 'list' | 'grid'

export interface MCPServersTabProps {
  projectId: string
}

export interface MCPServerCardProps {
  server: MCPServer
  colorIndex: number
  onToggle: (server: MCPServer) => void
  onDelete: (server: MCPServer) => void
  getHealthIcon: (status: string) => ReactNode
  isToggling: boolean
}

export interface MCPServerListProps {
  servers: MCPServer[]
  onToggle: (server: MCPServer) => void
  onDelete: (server: MCPServer) => void
  getHealthIcon: (status: string) => ReactNode
  togglingServerId: string | null
}

export interface MCPServerGridProps {
  servers: MCPServer[]
  onToggle: (server: MCPServer) => void
  onDelete: (server: MCPServer) => void
  getHealthIcon: (status: string) => ReactNode
  togglingServerId: string | null
}

export interface MCPConfigModalProps {
  projectId: string
  workflows: Workflow[]
  servers: MCPServer[]
  onClose: () => void
}

export interface AddServerPanelProps {
  projectId: string
  servers: MCPServer[]
  filteredServers: MCPServer[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onToggleServer: (server: MCPServer) => void
  onDeleteServer: (server: MCPServer) => void
  getHealthIcon: (status: string) => ReactNode
  isToggling: boolean
  onSuccess: () => void
}

export interface TestConnectionResult {
  success: boolean
  message: string
}

// Re-export types from main types file for convenience
export type { MCPServer, MCPServerTemplate, MCPTransportType, Workflow }
