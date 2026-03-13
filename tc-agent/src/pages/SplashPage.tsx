import { motion } from "framer-motion";
import { useEffect } from "react";
import { getStoredToken } from "../lib/store";

interface SplashPageProps {
  onAuthenticated: () => void;
  onNeedsAuth: () => void;
}

export function SplashPage({ onAuthenticated, onNeedsAuth }: SplashPageProps) {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getStoredToken();
        if (token) {
          onAuthenticated();
        } else {
          onNeedsAuth();
        }
      } catch {
        onNeedsAuth();
      }
    };

    // Brief delay for splash branding
    const timer = setTimeout(checkToken, 800);

    // Fallback: if token check hangs, go to setup code page
    const fallback = setTimeout(() => {
      console.warn("Token check did not complete within 5s, falling through to setup code");
      onNeedsAuth();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, [onAuthenticated, onNeedsAuth]);

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
