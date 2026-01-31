import { Link } from 'react-router-dom'
import { Cookie, ArrowLeft } from 'lucide-react'

export function CookiePolicyPage() {
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
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl">
            <Cookie className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Cookie Policy
          </h1>
        </div>
        <p className="text-gray-600 dark:text-neutral-400">
          Last updated: January 31, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            What Are Cookies?
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            How We Use Cookies
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Teach Charlie AI uses cookies for the following purposes:
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            1. Essential Cookies (Required)
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            These cookies are necessary for the platform to function and cannot be disabled. They include:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-6">
            <li><strong>Authentication cookies:</strong> Maintain your login session via Clerk</li>
            <li><strong>Security cookies:</strong> Protect against cross-site request forgery (CSRF)</li>
            <li><strong>Session cookies:</strong> Remember your preferences during your visit</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            2. Functional Cookies (Optional)
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            These cookies enable enhanced functionality and personalization:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-6">
            <li><strong>Theme preferences:</strong> Remember dark/light mode selection</li>
            <li><strong>Language settings:</strong> Store your preferred language</li>
            <li><strong>UI preferences:</strong> Remember sidebar collapse state and layout choices</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            3. Analytics Cookies (Optional)
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            These cookies help us understand how visitors use the platform:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-6">
            <li><strong>Sentry:</strong> Error tracking and performance monitoring</li>
            <li><strong>Usage analytics:</strong> Track which features are most popular</li>
            <li><strong>Performance metrics:</strong> Measure page load times and responsiveness</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Cookies We Use
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-neutral-900 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Cookie Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Purpose</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">__clerk_*</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Authentication session</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Session</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Essential</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">theme</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Dark/light mode preference</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">1 year</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Functional</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">sentry-*</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Error tracking</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Session</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Analytics</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">_stripe_*</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Payment processing (Stripe)</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Session</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Essential</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Third-Party Cookies
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Some cookies are set by third-party services we use:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li><strong>Clerk:</strong> Authentication and user management</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Sentry:</strong> Error tracking and monitoring</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Managing Cookies
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            You can control and manage cookies in several ways:
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Browser Settings
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Most browsers allow you to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-6">
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block all cookies from specific sites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Browser-Specific Instructions
          </h3>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Microsoft Edge</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Impact of Disabling Cookies
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Disabling cookies may affect your experience on Teach Charlie AI:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li>You may not be able to log in or stay logged in</li>
            <li>Some features may not work properly</li>
            <li>Your preferences (like theme) will not be saved</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Do Not Track
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            We respect Do Not Track (DNT) signals. When DNT is enabled in your browser, we will not set analytics or tracking cookies. However, essential cookies are still required for the platform to function.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Updates to This Policy
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            We may update this Cookie Policy from time to time. We will notify you of significant changes by posting a notice on the platform or via email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Questions?
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            If you have questions about our use of cookies, contact us:
          </p>
          <ul className="list-none text-gray-600 dark:text-neutral-400 space-y-2">
            <li><strong>Email:</strong> <a href="mailto:privacy@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">privacy@teachcharlie.ai</a></li>
          </ul>
        </section>
      </div>
    </div>
  )
}
