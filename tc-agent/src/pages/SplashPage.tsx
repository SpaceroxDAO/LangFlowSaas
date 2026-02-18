import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

interface SplashPageProps {
  onAuthenticated: () => void;
  onNeedsAuth: () => void;
}

export function SplashPage({ onAuthenticated, onNeedsAuth }: SplashPageProps) {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    // Small delay for visual polish
    const timer = setTimeout(() => {
      if (isSignedIn) {
        onAuthenticated();
      } else {
        onNeedsAuth();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, onAuthenticated, onNeedsAuth]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-4">
          <span className="text-5xl">🐕</span>
        </div>

        <h1 className="text-white text-xl font-bold mt-2">Teach Charlie</h1>
        <p className="text-gray-500 text-sm mt-1">Connecting your AI agent...</p>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
