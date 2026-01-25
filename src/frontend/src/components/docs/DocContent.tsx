import { useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Link } from 'react-router-dom'
import 'highlight.js/styles/github-dark.css'

interface DocContentProps {
  content: string
  prevPage?: { title: string; path: string }
  nextPage?: { title: string; path: string }
}

export function DocContent({ content, prevPage, nextPage }: DocContentProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 lg:px-8">
      {/*
        =============================================
        TYPOGRAPHY SCALE FOR DOCUMENTATION
        =============================================
        H1: 40px / extra-bold / tight tracking - Page title
        H2: 28px / bold / tight tracking - Major sections
        H3: 22px / semibold - Subsections
        H4: 18px / semibold - Minor headings
        Body: 17px / normal / relaxed line-height
        Strong: Bold + darker color
        Code: 15px / monospace / colored background
        =============================================
      */}
      <div className="doc-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // H1 - Page title (40px, extra-bold)
            h1: ({ children }) => (
              <h1 className="text-[40px] leading-[1.1] font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 mt-0">
                {children}
              </h1>
            ),
            // H2 - Major sections (28px, bold, with border)
            h2: ({ children }) => (
              <h2 className="text-[28px] leading-[1.2] font-bold tracking-tight text-gray-900 dark:text-white mt-14 mb-6 pb-4 border-b-2 border-gray-200 dark:border-neutral-700">
                {children}
              </h2>
            ),
            // H3 - Subsections (22px, semibold)
            h3: ({ children }) => (
              <h3 className="text-[22px] leading-[1.3] font-semibold tracking-tight text-gray-800 dark:text-neutral-100 mt-10 mb-4">
                {children}
              </h3>
            ),
            // H4 - Minor headings (18px, semibold)
            h4: ({ children }) => (
              <h4 className="text-[18px] leading-[1.4] font-semibold text-gray-800 dark:text-neutral-200 mt-8 mb-3">
                {children}
              </h4>
            ),
            // H5 (16px, semibold)
            h5: ({ children }) => (
              <h5 className="text-[16px] leading-[1.4] font-semibold text-gray-700 dark:text-neutral-300 mt-6 mb-2">
                {children}
              </h5>
            ),
            // H6 (14px, semibold, uppercase)
            h6: ({ children }) => (
              <h6 className="text-[14px] leading-[1.4] font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400 mt-6 mb-2">
                {children}
              </h6>
            ),
            // Paragraphs (17px, relaxed line-height)
            p: ({ children }) => (
              <p className="text-[17px] leading-[1.75] text-gray-600 dark:text-neutral-300 my-5">
                {children}
              </p>
            ),
            // Strong/Bold text
            strong: ({ children }) => (
              <strong className="font-bold text-gray-900 dark:text-white">
                {children}
              </strong>
            ),
            // Emphasis/Italic
            em: ({ children }) => (
              <em className="italic text-gray-700 dark:text-neutral-200">
                {children}
              </em>
            ),
            // Custom link handling for internal/external links
            a: ({ href, children }) => {
              const isExternal = href?.startsWith('http')
              if (isExternal) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 dark:text-violet-400 font-medium no-underline border-b border-violet-300 dark:border-violet-600 hover:border-violet-600 dark:hover:border-violet-400 transition-colors"
                  >
                    {children}
                    <svg className="inline-block w-3.5 h-3.5 ml-1 -mt-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )
              }
              return (
                <Link
                  to={href || '#'}
                  className="text-violet-600 dark:text-violet-400 font-medium no-underline border-b border-violet-300 dark:border-violet-600 hover:border-violet-600 dark:hover:border-violet-400 transition-colors"
                >
                  {children}
                </Link>
              )
            },
            // Unordered lists
            ul: ({ children }) => (
              <ul className="my-6 space-y-3 pl-0 list-none">
                {children}
              </ul>
            ),
            // Ordered lists
            ol: ({ children }) => (
              <ol className="my-6 space-y-3 pl-6 list-decimal marker:text-gray-400 dark:marker:text-neutral-500 marker:font-semibold">
                {children}
              </ol>
            ),
            // List items with styled bullets
            li: ({ children }) => (
              <li className="text-[17px] leading-[1.7] text-gray-600 dark:text-neutral-300 pl-0 flex gap-3 items-start">
                <span className="text-violet-500 dark:text-violet-400 mt-[0.35em] flex-shrink-0 text-lg">•</span>
                <span className="flex-1">{children}</span>
              </li>
            ),
            // Info/warning/tip callouts using blockquotes
            blockquote: ({ children }: { children?: ReactNode }) => {
              const text = String(children)
              const isWarning = text.includes('Warning:') || text.includes('IMPORTANT:') || text.includes('Caution:')
              const isTip = text.includes('Tip:') || text.includes('TIP:') || text.includes('Note:')
              const isInfo = text.includes('Info:') || text.includes('INFO:')

              let borderColor = 'border-l-violet-500'
              let bgColor = 'bg-violet-50/70 dark:bg-violet-900/20'
              let icon = null

              if (isWarning) {
                borderColor = 'border-l-amber-500'
                bgColor = 'bg-amber-50/70 dark:bg-amber-900/20'
                icon = (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                )
              } else if (isTip) {
                borderColor = 'border-l-emerald-500'
                bgColor = 'bg-emerald-50/70 dark:bg-emerald-900/20'
                icon = (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )
              } else if (isInfo) {
                borderColor = 'border-l-blue-500'
                bgColor = 'bg-blue-50/70 dark:bg-blue-900/20'
                icon = (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )
              }

              return (
                <blockquote
                  className={`border-l-4 ${borderColor} ${bgColor} py-4 px-5 my-8 rounded-r-xl not-italic`}
                >
                  <div className="flex gap-4 items-start">
                    {icon}
                    <div className="flex-1 text-[16px] leading-relaxed text-gray-700 dark:text-neutral-300 [&>p]:my-0">
                      {children}
                    </div>
                  </div>
                </blockquote>
              )
            },
            // Inline code
            code: ({ className, children }) => {
              // Check if this is a code block (has language class) or inline code
              const isCodeBlock = className?.includes('language-') || className?.includes('hljs')

              if (isCodeBlock) {
                // Code block content - let pre handle styling
                return <code className={className}>{children}</code>
              }

              // Inline code
              return (
                <code className="text-[15px] font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30 px-2 py-1 rounded-md">
                  {children}
                </code>
              )
            },
            // Code blocks with copy button
            pre: ({ children }) => {
              const codeElement = children as React.ReactElement
              const codeString = codeElement?.props?.children || ''
              const id = `code-${Math.random().toString(36).substr(2, 9)}`

              return (
                <div className="relative group my-8">
                  <pre className="bg-[#0d1117] text-gray-100 rounded-2xl shadow-xl overflow-hidden p-5 overflow-x-auto text-[14px] leading-[1.6]">
                    {children}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(String(codeString), id)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    title="Copy code"
                  >
                    {copied === id ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              )
            },
            // Tables
            table: ({ children }) => (
              <div className="my-8 overflow-x-auto">
                <table className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-100 dark:bg-neutral-800">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="px-5 py-3 text-left text-[14px] font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-5 py-4 text-[16px] border-t border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-neutral-300">
                {children}
              </td>
            ),
            // Horizontal rule
            hr: () => (
              <hr className="my-12 border-t-2 border-gray-200 dark:border-neutral-700" />
            ),
            // Images
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt || ''}
                className="rounded-2xl shadow-lg my-8 max-w-full"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Previous/Next navigation */}
      {(prevPage || nextPage) && (
        <nav className="mt-16 pt-8 border-t-2 border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between gap-4">
            {prevPage ? (
              <Link
                to={prevPage.path}
                className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors flex-1 max-w-[45%]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                  <svg className="w-5 h-5 text-gray-500 dark:text-neutral-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:-translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-1">Previous</div>
                  <div className="text-[15px] font-semibold text-gray-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{prevPage.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextPage ? (
              <Link
                to={nextPage.path}
                className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors flex-1 max-w-[45%] justify-end text-right"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-1">Next</div>
                  <div className="text-[15px] font-semibold text-gray-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{nextPage.title}</div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                  <svg className="w-5 h-5 text-gray-500 dark:text-neutral-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      )}
    </article>
  )
}
