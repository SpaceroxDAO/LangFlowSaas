import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface AgentComingAliveProps {
  agentName: string;
  avatarUrl?: string | null;
  skills: string[];
  onComplete: () => void;
}

const steps = [
  { label: "Connecting to Teach Charlie", icon: "link" },
  { label: "Loading agent", icon: "agent" },
  { label: "Activating skills", icon: "skills" },
  { label: "Starting MCP bridge", icon: "bridge" },
];

export function AgentComingAlive({
  agentName,
  avatarUrl,
  skills,
  onComplete,
}: AgentComingAliveProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Step through the animation sequence
    const timers = [
      setTimeout(() => setCurrentStep(0), 300),
      setTimeout(() => setCurrentStep(1), 800),
      setTimeout(() => setCurrentStep(2), 1300),
      setTimeout(() => setCurrentStep(3), 1800),
      setTimeout(() => setShowAvatar(true), 2200),
      setTimeout(() => setShowSkills(true), 2600),
      setTimeout(() => setShowConfetti(true), 3000),
      setTimeout(() => onComplete(), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      {/* Logo pulse */}
      <motion.div
        className="mb-8"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <span className="text-3xl">🐕</span>
        </div>
      </motion.div>

      {/* Steps */}
      <div className="space-y-3 mb-8 w-full max-w-xs">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={
              currentStep >= i
                ? { opacity: 1, x: 0 }
                : { opacity: 0.3, x: -20 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                currentStep >= i
                  ? "bg-purple-500 text-white"
                  : "bg-gray-800 text-gray-600"
              }`}
              animate={currentStep >= i ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {currentStep >= i ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              )}
            </motion.div>
            <span
              className={`text-sm ${
                currentStep >= i ? "text-white" : "text-gray-600"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Avatar reveal */}
      <AnimatePresence>
        {showAvatar && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-purple-600/20 flex items-center justify-center shadow-xl shadow-purple-500/20">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={agentName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🐕</span>
              )}
            </div>
            <p className="text-center text-white font-semibold mt-2">
              {agentName}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills float in */}
      <AnimatePresence>
        {showSkills && (
          <motion.div
            className="flex flex-wrap gap-2 justify-center max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {skills.map((skill, i) => (
              <motion.span
                key={skill}
                className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti particles */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: "40%",
                  backgroundColor: [
                    "#7C3AED",
                    "#A78BFA",
                    "#F59E0B",
                    "#10B981",
                    "#EC4899",
                  ][i % 5],
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
