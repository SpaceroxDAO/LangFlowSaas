import { Link } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'

export function DPAPage() {
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
            Data Processing Agreement (DPA)
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
            Overview
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            This Data Processing Agreement ("DPA") forms part of the Terms of Service between you ("Customer") and Teach Charlie AI ("Processor"). This DPA governs the processing of personal data by the Processor on behalf of the Customer in connection with the Platform.
          </p>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            This DPA is compliant with the EU General Data Protection Regulation (GDPR) and other applicable data protection laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Definitions
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person</li>
            <li><strong>"Processing"</strong> means any operation performed on Personal Data, such as collection, storage, use, or deletion</li>
            <li><strong>"Data Subject"</strong> means the identified or identifiable person to whom Personal Data relates</li>
            <li><strong>"Sub-processor"</strong> means any third party engaged by the Processor to process Personal Data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Scope and Nature of Processing
          </h2>
          <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-xl p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Purpose</h3>
            <p className="text-gray-600 dark:text-neutral-400 mb-3">
              Processing of Personal Data to provide the AI agent builder platform services.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Types of Personal Data</h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-1">
              <li>Account information (name, email address)</li>
              <li>Usage data (features used, time spent)</li>
              <li>AI agent configurations and prompts</li>
              <li>Chat conversations with AI agents</li>
              <li>Payment information (processed by Stripe)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-3">Categories of Data Subjects</h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-1">
              <li>Customer's employees and authorized users</li>
              <li>End users interacting with deployed AI agents</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. Processor Obligations
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            The Processor shall:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li>Process Personal Data only on documented instructions from the Customer</li>
            <li>Ensure that persons authorized to process Personal Data are bound by confidentiality</li>
            <li>Implement appropriate technical and organizational measures to ensure data security</li>
            <li>Assist the Customer in responding to Data Subject requests</li>
            <li>Notify the Customer without undue delay upon becoming aware of a personal data breach</li>
            <li>Delete or return all Personal Data upon termination of services, unless required by law to retain</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Sub-processors
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            The Customer authorizes the Processor to engage the following sub-processors:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-neutral-900 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Sub-processor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Purpose</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Stripe</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Payment processing</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">USA</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Clerk</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Authentication</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">USA</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">OpenAI</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">AI model hosting</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">USA</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Anthropic</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">AI model hosting</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">USA</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">DigitalOcean</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Cloud hosting</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">USA</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Sentry</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">Error monitoring</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">USA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Security Measures
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            The Processor implements the following technical and organizational measures:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li>Encryption of data in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Role-based access controls and authentication via JWT tokens</li>
            <li>Regular security audits and vulnerability scanning</li>
            <li>Automated backup procedures with encryption</li>
            <li>Incident response and data breach notification procedures</li>
            <li>Employee training on data protection and security</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Data Subject Rights
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            The Processor shall assist the Customer in fulfilling its obligations to respond to requests from Data Subjects exercising their rights under GDPR:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li>Right of access</li>
            <li>Right to rectification</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            7. Data Breach Notification
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            The Processor shall notify the Customer without undue delay (within 24 hours) upon becoming aware of any personal data breach. The notification shall include details of the breach, affected data, and remedial actions taken.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            8. International Data Transfers
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            Personal Data may be transferred to and processed in countries outside the European Economic Area (EEA). Where such transfers occur, the Processor ensures appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            9. Audits and Compliance
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
            The Customer may audit the Processor's compliance with this DPA upon reasonable notice. The Processor shall provide necessary information and access to demonstrate compliance with data protection obligations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            10. Term and Termination
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            This DPA shall remain in effect as long as the Processor processes Personal Data on behalf of the Customer. Upon termination:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2">
            <li>The Processor shall delete or return all Personal Data within 30 days</li>
            <li>Retention may continue if required by applicable law</li>
            <li>The Customer may request certification of deletion</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            11. Contact for DPA Matters
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
            For questions or requests related to this DPA:
          </p>
          <ul className="list-none text-gray-600 dark:text-neutral-400 space-y-2">
            <li><strong>Email:</strong> <a href="mailto:privacy@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">privacy@teachcharlie.ai</a></li>
            <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">dpo@teachcharlie.ai</a></li>
          </ul>
        </section>

        <div className="mt-12 p-6 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-200 dark:border-violet-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Need a Signed DPA?
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 mb-4">
            Enterprise customers can request a signed Data Processing Agreement. Contact us for a custom DPA tailored to your requirements.
          </p>
          <a
            href="mailto:legal@teachcharlie.ai"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Request Signed DPA
          </a>
        </div>
      </div>
    </div>
  )
}
