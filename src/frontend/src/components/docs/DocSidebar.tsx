import { useState, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Hand,
  Rocket,
  Dog,
  MessageSquare,
  BookOpen,
  Zap,
  Package,
  Globe,
  Plug,
  CreditCard,
  Layers,
  Lock,
  FileText,
  Bell,
  Puzzle,
  Wrench,
  RefreshCw,
  Server,
  ClipboardList,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  title: string
  slug: string
  path: string
  icon?: LucideIcon
}

interface NavSection {
  title: string
  items: NavItem[]
  icon: React.ReactNode
}

const userGuides: NavItem[] = [
  { title: 'Introduction', slug: 'introduction', path: '/resources/guides/introduction', icon: Hand },
  { title: 'Quick start', slug: 'quick-start', path: '/resources/guides/quick-start', icon: Rocket },
  { title: 'Dog trainer metaphor', slug: 'understanding-charlie', path: '/resources/guides/understanding-charlie', icon: Dog },
  { title: 'Testing in playground', slug: 'playground', path: '/resources/guides/playground', icon: MessageSquare },
  { title: 'Adding knowledge', slug: 'knowledge-sources', path: '/resources/guides/knowledge-sources', icon: BookOpen },
  { title: 'Understanding workflows', slug: 'workflows', path: '/resources/guides/workflows', icon: Zap },
  { title: 'Publishing agents', slug: 'publishing', path: '/resources/guides/publishing', icon: Package },
  { title: 'Embedding widgets', slug: 'embedding', path: '/resources/guides/embedding', icon: Globe },
  { title: 'Connecting tools', slug: 'mcp-servers', path: '/resources/guides/mcp-servers', icon: Plug },
  { title: 'Plans & billing', slug: 'billing', path: '/resources/guides/billing', icon: CreditCard },
]

const developerDocs: NavItem[] = [
  { title: 'Architecture overview', slug: 'overview', path: '/resources/developers/overview', icon: Layers },
  { title: 'Authentication', slug: 'authentication', path: '/resources/developers/authentication', icon: Lock },
  { title: 'API reference', slug: 'api-reference', path: '/resources/developers/api-reference', icon: FileText },
  { title: 'Webhooks', slug: 'webhooks', path: '/resources/developers/webhooks', icon: Bell },
  { title: 'Embed widget API', slug: 'embed-api', path: '/resources/developers/embed-api', icon: Puzzle },
  { title: 'Custom components', slug: 'custom-components', path: '/resources/developers/custom-components', icon: Wrench },
  { title: 'Langflow integration', slug: 'langflow', path: '/resources/developers/langflow', icon: RefreshCw },
  { title: 'Composio integration', slug: 'composio', path: '/resources/developers/composio', icon: Plug },
  { title: 'MCP protocol', slug: 'mcp-protocol', path: '/resources/developers/mcp-protocol', icon: Globe },
  { title: 'Self-hosting', slug: 'self-hosting', path: '/resources/developers/self-hosting', icon: Server },
]

// All docs for search
const allDocs = [
  ...userGuides.map(g => ({ ...g, category: 'Guides' })),
  ...developerDocs.map(d => ({ ...d, category: 'Developer' })),
  { title: 'Changelog', slug: 'changelog', path: '/resources/changelog', category: 'Updates', icon: ClipboardList },
]

const sections: NavSection[] = [
  {
    title: 'User guides',
    items: userGuides,
    icon: <BookOpen className="w-4 h-4" strokeWidth={1.5} />,
  },
  {
    title: 'Developer docs',
    items: developerDocs,
    icon: <FileText className="w-4 h-4" strokeWidth={1.5} />,
  },
]

interface DocSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function DocSidebar({ collapsed = false, onToggle }: DocSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return allDocs.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.slug.toLowerCase().includes(query)
    ).slice(0, 5)
  }, [searchQuery])

  const handleSearchSelect = (path: string) => {
    setSearchQuery('')
    navigate(path)
  }

  if (collapsed) {
    return (
      <aside className="w-14 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col items-center py-4 transition-all duration-200">
        <button
          onClick={onToggle}
          className="p-2 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="mt-4 flex flex-col items-center gap-2">
          <Link
            to="/resources/guides"
            className={`p-2 rounded-lg transition-colors ${
              location.pathname.includes('/guides')
                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                : 'text-gray-500 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
            title="User guides"
          >
            <BookOpen className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <Link
            to="/resources/developers"
            className={`p-2 rounded-lg transition-colors ${
              location.pathname.includes('/developers')
                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                : 'text-gray-500 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
            title="Developer docs"
          >
            <FileText className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <Link
            to="/resources/changelog"
            className={`p-2 rounded-lg transition-colors ${
              location.pathname.includes('/changelog')
                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                : 'text-gray-500 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
            title="Changelog"
          >
            <ClipboardList className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <Link to="/resources" className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">Documentation</span>
          </Link>
          <button
            onClick={onToggle}
            className="p-1.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
          />

          {/* Search results */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden z-50">
              {searchResults.map((result) => {
                const IconComponent = result.icon
                return (
                  <button
                    key={result.path}
                    onClick={() => handleSearchSelect(result.path)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 text-gray-400 dark:text-neutral-500 flex-shrink-0" strokeWidth={1.5} />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.title}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-500">{result.category}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {sections.map((section) => (
          <div key={section.title} className="mb-5">
            <div className="flex items-center gap-2 px-2 mb-2">
              <span className="text-gray-400 dark:text-neutral-500">{section.icon}</span>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wide">
                {section.title}
              </h3>
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path
                const IconComponent = item.icon
                return (
                  <li key={item.slug}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition-colors ${
                        isActive
                          ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-medium'
                          : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent
                          className={`w-4 h-4 flex-shrink-0 ${
                            isActive
                              ? 'text-violet-600 dark:text-violet-400'
                              : 'text-gray-400 dark:text-neutral-500'
                          }`}
                          strokeWidth={1.5}
                        />
                      )}
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {/* Changelog */}
        <div className="mb-5">
          <div className="flex items-center gap-2 px-2 mb-2">
            <ClipboardList className="w-4 h-4 text-gray-400 dark:text-neutral-500" strokeWidth={1.5} />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wide">
              Updates
            </h3>
          </div>
          <ul className="space-y-0.5">
            <li>
              <Link
                to="/resources/changelog"
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition-colors ${
                  location.pathname === '/resources/changelog'
                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-medium'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-neutral-200'
                }`}
              >
                <ClipboardList
                  className={`w-4 h-4 flex-shrink-0 ${
                    location.pathname === '/resources/changelog'
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-gray-400 dark:text-neutral-500'
                  }`}
                  strokeWidth={1.5}
                />
                <span>Changelog</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 dark:border-neutral-800">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-2 py-2 text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to app
        </Link>
      </div>
    </aside>
  )
}

export { userGuides, developerDocs }
