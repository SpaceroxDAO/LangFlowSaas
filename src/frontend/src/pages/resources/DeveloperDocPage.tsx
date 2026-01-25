import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'
import { DocContent } from '@/components/docs/DocContent'
import { developerDocs } from '@/components/docs/DocSidebar'

export function DeveloperDocPage() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Find current doc index for prev/next navigation
  const currentIndex = developerDocs.findIndex((d) => d.slug === slug)
  const prevDoc = currentIndex > 0 ? developerDocs[currentIndex - 1] : null
  const nextDoc = currentIndex < developerDocs.length - 1 ? developerDocs[currentIndex + 1] : null

  useEffect(() => {
    if (!slug) return

    setLoading(true)
    setError(null)

    fetch(`/docs/developers/${slug}.md`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Document not found')
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
  }, [slug])

  // Redirect to developers index if slug doesn't exist
  if (!slug || (currentIndex === -1 && !loading)) {
    return <Navigate to="/resources/developers" replace />
  }

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
            <FileText className="w-8 h-8 text-gray-400 dark:text-neutral-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Document Not Found
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">
            This documentation doesn't exist yet or is still being written.
          </p>
          <Link
            to="/resources/developers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            View All Developer Docs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DocContent
      content={content || ''}
      prevPage={prevDoc ? { title: prevDoc.title, path: prevDoc.path } : undefined}
      nextPage={nextDoc ? { title: nextDoc.title, path: nextDoc.path } : undefined}
    />
  )
}
