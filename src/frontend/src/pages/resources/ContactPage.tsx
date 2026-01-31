import { Link } from 'react-router-dom'
import { Mail, MessageSquare, Github, ArrowLeft } from 'lucide-react'

export function ContactPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Have questions? We're here to help you close the AI gap.
        </p>
      </div>

      {/* Contact methods */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
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
            Get help from our support team
          </p>
          <p className="text-violet-600 dark:text-violet-400 font-medium text-sm group-hover:underline">
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
            <Github className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            GitHub Issues
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3">
            Report bugs or request features
          </p>
          <p className="text-violet-600 dark:text-violet-400 font-medium text-sm group-hover:underline">
            Open an issue
          </p>
        </a>

        <a
          href="mailto:sales@teachcharlie.ai"
          className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Sales Inquiries
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3">
            Enterprise or custom plans
          </p>
          <p className="text-violet-600 dark:text-violet-400 font-medium text-sm group-hover:underline">
            sales@teachcharlie.ai
          </p>
        </a>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What's your response time?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400">
              We aim to respond to all support emails within 24 hours on business days. Enterprise customers receive priority support.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Do you offer phone support?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Phone support is available for Enterprise plan customers. Contact sales@teachcharlie.ai to learn more.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Can I schedule a demo?
            </h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Yes! Email sales@teachcharlie.ai to schedule a personalized demo with our team.
            </p>
          </div>
        </div>
      </div>

      {/* Additional resources */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-neutral-400 mb-4">
          Looking for documentation?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/resources/guides"
            className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg border border-gray-200 dark:border-neutral-700 hover:border-violet-400 dark:hover:border-violet-500 transition-all"
          >
            User Guides
          </Link>
          <Link
            to="/resources/developers"
            className="px-4 py-2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg border border-gray-200 dark:border-neutral-700 hover:border-violet-400 dark:hover:border-violet-500 transition-all"
          >
            API Documentation
          </Link>
        </div>
      </div>
    </div>
  )
}
