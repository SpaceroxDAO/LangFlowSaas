import { useCallback, useState, Component } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";
import { SplashPage } from "./pages/SplashPage";
import { SignInPage } from "./pages/SignInPage";
import { SetupPage } from "./pages/SetupPage";
import { AgentDashboardPage } from "./pages/AgentDashboardPage";
import { SettingsPage } from "./pages/SettingsPage";
import type { BootstrapData } from "./lib/api";

type Screen = "splash" | "setup-code" | "setup" | "dashboard" | "settings";

// --- Error Boundary ---
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(e: Error) {
    return { error: e };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24,
          color: "#ff6b6b",
          background: "#0a0a0a",
          fontFamily: "monospace",
          fontSize: 12,
          height: "100vh",
          overflow: "auto",
          whiteSpace: "pre-wrap",
        }}>
          <b style={{ fontSize: 14 }}>React Error</b>
          <br /><br />
          {this.state.error.message}
          <br /><br />
          <span style={{ color: "#888" }}>{this.state.error.stack}</span>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main app ---
function AppInner() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [openclawReady, setOpenclawReady] = useState<boolean | null>(null);
  const [initialBootstrap, setInitialBootstrap] = useState<BootstrapData | null>(null);

  // After token is found (splash) or activation succeeds (setup-code),
  // check OpenClaw status and route accordingly.
  const checkOpenClawSetup = useCallback(async () => {
    try {
      const result = await invoke<{ installed: boolean; version: string | null }>("check_openclaw");
      if (result.installed) {
        setOpenclawReady(true);
        setScreen("dashboard");
      } else {
        setOpenclawReady(false);
        setScreen("setup");
      }
    } catch {
      setOpenclawReady(false);
      setScreen("setup");
    }
  }, []);

  const handleAuthenticated = useCallback(() => {
    checkOpenClawSetup();
  }, [checkOpenClawSetup]);

  const handleNeedsAuth = useCallback(() => setScreen("setup-code"), []);

  const handleActivated = useCallback(
    (data: BootstrapData) => {
      setInitialBootstrap(data);
      checkOpenClawSetup();
    },
    [checkOpenClawSetup]
  );

  const handleDisconnected = useCallback(() => {
    setInitialBootstrap(null);
    setOpenclawReady(null);
    setScreen("setup-code");
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="h-screen"
      >
        {screen === "splash" && (
          <SplashPage
            onAuthenticated={handleAuthenticated}
            onNeedsAuth={handleNeedsAuth}
          />
        )}
        {screen === "setup-code" && (
          <SignInPage onActivated={handleActivated} />
        )}
        {screen === "setup" && (
          <SetupPage
            onComplete={() => setScreen("dashboard")}
            onSettings={() => setScreen("settings")}
            initialBootstrapData={initialBootstrap}
          />
        )}
        {screen === "dashboard" && (
          <AgentDashboardPage onSettings={() => setScreen("settings")} />
        )}
        {screen === "settings" && (
          <SettingsPage
            onBack={() => {
              if (openclawReady) {
                setScreen("dashboard");
              } else {
                setScreen("setup");
              }
            }}
            onDisconnected={handleDisconnected}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- Root component ---
export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
