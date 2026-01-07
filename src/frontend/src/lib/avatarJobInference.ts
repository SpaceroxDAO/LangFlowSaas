/**
 * Avatar Job Inference
 * Automatically determines the best job type for avatar generation
 * based on agent name and description using keyword matching.
 *
 * When no match is found, returns 'default' - the backend will then:
 * - If description is provided: use description-based prompt with constrained accessories
 * - If no description: return the base image directly (no API call)
 */

// Job keywords mapping - each job has associated keywords to match against
// These should match the JOB_ACCESSORIES keys in the backend
const JOB_KEYWORDS: Record<string, string[]> = {
  // Core business roles
  support: [
    'support', 'customer', 'help desk', 'helpdesk', 'service', 'assist',
    'ticket', 'complaint', 'inquiry', 'chat support', 'call center'
  ],
  developer: [
    'developer', 'engineer', 'programming', 'coder', 'software', 'code',
    'technical', 'backend', 'frontend', 'fullstack', 'devops', 'api',
    'debug', 'coding', 'development'
  ],
  data: [
    'data', 'analyst', 'analytics', 'statistics', 'metrics', 'dashboard',
    'bi', 'business intelligence', 'reporting', 'insights', 'database'
  ],
  manager: [
    'manager', 'lead', 'director', 'supervisor', 'executive', 'management',
    'team lead', 'project manager', 'pm', 'coordinator', 'head of'
  ],
  sales: [
    'sales', 'selling', 'revenue', 'deals', 'closing', 'prospects',
    'leads', 'pipeline', 'commission', 'quota', 'account executive'
  ],
  security: [
    'security', 'cybersecurity', 'infosec', 'penetration', 'vulnerability',
    'firewall', 'encryption', 'compliance', 'audit', 'risk', 'threat'
  ],
  designer: [
    'designer', 'design', 'ui', 'ux', 'creative', 'graphic', 'visual',
    'artwork', 'illustration', 'branding', 'mockup', 'figma', 'sketch'
  ],
  product: [
    'product', 'roadmap', 'feature', 'backlog', 'sprint', 'agile',
    'scrum', 'user story', 'requirements', 'prioritization'
  ],
  marketing: [
    'marketing', 'campaign', 'advertising', 'brand', 'social media',
    'content', 'seo', 'growth', 'acquisition', 'engagement', 'promotion'
  ],
  finance: [
    'finance', 'financial', 'accounting', 'budget', 'investment',
    'banking', 'trading', 'portfolio', 'tax', 'bookkeeping', 'money'
  ],
  legal: [
    'legal', 'lawyer', 'attorney', 'law', 'contract', 'compliance',
    'regulation', 'litigation', 'patent', 'trademark', 'counsel'
  ],
  hr: [
    'hr', 'human resources', 'recruiting', 'hiring', 'onboarding',
    'employee', 'talent', 'benefits', 'payroll', 'personnel'
  ],
  ops: [
    'operations', 'ops', 'logistics', 'supply chain', 'procurement',
    'inventory', 'warehouse', 'shipping', 'fulfillment', 'efficiency'
  ],
  qa: [
    'qa', 'quality', 'testing', 'test', 'automation', 'bug',
    'defect', 'regression', 'validation', 'verification'
  ],
  research: [
    'research', 'researcher', 'study', 'analysis',
    'experiment', 'lab', 'academic', 'publication', 'hypothesis'
  ],

  // Professional services
  doctor: [
    'doctor', 'medical', 'health', 'healthcare', 'patient', 'clinical',
    'diagnosis', 'treatment', 'hospital', 'medicine', 'physician',
    'therapy', 'wellness'
  ],
  nurse: [
    'nurse', 'nursing', 'rn', 'caregiver', 'care'
  ],
  teacher: [
    'teacher', 'education', 'instructor', 'professor', 'learning',
    'student', 'curriculum', 'lesson', 'school', 'class', 'teaching', 'educational'
  ],
  tutor: [
    'tutor', 'tutoring', 'homework', 'study buddy'
  ],
  coach: [
    'coach', 'coaching', 'sports', 'fitness', 'athletic'
  ],
  trainer: [
    'trainer', 'personal trainer', 'gym', 'workout', 'exercise'
  ],
  therapist: [
    'therapist', 'mental health', 'counselor', 'counseling', 'psychology',
    'psychologist', 'psychiatrist', 'emotional', 'anxiety', 'depression'
  ],
  pilot: [
    'pilot', 'aviation', 'flight', 'aircraft', 'airline', 'cockpit',
    'navigation', 'travel', 'airport', 'aerospace'
  ],
  chef: [
    'chef', 'cook', 'cooking', 'food', 'recipe', 'kitchen', 'restaurant',
    'culinary', 'meal', 'cuisine', 'baking', 'nutrition', 'dining'
  ],
  artist: [
    'artist', 'art', 'painting', 'sculpture', 'gallery', 'creative arts'
  ],
  writer: [
    'writer', 'author', 'writing', 'copywriter', 'blogger', 'journalist',
    'editor', 'content creator', 'storyteller', 'poet'
  ],
  musician: [
    'musician', 'music', 'singer', 'composer', 'band', 'orchestra',
    'instrument', 'song', 'melody'
  ],

  // Additional roles
  scientist: [
    'scientist', 'science', 'laboratory', 'chemistry', 'physics', 'biology'
  ],
  gardener: [
    'gardener', 'gardening', 'plants', 'garden', 'landscaping', 'flowers',
    'horticulture', 'botanical', 'outdoor'
  ],
  athlete: [
    'athlete', 'sports', 'player', 'competition', 'team', 'game'
  ],
  photographer: [
    'photographer', 'photography', 'photo', 'camera', 'portrait', 'studio'
  ],
  engineer: [
    'engineer', 'engineering', 'mechanical', 'electrical', 'civil', 'structural'
  ],
  accountant: [
    'accountant', 'cpa', 'taxes', 'bookkeeper'
  ],
  consultant: [
    'consultant', 'consulting', 'advisor', 'advisory', 'strategy'
  ],
  assistant: [
    'assistant', 'helper', 'aide', 'secretary', 'admin'
  ],
  receptionist: [
    'receptionist', 'front desk', 'greeter', 'welcome'
  ],
  guide: [
    'guide', 'tour', 'travel guide', 'navigator', 'concierge'
  ],
  bot: [
    'bot', 'chatbot', 'ai assistant', 'virtual assistant', 'automation'
  ],
  agent: [
    'agent', 'representative', 'rep'
  ],
}

/**
 * Infer the best job type from agent name and description
 * @param name - The agent's name
 * @param description - The agent's description/persona
 * @returns The inferred job type (or 'default' if no match)
 */
export function inferJobFromDescription(name: string, description: string): string {
  // Combine name and description, lowercase for matching
  const text = `${name} ${description}`.toLowerCase()

  // Score each job based on keyword matches
  const scores: Record<string, number> = {}

  for (const [job, keywords] of Object.entries(JOB_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      // Check for exact word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      const matches = text.match(regex)
      if (matches) {
        // Weight longer keywords higher (more specific)
        score += matches.length * (keyword.length > 5 ? 2 : 1)
      }
    }
    if (score > 0) {
      scores[job] = score
    }
  }

  // Find the job with the highest score
  let bestJob = 'default'
  let bestScore = 0

  for (const [job, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      bestJob = job
    }
  }

  return bestJob
}
