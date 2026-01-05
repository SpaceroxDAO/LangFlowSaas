import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { SignInPage } from '@/pages/SignInPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CreateAgentPage } from '@/pages/CreateAgentPage'
import { EditAgentPage } from '@/pages/EditAgentPage'
import { PlaygroundPage } from '@/pages/PlaygroundPage'
import { FrameworkPage } from '@/pages/FrameworkPage'
import { isDevMode, DevSignedIn, DevSignedOut } from '@/providers/DevModeProvider'

// Use dev mode or Clerk components based on environment
const AuthSignedIn = isDevMode ? DevSignedIn : SignedIn
const AuthSignedOut = isDevMode ? DevSignedOut : SignedOut

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthSignedIn>{children}</AuthSignedIn>
      <AuthSignedOut>
        <Navigate to="/sign-in" replace />
      </AuthSignedOut>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/framework" element={<FrameworkPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateAgentPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:agentId"
          element={
            <ProtectedRoute>
              <Layout>
                <EditAgentPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/playground/:agentId"
          element={
            <ProtectedRoute>
              <Layout>
                <PlaygroundPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
