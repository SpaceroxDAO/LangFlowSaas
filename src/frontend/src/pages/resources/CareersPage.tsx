import { Link } from 'react-router-dom'
import { Briefcase, ArrowLeft, Heart, Rocket, Users } from 'lucide-react'

export function CareersPage() {
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
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Careers at Teach Charlie AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Help us close the AI gap and make AI accessible to everyone
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-neutral-900 dark:to-neutral-900/50 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
          At Teach Charlie AI, we believe that AI should be accessible to everyone—not just developers and data scientists. We're building an educational platform that transforms how non-technical teams create, deploy, and manage AI agents.
        </p>
        <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
          We're a small, focused team working on a mission that matters: closing the AI skills gap and empowering educators, small businesses, and teams to leverage AI without writing code.
        </p>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Education First
            </h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              We prioritize teaching over features. Every decision is guided by what helps users learn and succeed.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Move Fast
            </h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              We ship quickly, iterate based on feedback, and aren't afraid to pivot when needed.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              User-Centric
            </h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              We build for real people solving real problems—not for hypothetical use cases.
            </p>
          </div>
        </div>
      </div>

      {/* Open positions */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Open Positions
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-8">
          We're currently a lean team working on our MVP. We'll be hiring for the following roles in 2026:
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Full-Stack Engineer (React + Python)
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
              Remote · Full-time · $100k-$150k + equity
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Build educational UX on top of Langflow. Experience with FastAPI, React, and AI/ML tools preferred.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Developer Advocate
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
              Remote · Full-time · $80k-$120k + equity
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Create tutorials, run workshops, and help non-technical users succeed with AI agents.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Technical Writer
            </h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
              Remote · Part-time/Contract · $50-$80/hour
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Write beginner-friendly documentation, guides, and educational content for AI agents.
            </p>
          </div>
        </div>
      </div>

      {/* Apply */}
      <div className="text-center bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-8 border border-violet-200 dark:border-violet-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Interested in Joining?
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          Send your resume and a short note about why you're excited about Teach Charlie AI to:
        </p>
        <a
          href="mailto:careers@teachcharlie.ai"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          careers@teachcharlie.ai
        </a>
      </div>
    </div>
  )
}
