/**
 * Dynamic breadcrumb components that fetch entity names from the API.
 * These are used by use-react-router-breadcrumbs for routes with dynamic segments.
 *
 * IMPORTANT: Cannot use useParams() in these components - must use match.params
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'

// Type for the match object passed by use-react-router-breadcrumbs
interface BreadcrumbMatch {
  params: Record<string, string | undefined>
  pathname: string
}

interface BreadcrumbComponentProps {
  match: BreadcrumbMatch
}

/**
 * Dynamic project breadcrumb - fetches project name by ID
 */
export function DynamicProjectBreadcrumb({ match }: BreadcrumbComponentProps) {
  const projectId = match.params.projectId

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId!),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) return <span className="text-gray-400">...</span>
  return <span>{project?.name || 'Project'}</span>
}

/**
 * Dynamic agent breadcrumb - fetches agent name by ID
 * Also provides project context for parent breadcrumb
 */
export function DynamicAgentBreadcrumb({ match }: BreadcrumbComponentProps) {
  const agentId = match.params.agentId

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent-component', agentId],
    queryFn: () => api.getAgentComponent(agentId!),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <span className="text-gray-400">...</span>
  return <span>{agent?.name || 'Agent'}</span>
}

/**
 * Dynamic workflow breadcrumb - fetches workflow name by ID
 * Also provides project context for parent breadcrumb
 */
export function DynamicWorkflowBreadcrumb({ match }: BreadcrumbComponentProps) {
  // Canvas uses :agentId param but it's actually a workflow ID
  const workflowId = match.params.workflowId || match.params.agentId

  const { data: workflow, isLoading } = useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => api.getWorkflow(workflowId!),
    enabled: !!workflowId,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <span className="text-gray-400">...</span>
  return <span>{workflow?.name || 'Workflow'}</span>
}

/**
 * Project link breadcrumb for agent/workflow pages
 * Fetches the parent project from the entity
 */
export function AgentProjectBreadcrumb({ match }: BreadcrumbComponentProps) {
  const agentId = match.params.agentId

  const { data: agent } = useQuery({
    queryKey: ['agent-component', agentId],
    queryFn: () => api.getAgentComponent(agentId!),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', agent?.project_id],
    queryFn: () => api.getProject(agent!.project_id!),
    enabled: !!agent?.project_id,
    staleTime: 5 * 60 * 1000,
  })

  if (!agent?.project_id) return null
  if (isLoading) return <span className="text-gray-400">...</span>

  return (
    <Link
      to={`/dashboard/project/${agent.project_id}`}
      className="text-gray-500 hover:text-gray-700 transition-colors"
    >
      {project?.name || 'Project'}
    </Link>
  )
}

/**
 * Project link breadcrumb for workflow pages
 * Fetches the parent project from the workflow
 */
export function WorkflowProjectBreadcrumb({ match }: BreadcrumbComponentProps) {
  const workflowId = match.params.workflowId || match.params.agentId

  const { data: workflow } = useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => api.getWorkflow(workflowId!),
    enabled: !!workflowId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', workflow?.project_id],
    queryFn: () => api.getProject(workflow!.project_id!),
    enabled: !!workflow?.project_id,
    staleTime: 5 * 60 * 1000,
  })

  if (!workflow?.project_id) return null
  if (isLoading) return <span className="text-gray-400">...</span>

  return (
    <Link
      to={`/dashboard/project/${workflow.project_id}`}
      className="text-gray-500 hover:text-gray-700 transition-colors"
    >
      {project?.name || 'Project'}
    </Link>
  )
}
