import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Sentry } from '@/lib/sentry'
import { AppShell } from '@/components/AppShell'
import { HomePage } from '@/pages/HomePage'
import { SignInPage } from '@/pages/SignInPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { CreateAgentPage } from '@/pages/CreateAgentPage'
import { EditAgentPage } from '@/pages/EditAgentPage'
import { PlaygroundPage } from '@/pages/PlaygroundPage'
import { FrameworkPage } from '@/pages/FrameworkPage'
import { PricingPage } from '@/pages/PricingPage'
import { CanvasViewerPage } from '@/pages/CanvasViewerPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { FilesPage } from '@/pages/FilesPage'
import { BillingPage } from '@/pages/BillingPage'
import { AnalyticsDashboardPage } from '@/pages/AnalyticsDashboardPage'
import { MissionsPage } from '@/pages/MissionsPage'
import { MissionCanvasPage } from '@/pages/MissionCanvasPage'
import { isDevMode, DevSignedIn, DevSignedOut } from '@/providers/DevModeProvider'
// Resources pages (public documentation)
import { ResourcesLayout } from '@/pages/resources/ResourcesLayout'
import { ResourcesHomePage } from '@/pages/resources/ResourcesHomePage'
import { GuidesPage } from '@/pages/resources/GuidesPage'
import { GuidePage } from '@/pages/resources/GuidePage'
import { DevelopersPage } from '@/pages/resources/DevelopersPage'
import { DeveloperDocPage } from '@/pages/resources/DeveloperDocPage'
import { ChangelogPage } from '@/pages/resources/ChangelogPage'
import { PrivacyPolicyPage } from '@/pages/resources/PrivacyPolicyPage'
import { TermsOfServicePage } from '@/pages/resources/TermsOfServicePage'

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

// Error fallback component for when something crashes
function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We've been notified and are working on a fix. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />} showDialog>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/framework" element={<FrameworkPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Resources - Public Documentation (GitBook-style) */}
        <Route path="/resources" element={<ResourcesLayout />}>
          <Route index element={<ResourcesHomePage />} />
          <Route path="guides" element={<GuidesPage />} />
          <Route path="guides/:slug" element={<GuidePage />} />
          <Route path="developers" element={<DevelopersPage />} />
          <Route path="developers/:slug" element={<DeveloperDocPage />} />
          <Route path="changelog" element={<ChangelogPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        {/* Protected routes with AppShell (sidebar) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell>
                <ProjectsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/project/:projectId"
          element={
            <ProtectedRoute>
              <AppShell>
                <ProjectDetailPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <AppShell>
                <SettingsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/files"
          element={
            <ProtectedRoute>
              <AppShell>
                <FilesPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/billing"
          element={
            <ProtectedRoute>
              <AppShell>
                <BillingPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <ProtectedRoute>
              <AppShell>
                <AnalyticsDashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/missions"
          element={
            <ProtectedRoute>
              <AppShell>
                <MissionsPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        {/* Mission canvas page - full screen without AppShell */}
        <Route
          path="/mission/:missionId/canvas"
          element={
            <ProtectedRoute>
              <MissionCanvasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/old"
          element={
            <ProtectedRoute>
              <AppShell>
                <DashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <AppShell>
                <CreateAgentPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:agentId"
          element={
            <ProtectedRoute>
              <AppShell>
                <EditAgentPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/playground/:agentId"
          element={
            <ProtectedRoute>
              <AppShell>
                <PlaygroundPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        {/* New workflow playground route */}
        <Route
          path="/playground/workflow/:workflowId"
          element={
            <ProtectedRoute>
              <AppShell>
                <PlaygroundPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/canvas/:agentId"
          element={
            <ProtectedRoute>
              <AppShell>
                <CanvasViewerPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </Sentry.ErrorBoundary>
  )
}

export default App
