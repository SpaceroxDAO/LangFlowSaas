import { Link } from 'react-router-dom'
import { BookOpen, ArrowLeft } from 'lucide-react'

export function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      {/* Back button */}
      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Resources
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center w-16 h-16 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-2xl mb-6 mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Tutorials, case studies, and AI agent best practices
        </p>
      </div>

      {/* Coming soon */}
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-12 border border-violet-200 dark:border-violet-800 text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6 max-w-lg mx-auto">
          Our blog is currently under development. We'll be sharing tutorials, case studies, and best practices for building AI agents.
        </p>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          In the meantime, check out our <Link to="/resources/guides" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">User Guides</Link> for learning resources.
        </p>
      </div>

      {/* Planned topics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          What We'll Cover
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Tutorials & How-Tos
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Step-by-step guides for building specific types of AI agents
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Case Studies
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Real-world examples of AI agents in education and business
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Best Practices
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Tips for writing effective prompts and training your agents
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Product Updates
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              New features, improvements, and platform announcements
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              AI Industry Insights
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Trends, research, and the future of AI agents
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Customer Stories
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              How teams are using Teach Charlie AI to close the AI gap
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter signup */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Get Notified
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          Want to be notified when we publish new content? Drop us your email and we'll keep you in the loop.
        </p>
        <a
          href="mailto:blog@teachcharlie.ai?subject=Subscribe to Blog Updates"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          Subscribe to Updates
        </a>
      </div>
    </div>
  )
}
