import { motion } from "framer-motion";

interface OpenClawStatusProps {
  running: boolean;
  error?: string | null;
}

export function OpenClawStatus({ running, error }: OpenClawStatusProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-xs text-red-400">Error</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
        running
          ? "bg-emerald-500/10 border-emerald-500/20"
          : "bg-gray-500/10 border-gray-500/20"
      }`}
    >
      <motion.div
        className={`w-2 h-2 rounded-full ${
          running ? "bg-emerald-400" : "bg-gray-500"
        }`}
        animate={running ? { scale: [1, 1.3, 1] } : {}}
        transition={running ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
      />
      <span className={`text-xs ${running ? "text-emerald-400" : "text-gray-500"}`}>
        {running ? "Agent Running" : "Agent Stopped"}
      </span>
    </div>
  );
}
