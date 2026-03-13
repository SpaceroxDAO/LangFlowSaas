import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useAgent } from "../hooks/useAgent";
import { useOpenClaw } from "../hooks/useOpenClaw";
import { AgentComingAlive } from "../components/AgentComingAlive";
import type { BootstrapData } from "../lib/api";

interface SetupPageProps {
  onComplete: () => void;
  onSettings: () => void;
  initialBootstrapData?: BootstrapData | null;
}

type SetupStep = 1 | 2 | 3;

export function SetupPage({ onComplete, onSettings, initialBootstrapData }: SetupPageProps) {
  const [step, setStep] = useState<SetupStep>(1);
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    installed,
    checkInstalled,
    install,
    installing,
    installProgress,
    writeConfig,
    startDaemon,
    error: openclawError,
  } = useOpenClaw();

  const { data: fetchedData, loading: agentLoading, error: agentError, refresh } = useAgent();

  // Use initial bootstrap data if provided (from activation), otherwise use polled data
  const data = initialBootstrapData || fetchedData;

  // Step 1: Check if OpenClaw is already installed
  useEffect(() => {
    checkInstalled();
  }, [checkInstalled]);

  // Auto-advance past step 1 if already installed
  useEffect(() => {
    if (installed === true && step === 1) {
      setStep(2);
    }
  }, [installed, step]);

  // Step 2: Auto-write config when bootstrap data arrives
  useEffect(() => {
    if (step !== 2 || !data) return;

    writeConfig(data)
      .then(() => setStep(3))
      .catch(() => {});
  }, [step, data, writeConfig]);

  const handleInstall = useCallback(async () => {
    try {
      await install();
      setStep(2);
    } catch {
      // error state handled by hook
    }
  }, [install]);

  const handleStartDaemon = useCallback(async () => {
    if (!data?.published_agent) return;

    setShowAnimation(true);
  }, [data]);

  const handleAnimationComplete = useCallback(async () => {
    setShowAnimation(false);
    try {
      await startDaemon();
    } catch {
      // Will show on dashboard
    }
    onComplete();
  }, [startDaemon, onComplete]);

  // Show the AgentComingAlive animation
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

  const error = openclawError || agentError;

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="text-white font-semibold text-sm">Setup</h2>
          <p className="text-gray-500 text-xs">Get your agent running</p>
        </div>
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

      {/* Progress indicator */}
      <div className="flex items-center gap-2 px-5 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                s < step
                  ? "bg-purple-500 text-white"
                  : s === step
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                    : "bg-gray-800 text-gray-600"
              }`}
            >
              {s < step ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                s
              )}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-px ${s < step ? "bg-purple-500/50" : "bg-gray-800"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="text-center pt-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 mx-auto mb-4">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="text-white text-lg font-semibold">Install OpenClaw</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
                  OpenClaw runs your AI agent locally. We'll install it for you — just one click.
                </p>
              </div>

              {installed === null ? (
                <div className="flex justify-center">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-purple-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleInstall}
                    disabled={installing}
                    className="w-full px-6 py-3.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {installing ? "Installing..." : "Install OpenClaw"}
                  </button>

                  {installing && installProgress && (
                    <div className="space-y-2">
                      <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <motion.div
                          className="h-full bg-purple-500 rounded-full"
                          initial={{ width: "5%" }}
                          animate={{
                            width:
                              installProgress === "starting"
                                ? "20%"
                                : installProgress === "installing"
                                  ? "60%"
                                  : installProgress === "retrying with user prefix"
                                    ? "70%"
                                    : installProgress === "complete"
                                      ? "100%"
                                      : "50%",
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-gray-500 text-xs text-center capitalize">
                        {installProgress}...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="text-center pt-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 mx-auto mb-4">
                  <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-white text-lg font-semibold">Connect Your Agent</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
                  Fetching your agent data and writing the config file...
                </p>
              </div>

              {agentLoading && !data ? (
                <div className="flex justify-center">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-purple-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              ) : data?.published_agent ? (
                <motion.div
                  className="relative flex items-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-purple-500/20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-purple-600/20 flex items-center justify-center shrink-0">
                    {data.published_agent.avatar_url ? (
                      <img
                        src={data.published_agent.avatar_url}
                        alt={data.published_agent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🐕</span>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {data.published_agent.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {data.skills.length} skill{data.skills.length !== 1 ? "s" : ""} connected
                    </p>
                  </div>
                  <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 text-sm">No published agent found</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Publish an agent on teachcharlie.ai first
                  </p>
                  <button
                    onClick={refresh}
                    className="mt-3 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
                >
                  &larr; Back
                </button>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="text-center pt-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-white text-lg font-semibold">Start Your Agent</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
                  Everything's configured. Launch the OpenClaw daemon to bring your agent to
                  life!
                </p>
              </div>

              <button
                onClick={handleStartDaemon}
                className="w-full px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                Start Agent
              </button>

              <button
                onClick={() => setStep(2)}
                className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
              >
                &larr; Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error display */}
        {error && (
          <motion.div
            className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-400 text-xs">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
