import { Link } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'

export function TermsOfServicePage() {
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
            <FileText className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Terms of Service
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
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            By accessing or using Teach Charlie AI ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Platform.
          </p>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            These Terms apply to all users, including free and paid subscribers, and govern your access to and use of our AI agent builder platform and related services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Description of Service
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Teach Charlie AI is an educational AI agent builder platform that allows users to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Create and configure AI agents through a guided question-and-answer process</li>
            <li>Test agents in an interactive playground environment</li>
            <li>Add knowledge sources (documents, URLs, text) for retrieval-augmented generation (RAG)</li>
            <li>Connect to external tools and services via MCP servers and Composio integrations</li>
            <li>Embed AI agents on external websites</li>
            <li>Access and modify underlying Langflow workflows</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. User Accounts
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            3.1 Account Creation
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            You must create an account to use the Platform. You agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activities under your account</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            3.2 Account Eligibility
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            You must be at least 13 years old to use the Platform. If you are under 18, you must have permission from a parent or legal guardian.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Subscription Plans and Billing
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            4.1 Plans
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We offer multiple subscription plans (Free, Pro, Team, Mission) with different features and limits. Current pricing and plan details are available on our <Link to="/pricing" className="text-violet-600 dark:text-violet-400 hover:underline">Pricing Page</Link>.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            4.2 Payment
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Paid subscriptions are billed monthly or yearly in advance. By subscribing, you authorize us to charge your payment method for recurring subscription fees until you cancel.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            4.3 Cancellation and Refunds
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing period. We do not provide refunds for partial subscription periods.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            4.4 Free Trial
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            We may offer free trials for paid plans. You will be charged when the trial period ends unless you cancel before the trial expires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Acceptable Use
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            You agree NOT to use the Platform to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Harass, abuse, or harm others</li>
            <li>Distribute spam, malware, or malicious code</li>
            <li>Generate misleading, deceptive, or fraudulent content</li>
            <li>Impersonate others or misrepresent your affiliation</li>
            <li>Circumvent security measures or access restrictions</li>
            <li>Use the Platform for illegal activities, including creating AI agents that violate laws</li>
            <li>Overload or disrupt our infrastructure (e.g., DDoS attacks)</li>
          </ul>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Content and Intellectual Property
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            6.1 Your Content
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            You retain ownership of content you upload (prompts, knowledge sources, configurations). By using the Platform, you grant us a license to use your content solely to provide and improve our services.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            6.2 Our Content
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            The Platform, including its design, code, documentation, and branding, is owned by Teach Charlie AI and protected by copyright and other intellectual property laws. You may not copy, modify, or redistribute our content without permission.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            6.3 Third-Party Content
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            The Platform integrates with third-party services (Langflow, OpenAI, Anthropic, Composio). You are responsible for complying with their terms of service when using these integrations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            7. AI-Generated Content
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            AI agents created on the Platform may generate unpredictable or inaccurate content. You are solely responsible for:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Reviewing and validating AI-generated outputs before use</li>
            <li>Ensuring AI agents comply with applicable laws and regulations</li>
            <li>Monitoring deployed agents for inappropriate or harmful content</li>
          </ul>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            We are not liable for any damages resulting from AI-generated content created using the Platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            8. Privacy and Data Security
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            Your privacy is important to us. Please review our <Link to="/resources/privacy-policy" className="text-violet-600 dark:text-violet-400 hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
          </p>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            We implement industry-standard security measures, but cannot guarantee absolute security. You acknowledge the inherent risks of transmitting data over the internet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            9. Disclaimer of Warranties
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Merchantability or fitness for a particular purpose</li>
            <li>Uninterrupted or error-free operation</li>
            <li>Accuracy, reliability, or completeness of AI-generated content</li>
            <li>Security or absence of viruses or harmful components</li>
          </ul>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            We do not warrant that the Platform will meet your requirements or expectations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            10. Limitation of Liability
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, TEACH CHARLIE AI SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Damages resulting from use or inability to use the Platform</li>
            <li>Damages caused by AI-generated content or third-party integrations</li>
          </ul>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            11. Indemnification
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            You agree to indemnify and hold harmless Teach Charlie AI from any claims, damages, or expenses arising from:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li>Your use of the Platform</li>
            <li>Your violation of these Terms</li>
            <li>Content you upload or AI agents you create</li>
            <li>Your violation of any third-party rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            12. Termination
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We may suspend or terminate your account at any time for:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Violation of these Terms</li>
            <li>Fraudulent or illegal activity</li>
            <li>Non-payment of subscription fees</li>
            <li>Prolonged inactivity (free accounts only)</li>
          </ul>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            Upon termination, you will lose access to your account and data. We may delete your data after a grace period.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            13. Modifications to Terms
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            We may update these Terms from time to time. We will notify you of significant changes via email or through the Platform. Your continued use after changes become effective constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            14. Governing Law and Disputes
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            These Terms are governed by the laws of the United States, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration or in courts located in the United States.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            15. Miscellaneous
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            15.1 Entire Agreement
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Teach Charlie AI.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            15.2 Severability
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            If any provision of these Terms is found invalid, the remaining provisions shall remain in effect.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            15.3 Waiver
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            Our failure to enforce any provision does not waive our right to enforce it later.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            16. Contact Us
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            If you have questions about these Terms, please contact us:
          </p>
          <ul className="list-none text-gray-600 dark:text-neutral-400 space-y-2">
            <li><strong>Email:</strong> <a href="mailto:legal@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">legal@teachcharlie.ai</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">support@teachcharlie.ai</a></li>
            <li><strong>GitHub Issues:</strong> <a href="https://github.com/SpaceroxDAO/LangFlowSaas/issues" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">Open an issue</a></li>
          </ul>
        </section>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800">
          <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
            By using Teach Charlie AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}
