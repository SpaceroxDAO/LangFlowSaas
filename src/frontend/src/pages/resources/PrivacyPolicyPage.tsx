import { Link } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'

export function PrivacyPolicyPage() {
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
            <Shield className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
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
            Introduction
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Teach Charlie AI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI agent builder platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Information We Collect
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Information You Provide
          </h3>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Account information (name, email address, password)</li>
            <li>Payment and billing information (processed securely through Stripe)</li>
            <li>AI agent configurations (prompts, knowledge sources, tools)</li>
            <li>Chat conversations with your AI agents</li>
            <li>Support requests and communications</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Automatically Collected Information
          </h3>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Usage data (features used, time spent, interactions)</li>
            <li>Device information (browser type, operating system, IP address)</li>
            <li>Analytics data (via Sentry for error tracking and performance monitoring)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We use the collected information for:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Providing and maintaining our platform services</li>
            <li>Processing payments and managing subscriptions</li>
            <li>Improving and optimizing our platform features</li>
            <li>Sending important service updates and notifications</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>Detecting and preventing fraud, abuse, or security incidents</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Sharing and Disclosure
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We do not sell your personal information. We may share your data with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li><strong>Service Providers:</strong> Stripe (payments), Clerk (authentication), Sentry (error tracking), and AI model providers (OpenAI, Anthropic)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Security
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Encryption in transit (HTTPS/TLS) and at rest</li>
            <li>Secure authentication via Clerk (JWT tokens)</li>
            <li>Regular security audits and vulnerability scanning</li>
            <li>Role-based access controls</li>
            <li>PostgreSQL database with security best practices</li>
          </ul>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Retention
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time through your account settings or by contacting support.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Rights
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            To exercise these rights, contact us at <a href="mailto:privacy@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">privacy@teachcharlie.ai</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Cookies and Tracking
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Maintain your session and authentication state</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze platform usage and performance</li>
          </ul>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            You can control cookies through your browser settings, but disabling cookies may affect platform functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Third-Party Services
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Our platform integrates with third-party services that have their own privacy policies:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Stripe Privacy Policy</a></li>
            <li><a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Clerk Privacy Policy</a></li>
            <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">OpenAI Privacy Policy</a></li>
            <li><a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Anthropic Privacy Policy</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Children's Privacy
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Our platform is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            International Data Transfers
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Changes to This Policy
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the platform. Your continued use of the platform after changes become effective constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            If you have questions or concerns about this Privacy Policy, please contact us:
          </p>
          <ul className="list-none text-gray-600 dark:text-neutral-400 space-y-2">
            <li><strong>Email:</strong> <a href="mailto:privacy@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">privacy@teachcharlie.ai</a></li>
            <li><strong>GitHub Issues:</strong> <a href="https://github.com/SpaceroxDAO/LangFlowSaas/issues" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Open an issue</a></li>
          </ul>
        </section>
      </div>
    </div>
  )
}
