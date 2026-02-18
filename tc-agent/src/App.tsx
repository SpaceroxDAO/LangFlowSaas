import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashPage } from "./pages/SplashPage";
import { SignInPage } from "./pages/SignInPage";
import { AgentDashboardPage } from "./pages/AgentDashboardPage";
import { SettingsPage } from "./pages/SettingsPage";

type Screen = "splash" | "sign-in" | "dashboard" | "settings";

export default function App() {
  const { isSignedIn } = useAuth();
  const [screen, setScreen] = useState<Screen>("splash");

  // When auth state changes externally (e.g. after Clerk sign-in)
  const handleAuthenticated = useCallback(() => setScreen("dashboard"), []);
  const handleNeedsAuth = useCallback(() => setScreen("sign-in"), []);

  // React to auth state changes
  useEffect(() => {
    if (isSignedIn && screen === "sign-in") {
      setScreen("dashboard");
    }
    if (!isSignedIn && screen === "dashboard") {
      setScreen("sign-in");
    }
  }, [isSignedIn, screen]);

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
        {screen === "sign-in" && <SignInPage />}
        {screen === "dashboard" && (
          <AgentDashboardPage onSettings={() => setScreen("settings")} />
        )}
        {screen === "settings" && (
          <SettingsPage onBack={() => setScreen("dashboard")} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
