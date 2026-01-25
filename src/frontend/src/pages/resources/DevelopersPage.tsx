import { Link } from 'react-router-dom'
import { developerDocs } from '@/components/docs/DocSidebar'
import {
  Layers,
  Lock,
  FileText,
  Bell,
  Puzzle,
  Wrench,
  RefreshCw,
  Plug,
  Globe,
  Server,
  ChevronRight,
  ArrowRight,
  Zap,
  type LucideIcon,
} from 'lucide-react'

// Doc metadata with conversational descriptions
const docDescriptions: Record<string, { description: string; icon: LucideIcon; category: 'essential' | 'integration' | 'advanced' }> = {
  overview: {
    description: 'See how all the pieces fit together. Database schema, services, and the complete request flow.',
    icon: Layers,
    category: 'essential',
  },
  authentication: {
    description: 'Authenticate API calls with Clerk JWT tokens. Includes code examples for JavaScript, Python, and cURL.',
    icon: Lock,
    category: 'essential',
  },
  'api-reference': {
    description: 'Full reference for all 140+ endpoints. Covers agents, workflows, chat, knowledge sources, and more.',
    icon: FileText,
    category: 'essential',
  },
  webhooks: {
    description: 'Get notified when things happen. Set up webhooks for agent updates, chat messages, and billing events.',
    icon: Bell,
    category: 'integration',
  },
  'embed-api': {
    description: 'Customize the chat widget behavior. Control appearance, handle events, and integrate with your JavaScript app.',
    icon: Puzzle,
    category: 'integration',
  },
  'custom-components': {
    description: 'Build custom Langflow nodes that encapsulate your business logic. Package and share across workflows.',
    icon: Wrench,
    category: 'advanced',
  },
  langflow: {
    description: 'Understand how Teach Charlie AI wraps Langflow. IFrame embedding, flow sync, and template mapping internals.',
    icon: RefreshCw,
    category: 'advanced',
  },
  composio: {
    description: 'Connect to Gmail, Slack, GitHub, and 500+ apps via OAuth. One-click integrations for your agents.',
    icon: Plug,
    category: 'integration',
  },
  'mcp-protocol': {
    description: 'Add tools via Model Context Protocol. Your agent can read databases, call external APIs, and execute actions.',
    icon: Globe,
    category: 'integration',
  },
  'self-hosting': {
    description: 'Run Teach Charlie AI on your infrastructure. Docker Compose setup, environment variables, and scaling strategies.',
    icon: Server,
    category: 'advanced',
  },
}

const categoryConfig = {
  essential: {
    label: 'Essential',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  integration: {
    label: 'Integration',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
}

export function DevelopersPage() {
  const essentialDocs = developerDocs.filter(d => docDescriptions[d.slug]?.category === 'essential')
  const integrationDocs = developerDocs.filter(d => docDescriptions[d.slug]?.category === 'integration')
  const advancedDocs = developerDocs.filter(d => docDescriptions[d.slug]?.category === 'advanced')

  const renderDocCard = (doc: typeof developerDocs[0]) => {
    const meta = docDescriptions[doc.slug] || { description: '', icon: FileText, category: 'essential' as const }
    const catConfig = categoryConfig[meta.category]
    const IconComponent = meta.icon

    return (
      <Link
        key={doc.slug}
        to={doc.path}
        className="group flex items-start gap-5 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-lg transition-all"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-800/80 rounded-2xl flex items-center justify-center shadow-sm">
          <IconComponent className="w-7 h-7 text-gray-600 dark:text-neutral-400" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-2 leading-snug">
            {doc.title}
          </h3>

          {/* Description */}
          <p className="text-base text-gray-600 dark:text-neutral-400 leading-relaxed">
            {meta.description}
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-neutral-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" strokeWidth={2} />
      </Link>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      {/* ============================================
          HEADER
          Typography: Breadcrumb + Page title + Subtitle
          ============================================ */}
      <header className="mb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-neutral-500 mb-4">
          <Link to="/resources" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            Docs
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
          <span className="text-gray-900 dark:text-white">Developer Docs</span>
        </nav>

        {/* Page title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Developer Documentation
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
          Everything you need to integrate Teach Charlie AI into your apps. REST API, webhooks, SDKs, and deployment guides.
        </p>
      </header>

      {/* ============================================
          QUICK START HIGHLIGHT
          Typography: Icon + Heading + Body + Quick links
          ============================================ */}
      <section className="mb-12 p-6 bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 dark:from-blue-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200/60 dark:border-blue-800/60">
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
          </div>

          <div className="flex-1">
            {/* Heading */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Quick Start
            </h2>

            {/* Body */}
            <p className="text-base text-gray-600 dark:text-neutral-400 mb-5 leading-relaxed">
              Get your API key, make your first request, and understand the response format in minutes.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/resources/developers/authentication"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl border border-gray-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-sm text-[14px] font-semibold"
              >
                <Lock className="w-4 h-4 text-gray-500 dark:text-neutral-400" strokeWidth={2} />
                Get API key
              </Link>
              <Link
                to="/resources/developers/api-reference"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl border border-gray-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-sm text-[14px] font-semibold"
              >
                <FileText className="w-4 h-4 text-gray-500 dark:text-neutral-400" strokeWidth={2} />
                API reference
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ESSENTIAL SECTION
          Typography: Section header + Doc count
          ============================================ */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
            Essential
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
            Start here
          </span>
        </div>

        <div className="space-y-4">
          {essentialDocs.map(doc => renderDocCard(doc))}
        </div>
      </section>

      {/* ============================================
          INTEGRATION SECTION
          ============================================ */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
            Integrations
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
            Connect & extend
          </span>
        </div>

        <div className="space-y-4">
          {integrationDocs.map(doc => renderDocCard(doc))}
        </div>
      </section>

      {/* ============================================
          ADVANCED SECTION
          ============================================ */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
            Advanced
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
            Customize & deploy
          </span>
        </div>

        <div className="space-y-4">
          {advancedDocs.map(doc => renderDocCard(doc))}
        </div>
      </section>

      {/* ============================================
          BACK TO GUIDES CTA
          Typography: Heading + Body + Link
          ============================================ */}
      <section className="mt-16 p-8 bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-neutral-900 dark:to-neutral-900/50 rounded-2xl border border-gray-200/60 dark:border-neutral-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          New to Teach Charlie AI?
        </h3>
        <p className="text-base text-gray-600 dark:text-neutral-400 mb-6 leading-relaxed max-w-xl">
          If you haven't used Teach Charlie AI before, start with the user guides. They'll show you how to create agents and understand the core concepts.
        </p>
        <Link
          to="/resources/guides"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
        >
          View user guides
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      </section>
    </div>
  )
}
