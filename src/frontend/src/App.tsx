import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
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
import { CanvasViewerPage } from '@/pages/CanvasViewerPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { FilesPage } from '@/pages/FilesPage'
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
  )
}

export default App
