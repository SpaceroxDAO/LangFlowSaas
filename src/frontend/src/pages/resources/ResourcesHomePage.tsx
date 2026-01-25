import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userGuides, developerDocs } from '@/components/docs/DocSidebar'
import {
  Search,
  Zap,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Code,
  MessageSquare,
  Database,
  Plug,
  Shield,
  BarChart3,
  Users,
  HelpCircle,
} from 'lucide-react'

// Search all docs
const allDocs = [
  ...userGuides.map(g => ({ ...g, category: 'User Guides', categoryPath: '/resources/guides' })),
  ...developerDocs.map(d => ({ ...d, category: 'Developer Docs', categoryPath: '/resources/developers' })),
]

// Learning path steps - aligned with Teach → Build → Deploy framework
const learningPath = [
  {
    step: 1,
    title: 'Create your first agent',
    description: 'Answer three simple questions about your agent\'s role, rules, and capabilities.',
    path: '/resources/guides/quick-start',
    time: '5 min',
    icon: <Zap className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    step: 2,
    title: 'Test in the playground',
    description: 'Have a conversation with your agent. Refine its responses until they feel right.',
    path: '/resources/guides/playground',
    time: '3 min',
    icon: <MessageSquare className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    step: 3,
    title: 'Add knowledge sources',
    description: 'Upload SOPs, policies, and FAQs. Your agent learns from your real company data.',
    path: '/resources/guides/knowledge-sources',
    time: '5 min',
    icon: <Database className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    step: 4,
    title: 'Connect tools & deploy',
    description: 'Link to Slack, Zendesk, or Notion. Then embed your agent anywhere.',
    path: '/resources/guides/embedding',
    time: '5 min',
    icon: <Plug className="w-5 h-5" strokeWidth={1.5} />,
  },
]

// Core capabilities from the website
const capabilities = [
  {
    title: 'Knowledge Management',
    description: 'Sync your SOPs, policies, and FAQs. Connect to business systems for real-time data.',
    icon: <Database className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    title: 'No-Code Actions',
    description: 'Create tickets, update records, route requests. Works with Make, Zapier, and 500+ apps.',
    icon: <Plug className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    title: 'Workflow Controls',
    description: 'Define what agents can do and when to escalate. Smart handoff to humans when needed.',
    icon: <Users className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    title: 'Analytics & Insights',
    description: 'Track outcomes, spot where agents struggle, get suggestions for improvement.',
    icon: <BarChart3 className="w-5 h-5" strokeWidth={1.5} />,
  },
]

const sections = [
  {
    title: 'User Guides',
    description: 'Step-by-step tutorials for building, training, and deploying AI agents. Designed for non-technical teams—no coding required.',
    icon: <BookOpen className="w-6 h-6" strokeWidth={1.5} />,
    path: '/resources/guides',
    color: 'violet',
    badge: `${userGuides.length} guides`,
  },
  {
    title: 'Developer Docs',
    description: 'REST API reference, authentication with Clerk JWT, webhooks, and custom integrations for your engineering team.',
    icon: <Code className="w-6 h-6" strokeWidth={1.5} />,
    path: '/resources/developers',
    color: 'blue',
    badge: `${developerDocs.length} docs`,
  },
  {
    title: 'Security & Compliance',
    description: 'SOC 2 Type II and GDPR compliant. Encryption at rest and in transit. Full data ownership.',
    icon: <Shield className="w-6 h-6" strokeWidth={1.5} />,
    path: '/resources/developers/self-hosting',
    color: 'emerald',
    badge: 'Enterprise',
  },
]

const colorClasses = {
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200/60 dark:border-violet-800/60',
    text: 'text-violet-600 dark:text-violet-400',
    hover: 'hover:border-violet-400 dark:hover:border-violet-500',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200/60 dark:border-blue-800/60',
    text: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:border-blue-400 dark:hover:border-blue-500',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200/60 dark:border-emerald-800/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
}

