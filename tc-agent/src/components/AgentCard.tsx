import { motion } from "framer-motion";

interface AgentCardProps {
  name: string;
  description?: string | null;
  avatarUrl?: string | null;
  isPublished: boolean;
}

export function AgentCard({
  name,
  description,
  avatarUrl,
  isPublished,
}: AgentCardProps) {
  return (
    <motion.div
      className="relative flex items-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-purple-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-purple-600/20 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">🐕</span>
          )}
        </div>
        {isPublished && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-gray-950 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
          >
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm truncate">{name}</h3>
        {description && (
          <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
