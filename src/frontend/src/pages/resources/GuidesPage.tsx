import { Link } from 'react-router-dom'
import { userGuides } from '@/components/docs/DocSidebar'
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
  Clock,
  ArrowRight,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'

// Guide metadata with conversational descriptions
const guideDescriptions: Record<string, { description: string; icon: LucideIcon; time: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced' }> = {
  introduction: {
    description: "Discover what you can build with Teach Charlie AI and why it's different from other platforms.",
    icon: Hand,
    time: '3 min',
    difficulty: 'Beginner',
  },
  'quick-start': {
    description: 'Build and test your first AI agent. Answer three questions and start chatting immediately.',
    icon: Rocket,
    time: '5 min',
    difficulty: 'Beginner',
  },
  'understanding-charlie': {
    description: 'Think of AI like training a helpful dog. This metaphor makes everything click into place.',
    icon: Dog,
    time: '4 min',
    difficulty: 'Beginner',
  },
  playground: {
    description: 'Chat with your agent, test different prompts, and fine-tune responses until they feel right.',
    icon: MessageSquare,
    time: '3 min',
    difficulty: 'Beginner',
  },
  'knowledge-sources': {
    description: 'Upload PDFs, paste text, or add URLs. Your agent learns from them and uses the information instantly.',
    icon: BookOpen,
    time: '5 min',
    difficulty: 'Beginner',
  },
  workflows: {
    description: 'See the visual canvas behind your agent. Customize nodes, connections, and logic flows.',
    icon: Zap,
    time: '8 min',
    difficulty: 'Intermediate',
  },
  publishing: {
    description: 'Share your agent as a reusable component. Others can use it in their own workflows.',
    icon: Package,
    time: '4 min',
    difficulty: 'Intermediate',
  },
  embedding: {
    description: 'Add a chat widget to any website with one line of code. Customize colors and behavior.',
    icon: Globe,
    time: '2 min',
    difficulty: 'Beginner',
  },
  'mcp-servers': {
    description: 'Connect your agent to calendars, databases, APIs, and 500+ external tools via MCP protocol.',
    icon: Plug,
    time: '10 min',
    difficulty: 'Intermediate',
  },
  billing: {
    description: 'Compare Free, Pro, and Team plans. Understand what you get at each tier and when to upgrade.',
    icon: CreditCard,
    time: '2 min',
    difficulty: 'Beginner',
  },
}

const difficultyConfig = {
  Beginner: {
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  Intermediate: {
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  Advanced: {
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
}

export function GuidesPage() {
  const beginnerGuides = userGuides.filter(g => guideDescriptions[g.slug]?.difficulty === 'Beginner')
  const intermediateGuides = userGuides.filter(g => guideDescriptions[g.slug]?.difficulty === 'Intermediate')
  const advancedGuides = userGuides.filter(g => guideDescriptions[g.slug]?.difficulty === 'Advanced')

  const renderGuideCard = (guide: typeof userGuides[0]) => {
    const meta = guideDescriptions[guide.slug] || { description: '', icon: BookOpen, time: '3 min', difficulty: 'Beginner' as const }
    const diffConfig = difficultyConfig[meta.difficulty]
    const IconComponent = meta.icon

    return (
      <Link
        key={guide.slug}
        to={guide.path}
        className="group flex items-start gap-5 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-lg transition-all"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-800/80 rounded-2xl flex items-center justify-center shadow-sm">
          <IconComponent className="w-7 h-7 text-gray-600 dark:text-neutral-400" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-2 leading-snug">
            {guide.title}
          </h3>

          {/* Description */}
          <p className="text-base text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            {meta.description}
          </p>

          {/* Metadata row */}
          <div className="flex items-center gap-4">
            {/* Difficulty badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${diffConfig.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${diffConfig.dot}`}></span>
              {meta.difficulty}
            </span>

            {/* Time estimate */}
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              {meta.time}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-gray-400 dark:text-neutral-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" strokeWidth={2} />
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
          <span className="text-gray-900 dark:text-white">User Guides</span>
        </nav>

        {/* Page title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          User Guides
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
          Learn how to build, train, and deploy AI agents. Start with the basics or jump to specific topics.
        </p>
      </header>

      {/* ============================================
          QUICK START HIGHLIGHT
          Typography: Badge + Title + Description
          ============================================ */}
      <Link
        to="/resources/guides/quick-start"
        className="group flex items-center gap-5 p-6 mb-12 bg-gradient-to-r from-violet-50 via-violet-50 to-purple-50 dark:from-violet-900/20 dark:via-violet-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-violet-200/60 dark:border-violet-800/60 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-lg"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 bg-violet-100 dark:bg-violet-900/50 rounded-2xl flex items-center justify-center shadow-sm">
          <Rocket className="w-8 h-8 text-violet-600 dark:text-violet-400" strokeWidth={1.5} />
        </div>

        <div className="flex-1">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 bg-violet-200/80 dark:bg-violet-800/60 rounded-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
              Recommended first
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">
            Start here: Quick Start Guide
          </h2>

          {/* Description */}
          <p className="text-base text-gray-600 dark:text-neutral-400 leading-relaxed">
            Build your first AI agent in 5 minutes. Answer three questions and start chatting.
          </p>
        </div>

        {/* Arrow */}
        <ArrowRight className="w-7 h-7 text-violet-500 group-hover:translate-x-1 transition-transform flex-shrink-0" strokeWidth={2} />
      </Link>

      {/* ============================================
          GETTING STARTED SECTION
          Typography: Section header + Guide count
          ============================================ */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
            Getting Started
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
            {beginnerGuides.length} guides
          </span>
        </div>

        <div className="space-y-4">
          {beginnerGuides.map((guide) => renderGuideCard(guide))}
        </div>
      </section>

      {/* ============================================
          INTERMEDIATE SECTION
          ============================================ */}
      {intermediateGuides.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
              Going Deeper
            </h2>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
              {intermediateGuides.length} guides
            </span>
          </div>

          <div className="space-y-4">
            {intermediateGuides.map((guide) => renderGuideCard(guide))}
          </div>
        </section>
      )}

      {/* ============================================
          ADVANCED SECTION
          ============================================ */}
      {advancedGuides.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">
              Advanced
            </h2>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
              {advancedGuides.length} guides
            </span>
          </div>

          <div className="space-y-4">
            {advancedGuides.map((guide) => renderGuideCard(guide))}
          </div>
        </section>
      )}

      {/* ============================================
          NEXT STEPS CTA
          Typography: Heading + Body + Link
          ============================================ */}
      <section className="mt-16 p-8 bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-neutral-900 dark:to-neutral-900/50 rounded-2xl border border-gray-200/60 dark:border-neutral-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Ready for the technical stuff?
        </h3>
        <p className="text-base text-gray-600 dark:text-neutral-400 mb-6 leading-relaxed max-w-xl">
          Once you're comfortable with the basics, check out the developer docs for API integration, webhooks, and self-hosting.
        </p>
        <Link
          to="/resources/developers"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
        >
          Browse developer docs
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      </section>
    </div>
  )
}
