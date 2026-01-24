import React from 'react'
import { MCPServerCard } from './MCPServerCard'
import type { MCPServerListProps } from './types'

export function MCPServerList({
  servers,
  onToggle,
  onDelete,
  getHealthIcon,
  togglingServerId,
}: MCPServerListProps) {
  return (
    <div className="space-y-3">
      {servers.map((server, index) => (
        <MCPServerCard
          key={server.id}
          server={server}
          colorIndex={index}
          onToggle={onToggle}
          onDelete={onDelete}
          getHealthIcon={getHealthIcon}
          isToggling={togglingServerId === server.id}
        />
      ))}
    </div>
  )
}
