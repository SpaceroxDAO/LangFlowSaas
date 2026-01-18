/**
 * ToolCard - Selectable card for tool/capability selection in Step 3
 * Updated with brand purple accent colors
 */

interface ToolCardProps {
  title: string
  description: string
  selected: boolean
  onToggle: () => void
  requiresApiKey?: boolean
  apiKeyUrl?: string
}

export function ToolCard({
  title,
  description,
  selected,
  onToggle,
  requiresApiKey,
  apiKeyUrl,
}: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all duration-200
        ${selected
          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {requiresApiKey && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                API Key
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
          {requiresApiKey && apiKeyUrl && selected && (
            <a
              href={apiKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 mt-2 text-xs text-amber-700 hover:text-amber-900 underline"
            >
              Get API Key
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        <div
          className={`
            w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ml-3 mt-0.5 transition-all duration-200
            ${selected
              ? 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 border-0'
              : 'border-2 border-gray-300 bg-white'
            }
          `}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}
