interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3 mt-6">
      {/* Items count */}
      <div className="text-sm text-gray-600">
        {startItem}-{endItem} of {totalItems} agents
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page indicator */}
        <div className="flex items-center gap-1 text-sm">
          <select
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
          <span className="text-gray-500">of {totalPages} pages</span>
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
