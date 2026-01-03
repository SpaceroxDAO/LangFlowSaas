import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Teach Charlie</span>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-gray-900 font-medium">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build AI Agents in
            <span className="text-blue-600"> 3 Simple Steps</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Create custom AI assistants for your business without writing a single line of code.
            Just answer three questions and Charlie is ready to help your customers.
          </p>

          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Create Your First Agent
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/create"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Create Your First Agent
            </Link>
          </SignedIn>
        </div>

        {/* Steps */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Who is Charlie?</h3>
            <p className="text-gray-600">
              Define your agent's personality, tone, and role. Is Charlie a helpful support agent
              or a knowledgeable sales assistant?
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">What are the rules?</h3>
            <p className="text-gray-600">
              Set the knowledge and guidelines Charlie should follow. Add your product info,
              policies, and best practices.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">What tricks can Charlie do?</h3>
            <p className="text-gray-600">
              Define the capabilities and tasks Charlie can perform. Answer questions, book
              appointments, or process orders.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
