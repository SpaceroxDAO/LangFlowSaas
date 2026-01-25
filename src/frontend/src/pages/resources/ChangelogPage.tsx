import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, ArrowLeft } from 'lucide-react'
import { DocContent } from '@/components/docs/DocContent'

export function ChangelogPage() {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch('/docs/changelog/index.md')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Changelog not found')
        }
        return res.text()
      })
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-4/6"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-gray-400 dark:text-neutral-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Changelog Not Found
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">
            The changelog is being prepared and will be available soon.
          </p>
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back to Resources
          </Link>
        </div>
      </div>
    )
  }

  return <DocContent content={content || ''} />
}
