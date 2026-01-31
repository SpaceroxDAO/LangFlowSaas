import { Link } from 'react-router-dom'
import { Shield, Lock, Database, Eye, CheckCircle2, ArrowLeft } from 'lucide-react'

export function SecurityPage() {
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
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Security & Compliance
        </h1>
        <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Enterprise-grade security to protect your data and AI agents
        </p>
      </div>

      {/* Security features */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Encryption
            </h3>
          </div>
          <p className="text-gray-600 dark:text-neutral-400">
            All data is encrypted in transit (TLS 1.3) and at rest (AES-256). API keys and credentials are encrypted using industry-standard encryption.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Data Isolation
            </h3>
          </div>
          <p className="text-gray-600 dark:text-neutral-400">
            Your data is logically isolated in our PostgreSQL database with row-level security. No cross-tenant data access is possible.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Access Controls
            </h3>
          </div>
          <p className="text-gray-600 dark:text-neutral-400">
            Authentication via Clerk with JWT tokens. Role-based access control (RBAC) and audit logging for all sensitive operations.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Regular Audits
            </h3>
          </div>
          <p className="text-gray-600 dark:text-neutral-400">
            Automated security scanning with Semgrep, Trivy, and npm audit. Dependency updates via Dependabot and regular penetration testing.
          </p>
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Compliance & Certifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">GDPR Compliant</h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">
                Full compliance with EU General Data Protection Regulation. Data processing agreements available upon request.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">SOC 2 Type II (In Progress)</h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">
                Currently undergoing SOC 2 Type II certification process. Expected completion Q2 2026.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">CCPA Compliant</h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">
                California Consumer Privacy Act compliant. Users can request data deletion at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Self-hosting */}
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-8 border border-violet-200 dark:border-violet-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Self-Hosting for Maximum Security
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          Deploy Teach Charlie AI on your own infrastructure for complete data ownership and control. Perfect for regulated industries and enterprise security requirements.
        </p>
        <Link
          to="/resources/developers/self-hosting"
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          View Self-Hosting Guide
        </Link>
      </div>

      {/* Contact */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-neutral-400 mb-4">
          Have security questions or need a security review?
        </p>
        <a
          href="mailto:security@teachcharlie.ai"
          className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:underline font-medium"
        >
          Contact our security team
        </a>
      </div>
    </div>
  )
}
