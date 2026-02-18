import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { invoke } from "@tauri-apps/api/core";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { signOut } = useClerk();
  const [autoStart, setAutoStart] = useState(false);
  const [configPath, setConfigPath] = useState("");

  useEffect(() => {
    isEnabled().then(setAutoStart).catch(() => {});
    invoke<string>("get_config_path").then(setConfigPath).catch(() => {});
  }, []);

  const handleAutoStartToggle = async () => {
    try {
      if (autoStart) {
        await disable();
        setAutoStart(false);
      } else {
        await enable();
        setAutoStart(true);
      }
    } catch {
      // Plugin not available in dev mode
    }
  };

  const handleSignOut = async () => {
    try {
      await invoke("stop_sidecar");
    } catch {
      // Sidecar might not be running
    }
    await signOut();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-white font-semibold text-sm">Settings</h2>
      </div>

      {/* Settings list */}
      <motion.div
        className="flex-1 overflow-y-auto px-5 pb-5 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Auto-start */}
        <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Launch at startup</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Automatically start when you log in
              </p>
            </div>
            <button
              onClick={handleAutoStartToggle}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                autoStart ? "bg-purple-600" : "bg-gray-700"
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                animate={{ left: autoStart ? 18 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        {/* Config path */}
        <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800/50">
          <p className="text-white text-sm font-medium">Config location</p>
          <p className="text-gray-500 text-xs mt-1 font-mono break-all">
            {configPath || "~/.teach-charlie/config.json"}
          </p>
        </div>

        {/* Version */}
        <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Version</p>
              <p className="text-gray-500 text-xs mt-0.5">0.1.0</p>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors text-left"
        >
          Sign out
        </button>
      </motion.div>
    </div>
  );
}
