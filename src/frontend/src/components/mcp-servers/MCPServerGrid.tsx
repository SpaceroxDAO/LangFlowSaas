import React from 'react'
import { MCPServerGridCard } from './MCPServerCard'
import type { MCPServerGridProps } from './types'

export function MCPServerGrid({
  servers,
  onToggle,
  onDelete,
  getHealthIcon,
  togglingServerId,
}: MCPServerGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {servers.map((server, index) => (
        <MCPServerGridCard
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
