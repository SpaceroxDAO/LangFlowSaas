/**
 * Invoice History component.
 * Displays billing invoice history from Stripe.
 */
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Invoice } from '@/types'

interface InvoiceHistoryProps {
  limit?: number
}

export function InvoiceHistory({ limit = 10 }: InvoiceHistoryProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['invoices', limit],
    queryFn: () => api.getInvoices(limit),
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            Paid
          </span>
        )
      case 'open':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            Pending
          </span>
        )
      case 'void':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
            Void
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
            {status}
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 p-6">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-slate-200 dark:bg-neutral-700 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-neutral-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Failed to load invoices</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">Please try again later</p>
          </div>
        </div>
      </div>
    )
  }

  const invoices = data?.invoices || []

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Invoice History</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Your billing receipts and invoices
          </p>
        </div>
      </div>

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-neutral-400">No invoices yet</p>
          <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
            Your invoices will appear here after your first purchase
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice: Invoice) => (
            <div
              key={invoice.id}
              className="p-4 bg-slate-50 dark:bg-neutral-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {invoice.description}
                    </p>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400">
                    <span>{formatDate(invoice.date)}</span>
                    {invoice.number && (
                      <>
                        <span>•</span>
                        <span className="font-mono">{invoice.number}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {invoice.amount_display}
                  </span>

                  {/* Download/View buttons */}
                  <div className="flex items-center gap-1">
                    {invoice.pdf_url && (
                      <a
                        href={invoice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                    )}
                    {invoice.hosted_invoice_url && (
                      <a
                        href={invoice.hosted_invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        title="View invoice"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {data?.has_more && (
            <p className="text-center text-xs text-slate-400 dark:text-neutral-500 pt-2">
              Showing last {limit} invoices
            </p>
          )}
        </div>
      )}
    </div>
  )
}