export function ResourcesHomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return allDocs.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.slug.toLowerCase().includes(query)
    ).slice(0, 6)
  }, [searchQuery])

  const handleSearchSelect = (path: string) => {
    setSearchQuery('')
    navigate(path)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 lg:px-8">
      {/* ============================================
          HERO SECTION
          Value prop: Close the AI Gap
          ============================================ */}
      <div className="text-center mb-16">
        {/* Tagline badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full mb-6">
          <span className="text-[12px] font-bold uppercase tracking-widest">
            Teach → Build → Deploy
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-5">
          Close the AI Gap
        </h1>
        <p className="text-xl text-gray-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Build AI agents your team actually uses. No coding required. Connect to your knowledge, tools, and workflows in minutes.
        </p>

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              className="w-full pl-12 pr-16 py-4 text-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm hover:shadow-md placeholder:text-gray-400 dark:placeholder:text-neutral-500"
            />
            <kbd className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          {/* Search results dropdown */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl overflow-hidden z-50">
              {searchResults.map((result) => (
                <button
                  key={result.path}
                  onClick={() => handleSearchSelect(result.path)}
                  className="w-full px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-neutral-800/80 flex items-center justify-between transition-colors border-b border-gray-100 dark:border-neutral-800 last:border-0"
                >
                  <div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{result.title}</div>
                    <div className="text-sm text-gray-500 dark:text-neutral-500 mt-0.5">{result.category}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          QUICK START CTA
          30 minutes to first agent
          ============================================ */}
      <Link
        to="/resources/guides/quick-start"
        className="group block mb-16 p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm rounded-full mb-4">
              <Zap className="w-4 h-4 text-white dark:text-gray-900" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/90 dark:text-gray-900/90">
                30 min to first agent
              </span>
            </div>
            {/* Display title */}
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white dark:text-gray-900">
              Build your first AI agent
            </h2>
            {/* Body text */}
            <p className="text-lg text-gray-300 dark:text-gray-600 leading-relaxed max-w-lg">
              Answer three questions, connect your knowledge, and deploy. 40+ ready-to-use templates included.
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-white/10 dark:bg-gray-900/10 rounded-2xl group-hover:bg-white/20 dark:group-hover:bg-gray-900/20 transition-colors">
            <ArrowRight className="w-8 h-8 text-white dark:text-gray-900 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* ============================================
          LEARNING PATH
          Teach → Build → Deploy steps
          ============================================ */}
      <section className="mb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Learning Path
            </h2>
            <p className="text-gray-500 dark:text-neutral-500 mt-1">
              Go from zero to deployed agent
            </p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full">
            ~18 min total
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {learningPath.map((step) => (
            <Link
              key={step.step}
              to={step.path}
              className="group relative p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-sm font-bold">
                    {step.step}
                  </span>
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded-xl">
                    {step.icon}
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                  {step.time}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-snug">
                {step.title}
              </h3>

              <p className="text-[15px] text-gray-600 dark:text-neutral-400 leading-relaxed">
                {step.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================
          CAPABILITIES GRID
          What you can do with Teach Charlie AI
          ============================================ */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            What You Can Build
          </h2>
          <p className="text-gray-500 dark:text-neutral-500 mt-1">
            Agents that actually work for your business
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-11 h-11 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl">
                  {cap.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {cap.title}
                </h3>
              </div>
              <p className="text-[15px] text-gray-600 dark:text-neutral-400 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          DOCUMENTATION SECTIONS
          ============================================ */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
          Browse Documentation
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((section) => {
            const colors = colorClasses[section.color as keyof typeof colorClasses]
            return (
              <Link
                key={section.title}
                to={section.path}
                className={`group flex flex-col p-7 bg-white dark:bg-neutral-900 rounded-2xl border-2 ${colors.border} ${colors.hover} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`inline-flex p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                    {section.icon}
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${colors.badge}`}>
                    {section.badge}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {section.title}
                </h3>

                <p className="text-base text-gray-600 dark:text-neutral-400 leading-relaxed flex-1">
                  {section.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                  <span>Browse</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ============================================
          POPULAR TOPICS
          ============================================ */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
          Popular Topics
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: 'The dog trainer metaphor',
              path: '/resources/guides/understanding-charlie',
              desc: 'Understand AI agents like training a helpful dog. It makes everything click.',
            },
            {
              title: 'Connect 500+ apps',
              path: '/resources/guides/mcp-servers',
              desc: 'Integrate with Slack, Zendesk, Notion, Salesforce, and more via MCP servers.',
            },
            {
              title: 'API authentication',
              path: '/resources/developers/authentication',
              desc: 'Secure your API calls with Clerk JWT tokens. Code examples included.',
            },
            {
              title: 'Self-hosting guide',
              path: '/resources/developers/self-hosting',
              desc: 'Deploy on your own infrastructure with Docker. Full data ownership.',
            },
          ].map((topic) => (
            <Link
              key={topic.title}
              to={topic.path}
              className="group flex items-start gap-5 p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-md"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1.5">
                  {topic.title}
                </h3>
                <p className="text-[15px] text-gray-500 dark:text-neutral-500 leading-relaxed">
                  {topic.desc}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-neutral-600 group-hover:text-violet-500 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================
          INTEGRATIONS SHOWCASE
          ============================================ */}
      <section className="mb-20 p-8 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl border border-gray-200/60 dark:border-neutral-800">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Works With Your Stack
          </h2>
          <p className="text-gray-500 dark:text-neutral-500">
            Connect to the tools you already use
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {['Make', 'Zapier', 'Slack', 'Zendesk', 'Notion', 'Salesforce', 'Stripe', 'Calendly', 'WhatsApp', 'HubSpot'].map((tool) => (
            <div
              key={tool}
              className="px-4 py-2 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 text-sm font-medium text-gray-700 dark:text-neutral-300"
            >
              {tool}
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/resources/guides/mcp-servers"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
          >
            See all integrations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================
          HELP SECTION
          ============================================ */}
      <section className="p-10 bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-neutral-900 dark:to-neutral-900/50 rounded-3xl border border-gray-200/60 dark:border-neutral-800">
        <div className="text-center max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-2xl mb-6">
            <HelpCircle className="w-7 h-7" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Still have questions?
          </h2>

          <p className="text-base text-gray-600 dark:text-neutral-400 mb-8 leading-relaxed">
            Can't find what you're looking for? Our team is here to help you close the AI gap.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/SpaceroxDAO/LangFlowSaas/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl border border-gray-200 dark:border-neutral-700 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-md text-[14px] font-semibold"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Open an issue
            </a>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:shadow-md text-[14px] font-semibold"
            >
              Go to dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
