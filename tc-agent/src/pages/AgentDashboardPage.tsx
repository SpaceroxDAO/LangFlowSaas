import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAgent } from "../hooks/useAgent";
import { useSidecar } from "../hooks/useSidecar";
import { useMCPToken } from "../hooks/useMCPToken";
import { AgentCard } from "../components/AgentCard";
import { SkillsList } from "../components/SkillsList";
import { MCPStatus } from "../components/MCPStatus";
import { AgentComingAlive } from "../components/AgentComingAlive";

interface AgentDashboardPageProps {
  onSettings: () => void;
}

export function AgentDashboardPage({ onSettings }: AgentDashboardPageProps) {
  const { user } = useUser();
  const { data, loading, error: agentError, refresh } = useAgent();
  const { running, start, stop, error: sidecarError } = useSidecar();
  const { saveConfig } = useMCPToken();
  const [showAnimation, setShowAnimation] = useState(false);
  const hasStarted = useRef(false);

  // Auto-start sidecar when bootstrap data arrives
  useEffect(() => {
    if (!data?.mcp_token || hasStarted.current) return;
    hasStarted.current = true;

    // Save config locally
    saveConfig(data.mcp_token).catch(() => {});

    // Show animation and start sidecar
    setShowAnimation(true);
  }, [data, saveConfig]);

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    if (data?.mcp_token) {
      start(data.mcp_token).catch(() => {});
    }
  }, [data, start]);

  // Show coming-alive animation
  if (showAnimation && data?.published_agent) {
    return (
      <AgentComingAlive
        agentName={data.published_agent.name}
        avatarUrl={data.published_agent.avatar_url}
        skills={data.skills.map((s) => s.name)}
        onComplete={handleAnimationComplete}
      />
    );
  }

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
            Hi, {user?.firstName || "there"}
          </h2>
          <p className="text-gray-500 text-xs">Your agent is ready</p>
        </div>
        <div className="flex items-center gap-2">
          <MCPStatus running={running} error={sidecarError} />
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

        {/* Skills */}
        {data && <SkillsList skills={data.skills} />}

        {/* Connection controls */}
        <div className="space-y-2">
          <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-1">
            MCP Bridge
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => data?.mcp_token && start(data.mcp_token)}
              disabled={running || !data?.mcp_token}
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {running ? "Connected" : "Connect"}
            </button>
            <button
              onClick={stop}
              disabled={!running}
              className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
