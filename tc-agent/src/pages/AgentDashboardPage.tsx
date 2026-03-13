import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAgent } from "../hooks/useAgent";
import { useOpenClaw } from "../hooks/useOpenClaw";
import { AgentCard } from "../components/AgentCard";
import { SkillsList } from "../components/SkillsList";
import { OpenClawStatus } from "../components/OpenClawStatus";

interface AgentDashboardPageProps {
  onSettings: () => void;
}

export function AgentDashboardPage({ onSettings }: AgentDashboardPageProps) {
  const { data, loading, error: agentError, refresh } = useAgent();
  const {
    version,
    daemonRunning,
    checkInstalled,
    checkDaemonStatus,
    startDaemon,
    stopDaemon,
    error: openclawError,
  } = useOpenClaw();

  // Check OpenClaw status on mount
  useEffect(() => {
    checkInstalled();
    checkDaemonStatus();
  }, [checkInstalled, checkDaemonStatus]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <motion.div
          className="flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  // Error state
  if (agentError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950 px-6">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{agentError}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="text-white font-semibold text-sm">
            Hi, {data?.user?.first_name || "there"}
          </h2>
          <p className="text-gray-500 text-xs">Your agent is ready</p>
        </div>
        <div className="flex items-center gap-2">
          <OpenClawStatus running={daemonRunning} error={openclawError} />
          <button
            onClick={refresh}
            className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
            title="Refresh agent data"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={onSettings}
            className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
        {/* Agent card */}
        {data?.published_agent ? (
          <AgentCard
            name={data.published_agent.name}
            description={data.published_agent.description}
            avatarUrl={data.published_agent.avatar_url}
            isPublished={data.published_agent.is_published}
          />
        ) : (
          <motion.div
            className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-sm">No published agent</p>
            <p className="text-gray-600 text-xs mt-1">
              Publish an agent on teachcharlie.ai to see it here
            </p>
          </motion.div>
        )}

        {/* Workflows (skills) */}
        {data && <SkillsList skills={data.skills} />}

        {/* OpenClaw Status section */}
        <div className="space-y-2">
          <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-1">
            OpenClaw Agent
          </h4>
          <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800/50 space-y-3">
            {/* Daemon status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    daemonRunning ? "bg-emerald-400" : "bg-gray-600"
                  }`}
                />
                <span className="text-white text-sm">
                  {daemonRunning ? "Agent Running" : "Agent Stopped"}
                </span>
              </div>
              <div className="flex gap-2">
                {daemonRunning ? (
                  <button
                    onClick={stopDaemon}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={startDaemon}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs hover:bg-purple-700 transition-colors"
                  >
                    Start
                  </button>
                )}
              </div>
            </div>

            {/* Version */}
            {version && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Version</span>
                <span className="text-gray-400 font-mono">{version}</span>
              </div>
            )}

            {/* Config location */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Config</span>
              <span className="text-gray-400 font-mono text-[11px]">
                ~/.openclaw/openclaw.json
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
