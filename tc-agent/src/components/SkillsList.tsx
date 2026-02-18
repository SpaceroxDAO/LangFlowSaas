import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface SkillsListProps {
  skills: Skill[];
}

export function SkillsList({ skills }: SkillsListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 text-sm">No skills enabled yet</p>
        <p className="text-gray-600 text-xs mt-1">
          Enable workflow skills on teachcharlie.ai
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-1">
        Active Skills
      </h4>
      {skills.map((skill, index) => (
        <motion.div
          key={skill.id}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-900/30 border border-gray-800/50"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.3 }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              skill.is_active ? "bg-purple-400" : "bg-gray-600"
            }`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{skill.name}</p>
            <p className="text-gray-500 text-xs truncate">{skill.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
