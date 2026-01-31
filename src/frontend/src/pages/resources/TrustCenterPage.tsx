import { Link } from 'react-router-dom'
import { Shield, Lock, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react'

export function TrustCenterPage() {
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
          Trust Center
        </h1>
        <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Transparency into our security, privacy, and compliance practices
        </p>
      </div>

      {/* Status banner */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 mb-12">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
              All Systems Operational
            </h3>
            <p className="text-emerald-700 dark:text-emerald-300 text-sm">
              All services are running normally. Last updated: January 31, 2026 at 10:00 AM UTC
            </p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link
          to="/resources/security"
          className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Security
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 text-sm">
            Enterprise-grade security measures
          </p>
        </Link>

        <Link
          to="/resources/privacy-policy"
          className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Privacy Policy
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 text-sm">
            How we protect your data
          </p>
        </Link>

        <Link
          to="/resources/dpa"
          className="group p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            DPA
          </h3>
          <p className="text-gray-600 dark:text-neutral-400 text-sm">
            Data Processing Agreement
          </p>
        </Link>
      </div>

      {/* Compliance */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Compliance & Certifications
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                GDPR Compliant
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3">
              Full compliance with EU General Data Protection Regulation
            </p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Certified
            </span>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CCPA Compliant
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3">
              California Consumer Privacy Act compliant
            </p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Certified
            </span>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                SOC 2 Type II
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3">
              Security, availability, and confidentiality certification
            </p>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              ⏳ In Progress (Q2 2026)
            </span>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ISO 27001
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3">
              Information security management system
            </p>
            <span className="text-xs text-gray-600 dark:text-neutral-400 font-medium">
              Planned (2026)
            </span>
          </div>
        </div>
      </section>

      {/* Security measures */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Security Measures
        </h2>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Encryption
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                  TLS 1.3 for data in transit, AES-256 for data at rest. All API keys and credentials encrypted.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Access Controls
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                  Role-based access control (RBAC), multi-factor authentication (MFA), and JWT-based authentication via Clerk.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Regular Audits
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                  Automated security scanning with Semgrep, Trivy, npm audit. Weekly dependency updates via Dependabot.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Incident Response
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                  24-hour breach notification policy. Comprehensive incident response plan with regular drills.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Data Backups
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm">
                  Daily encrypted backups with 30-day retention. Point-in-time recovery capability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Infrastructure & Vendors
        </h2>
        <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800">
          <p className="text-gray-600 dark:text-neutral-400 mb-4">
            Our platform is built on trusted infrastructure providers:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <span className="text-gray-900 dark:text-white font-medium">DigitalOcean (Cloud Hosting)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <span className="text-gray-900 dark:text-white font-medium">Clerk (Authentication)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <span className="text-gray-900 dark:text-white font-medium">Stripe (Payments)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <span className="text-gray-900 dark:text-white font-medium">Sentry (Error Monitoring)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <span className="text-gray-900 dark:text-white font-medium">OpenAI (AI Models)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <span className="text-gray-900 dark:text-white font-medium">Anthropic (AI Models)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible disclosure */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Responsible Disclosure
        </h2>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800">
          <p className="text-gray-600 dark:text-neutral-400 mb-4">
            Found a security vulnerability? We appreciate responsible disclosure:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-neutral-400 space-y-2 mb-4">
            <li>Email details to <a href="mailto:security@teachcharlie.ai" className="text-violet-600 dark:text-violet-400 hover:underline">security@teachcharlie.ai</a></li>
            <li>Include steps to reproduce the issue</li>
            <li>Allow us 90 days to address before public disclosure</li>
            <li>We do not currently offer a bug bounty program</li>
          </ul>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            We typically respond within 24 hours and provide updates every 7 days during remediation.
          </p>
        </div>
      </section>

      {/* Contact */}
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-8 border border-violet-200 dark:border-violet-800 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Questions About Trust & Security?
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          Our security team is happy to answer questions or provide additional documentation.
        </p>
        <a
          href="mailto:security@teachcharlie.ai"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          Contact Security Team
        </a>
      </div>
    </div>
  )
}
