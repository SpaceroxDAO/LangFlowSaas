import { Link } from 'react-router-dom'
import { Users, DollarSign, TrendingUp, Gift, ArrowLeft } from 'lucide-react'

export function AffiliatesPage() {
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
          <Users className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Affiliate Program
        </h1>
        <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Earn commissions by helping others close the AI gap
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-8 border border-violet-200 dark:border-violet-800 mb-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          Our affiliate program is currently in development. Join the waitlist to be notified when it launches.
        </p>
        <a
          href="mailto:affiliates@teachcharlie.ai?subject=Affiliate Program Waitlist"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          Join Waitlist
        </a>
      </div>

      {/* Program benefits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Program Benefits
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              20% Commission
            </h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Earn 20% recurring commission on all referred customers for 12 months
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              90-Day Cookie
            </h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Get credit for purchases made within 90 days of referral click
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Marketing Assets
            </h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Get banners, landing pages, and email templates to promote Teach Charlie AI
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          How It Works
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Sign Up
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">
                Join our affiliate program and get your unique referral link
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Share
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">
                Promote Teach Charlie AI to your audience via blog, social media, email, or community
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Earn
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">
                Receive 20% recurring commission for 12 months on all referred customers
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Get Paid
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">
                Monthly payouts via PayPal or bank transfer (minimum $100 balance)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ideal affiliates */}
      <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Who Should Join?
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-4">
          Our affiliate program is perfect for:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-violet-600 dark:text-violet-400 flex-shrink-0">✓</span>
            <span className="text-gray-600 dark:text-neutral-400">
              <strong className="text-gray-900 dark:text-white">Educators & Trainers:</strong> Teaching AI skills or running workshops
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-violet-600 dark:text-violet-400 flex-shrink-0">✓</span>
            <span className="text-gray-600 dark:text-neutral-400">
              <strong className="text-gray-900 dark:text-white">Tech Bloggers & YouTubers:</strong> Creating AI/automation content
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-violet-600 dark:text-violet-400 flex-shrink-0">✓</span>
            <span className="text-gray-600 dark:text-neutral-400">
              <strong className="text-gray-900 dark:text-white">Consultants & Agencies:</strong> Helping clients with AI implementation
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-violet-600 dark:text-violet-400 flex-shrink-0">✓</span>
            <span className="text-gray-600 dark:text-neutral-400">
              <strong className="text-gray-900 dark:text-white">Community Leaders:</strong> Managing online communities or forums
            </span>
          </li>
        </ul>
      </div>

      {/* Potential earnings */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-200 dark:border-neutral-800 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Potential Earnings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Referrals/Month</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Monthly Earnings*</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Annual Earnings*</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-neutral-800">
                <td className="py-3 px-4 text-gray-600 dark:text-neutral-400">5 Pro plans</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-white font-medium">$190</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-white font-medium">$2,280</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-neutral-800">
                <td className="py-3 px-4 text-gray-600 dark:text-neutral-400">10 Pro plans</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-white font-medium">$380</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-white font-medium">$4,560</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-neutral-800">
                <td className="py-3 px-4 text-gray-600 dark:text-neutral-400">20 Pro plans</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-white font-medium">$760</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-white font-medium">$9,120</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600 dark:text-neutral-400 mt-4">
          * Based on Pro plan at $19/month with 20% commission. Earnings are recurring for 12 months.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-8 border border-violet-200 dark:border-violet-800 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Interested in Joining?
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          Get early access when we launch the affiliate program. No commitment required.
        </p>
        <a
          href="mailto:affiliates@teachcharlie.ai?subject=Affiliate Program Waitlist"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          Join Waitlist
        </a>
      </div>
    </div>
  )
}
