import { Link } from 'react-router-dom'
import { Headphones, Clock, Mail, MessageSquare, ArrowLeft, BookOpen, Code } from 'lucide-react'

export function CustomerServicePage() {
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
          <Headphones className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Customer Service
        </h1>
        <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
          We're here to help you succeed with AI agents
        </p>
      </div>

      {/* Support channels */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <a
          href="mailto:support@teachcharlie.ai"
          className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Email Support
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3">
            Get help from our support team via email
          </p>
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>Response within 24 hours</span>
          </div>
          <p className="text-violet-600 dark:text-violet-400 font-medium mt-3 group-hover:underline">
            support@teachcharlie.ai
          </p>
        </a>

        <a
          href="https://github.com/SpaceroxDAO/LangFlowSaas/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            GitHub Issues
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3">
            Report bugs or request new features
          </p>
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>Public tracking & transparency</span>
          </div>
          <p className="text-violet-600 dark:text-violet-400 font-medium mt-3 group-hover:underline">
            Open an issue →
          </p>
        </a>
      </div>

      {/* Response times */}
      <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Response Times
        </h2>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Free Plan</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Community support via GitHub Issues</p>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Best effort</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Pro Plan</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Email support with priority queue</p>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Within 24 hours</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Team Plan</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Priority email support</p>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Within 12 hours</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Enterprise</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Dedicated support + Slack channel</p>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Within 4 hours</span>
          </div>
        </div>
      </div>

      {/* Self-service resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Self-Service Resources
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/resources/guides"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Guides
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Step-by-step tutorials for building and deploying AI agents
            </p>
          </Link>

          <Link
            to="/resources/developers"
            className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-lg">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                API Documentation
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Complete API reference and authentication guides
            </p>
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How quickly will I get a response?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Response times vary by plan (see above). We aim to respond to all Pro plan customers within 24 hours on business days.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Do you offer phone or video support?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Phone and video support are available for Enterprise plan customers. Contact <a href="mailto:sales@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">sales@teachcharlie.ai</a> to learn more.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Can you help me build my agent?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Yes! We offer onboarding sessions and custom workshops. Email <a href="mailto:support@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">support@teachcharlie.ai</a> to schedule.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What if I need help outside business hours?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400">
              You can still submit support requests 24/7. We'll respond during our next business hours (Monday-Friday, 9am-5pm EST).
            </p>
          </div>
        </div>
      </div>

      {/* Enterprise support CTA */}
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-8 border border-violet-200 dark:border-violet-800 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Need Dedicated Support?
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          Enterprise plans include dedicated support, custom SLAs, and a private Slack channel.
        </p>
        <a
          href="mailto:sales@teachcharlie.ai"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          Contact Sales
        </a>
      </div>
    </div>
  )
}
