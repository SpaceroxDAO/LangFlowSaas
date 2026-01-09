/**
 * Breadcrumbs navigation component
 *
 * Displays the current location in the platform hierarchy with clickable links.
 * Uses use-react-router-breadcrumbs for automatic route-based breadcrumbs.
 */
import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { breadcrumbRoutes, excludePaths } from './breadcrumbRoutes'

// ChevronRight separator icon
function ChevronRightIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  )
}

/**
 * Extract entity IDs from current path
 */
function useEntityIds() {
  const location = useLocation()
  const pathname = location.pathname

  // Match patterns for different routes
  const editMatch = pathname.match(/^\/edit\/([^/]+)/)
  const playgroundAgentMatch = pathname.match(/^\/playground\/([^/]+)$/)
  const playgroundWorkflowMatch = pathname.match(/^\/playground\/workflow\/([^/]+)/)
  const canvasMatch = pathname.match(/^\/canvas\/([^/]+)/)

  return {
    agentId: editMatch?.[1] || playgroundAgentMatch?.[1],
    workflowId: playgroundWorkflowMatch?.[1],
    // Canvas can be either workflow or agent ID - we'll try both
    canvasId: canvasMatch?.[1],
    isAgentRoute: !!(editMatch || playgroundAgentMatch),
    isWorkflowRoute: !!playgroundWorkflowMatch,
    isCanvasRoute: !!canvasMatch,
  }
}

/**
 * Hook to get parent context (project, entity name) for orphan routes
 */
function useParentContext(agentId?: string, workflowId?: string, canvasId?: string) {
  // Fetch agent if on agent route
  const { data: agent } = useQuery({
    queryKey: ['agent-component', agentId],
    queryFn: () => api.getAgentComponent(agentId!),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  })

  // Fetch workflow if on workflow route
  const { data: workflow } = useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => api.getWorkflow(workflowId!),
    enabled: !!workflowId,
    staleTime: 5 * 60 * 1000,
  })

  // For canvas routes, try fetching as workflow first
  const { data: canvasWorkflow } = useQuery({
    queryKey: ['workflow', canvasId],
    queryFn: () => api.getWorkflow(canvasId!),
    enabled: !!canvasId,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry if it fails - might be an agent ID
  })

  // For canvas routes, if workflow fetch fails, try as agent component
  const { data: canvasAgent } = useQuery({
    queryKey: ['agent-component', canvasId],
    queryFn: () => api.getAgentComponent(canvasId!),
    enabled: !!canvasId && !canvasWorkflow, // Only try if workflow fetch didn't return data
    staleTime: 5 * 60 * 1000,
  })

  // Get project ID from entity (prioritize direct agent/workflow, then canvas)
  const projectId = agent?.project_id || workflow?.project_id ||
                    canvasWorkflow?.project_id || canvasAgent?.project_id

  // Fetch project for parent context
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId!),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })

  // Determine entity name (prioritize direct agent/workflow, then canvas)
  const entityName = agent?.name || workflow?.name ||
                     canvasWorkflow?.name || canvasAgent?.name

  return {
    agent: agent || canvasAgent,
    workflow: workflow || canvasWorkflow,
    project,
    entityName,
  }
}

export function Breadcrumbs() {
  const location = useLocation()
  const breadcrumbs = useBreadcrumbs(breadcrumbRoutes, { excludePaths })
  const { agentId, workflowId, canvasId, isAgentRoute, isWorkflowRoute, isCanvasRoute } = useEntityIds()
  const { project, entityName } = useParentContext(agentId, workflowId, canvasId)

  // Don't show breadcrumbs on dashboard home
  if (location.pathname === '/dashboard') return null

  // Build breadcrumb items
  type BreadcrumbItem = {
    key: string
    to?: string
    label: React.ReactNode
    isCurrent: boolean
  }

  const items: BreadcrumbItem[] = []

  // Always add Dashboard first
  items.push({
    key: 'dashboard',
    to: '/dashboard',
    label: 'Dashboard',
    isCurrent: location.pathname === '/dashboard',
  })

  // For orphan routes (edit, playground, canvas), inject project context
  if ((isAgentRoute || isWorkflowRoute || isCanvasRoute) && project) {
    items.push({
      key: `project-${project.id}`,
      to: `/dashboard/project/${project.id}`,
      label: project.name,
      isCurrent: false,
    })
  }

  // Add entity name for agent/workflow/canvas routes
  if ((isAgentRoute || isWorkflowRoute || isCanvasRoute) && entityName) {
    const entityId = agentId || workflowId || canvasId
    // For playground/canvas routes, link to edit page; for edit page, no link
    const isEditRoute = location.pathname.startsWith('/edit/')
    // For canvas routes with agent ID, we can link to edit page
    const editLinkId = agentId || (isCanvasRoute ? canvasId : undefined)
    items.push({
      key: `entity-${entityId}`,
      to: !isEditRoute && editLinkId ? `/edit/${editLinkId}` : undefined,
      label: entityName,
      isCurrent: false,
    })
  }

  // For standard routes, use the library-generated breadcrumbs
  if (!isAgentRoute && !isWorkflowRoute && !isCanvasRoute) {
    // Skip Dashboard (index 0) since we added it manually
    breadcrumbs.slice(1).forEach(({ match, breadcrumb }, index) => {
      const isLast = index === breadcrumbs.length - 2
      items.push({
        key: match.pathname,
        to: isLast ? undefined : match.pathname,
        label: breadcrumb,
        isCurrent: isLast,
      })
    })
  } else {
    // Add the final breadcrumb (action: Edit Agent, Chat Playground, AI Canvas)
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]
    if (lastBreadcrumb) {
      items.push({
        key: `final-${lastBreadcrumb.match.pathname}`,
        to: undefined,
        label: lastBreadcrumb.breadcrumb,
        isCurrent: true,
      })
    }
  }

  // Mark the last item as current
  if (items.length > 0) {
    items[items.length - 1].isCurrent = true
    items[items.length - 1].to = undefined
  }

  // Don't show if only Dashboard
  if (items.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="px-4 py-2">
      <ol className="flex items-center gap-1 text-sm">
        {items.map((item, index) => (
          <Fragment key={item.key}>
            {index > 0 && <ChevronRightIcon />}
            <li className="flex items-center">
              {item.to && !item.isCurrent ? (
                <Link
                  to={item.to}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={item.isCurrent ? 'page' : undefined}
                  className={item.isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'}
                >
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
