import { useReducer, useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/providers/DevModeProvider'
import { api } from '@/lib/api'
import { WizardLayout } from '@/components/WizardLayout'
import { ToolCard } from '@/components/ToolCard'
import { IdentityIcon, CoachingIcon, TricksIcon } from '@/components/icons'
import { useTour, useShouldShowTour } from '@/providers/TourProvider'
import { startStep1Tour, startStep2Tour, startStep3Tour } from '@/tours'
import { inferJobFromDescription } from '@/lib/avatarJobInference'
import { KnowledgeSourcesModal } from '@/components/KnowledgeSourcesModal'
import {
  Headphones,
  FileText,
  TrendingUp,
  Code,
  PenTool,
  BarChart,
  Calendar,
  Search,
  Bot,
  Star,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// Icon mapping for presets
const presetIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Headphones,
  FileText,
  TrendingUp,
  Code,
  PenTool,
  BarChart,
  Calendar,
  Search,
  Bot,
  Star,
}

// Gradient mapping for preset cards
const gradientMap: Record<string, string> = {
  'blue-cyan': 'from-blue-500 to-cyan-500',
  'orange-red': 'from-orange-500 to-red-500',
  'green-teal': 'from-green-500 to-teal-500',
  'slate-gray': 'from-slate-500 to-gray-600',
  'pink-rose': 'from-pink-500 to-rose-500',
  'purple-indigo': 'from-purple-500 to-indigo-500',
  'amber-orange': 'from-amber-500 to-orange-500',
  'cyan-blue': 'from-cyan-500 to-blue-500',
  'purple-pink': 'from-purple-500 to-pink-500',
}

// Featured preset type
interface FeaturedPreset {
  id: string
  name: string
  description: string | null
  icon: string
  gradient: string
  category: string
  who?: string
  rules?: string | null
  tools?: string[] | null
}

// Available tools for Step 3
const AVAILABLE_TOOLS = [
  {
    id: 'web_search',
    title: 'Web Search',
    description: 'Search the internet for current information, news, and facts.',
    available: true,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'Perform math calculations and arithmetic operations.',
    available: true,
  },
  {
    id: 'weather',
    title: 'Get Weather',
    description: 'Get current weather conditions for any location worldwide.',
    available: true,
  },
  {
    id: 'knowledge_search',
    title: 'Knowledge Search',
    description: 'Search your uploaded documents and files.',
    available: true,
    opensModal: true,
  },
]

// Types
interface FormData {
  name: string
  who: string
  rules: string
  tools: string[]
  knowledgeSourceIds: string[]
  avatarUrl: string | null
}

interface WizardState {
  currentStep: number
  formData: FormData
  errors: Partial<Record<string, string>>
  isSubmitting: boolean
  isGeneratingAvatar: boolean
  submitError: string | null
}

type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; field: keyof FormData; value: string | string[] | null }
  | { type: 'TOGGLE_TOOL'; toolId: string }
  | { type: 'SET_KNOWLEDGE_SOURCES'; sourceIds: string[] }
  | { type: 'SET_ERROR'; field: string; message: string }
  | { type: 'CLEAR_ERROR'; field: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; message: string }
  | { type: 'AVATAR_GENERATE_START' }
  | { type: 'AVATAR_GENERATE_SUCCESS'; avatarUrl: string }
  | { type: 'AVATAR_GENERATE_ERROR'; message: string }
  | { type: 'LOAD_PRESET'; preset: { name: string; who: string; rules: string | null; tools: string[] | null } }

// Default values for first-time users (Charlie the dog example)
const DEFAULT_AGENT_NAME = 'Charlie'
const DEFAULT_AGENT_WHO = `A friendly Golden Retriever who works as a customer support specialist. Charlie is helpful, patient, and always eager to solve problems. He has a warm personality and loves making customers happy.`
const DEFAULT_AGENT_RULES = `You are Charlie, a friendly and enthusiastic Golden Retriever working in customer support.

PERSONALITY:
- Always be warm, helpful, and patient
- Use a friendly, conversational tone
- Show genuine enthusiasm for helping people
- Occasionally mention treats, walks, or belly rubs to stay in character

GUIDELINES:
- Answer questions clearly and completely
- If you don't know something, be honest and offer to help find the answer
- Keep responses concise but thorough
- End interactions on a positive note

THINGS TO AVOID:
- Never be rude or dismissive
- Don't make up information you're not sure about
- Avoid overly technical jargon unless the user asks for it`

// Reducer
const initialState: WizardState = {
  currentStep: 1,
  formData: {
    name: DEFAULT_AGENT_NAME,
    who: DEFAULT_AGENT_WHO,
    rules: DEFAULT_AGENT_RULES,
    tools: [],
    knowledgeSourceIds: [],
    avatarUrl: null,
  },
  errors: {},
  isSubmitting: false,
  isGeneratingAvatar: false,
  submitError: null,
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 3) }
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) }
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      }
    case 'TOGGLE_TOOL': {
      // Knowledge search tool is handled specially via modal
      if (action.toolId === 'knowledge_search') {
        // Toggle is handled by modal, just toggle the tool in list
        const tools = state.formData.tools.includes(action.toolId)
          ? state.formData.tools.filter((t) => t !== action.toolId)
          : [...state.formData.tools, action.toolId]
        // If removing knowledge_search, also clear the knowledge sources
        const knowledgeSourceIds = tools.includes('knowledge_search')
          ? state.formData.knowledgeSourceIds
          : []
        return {
          ...state,
          formData: { ...state.formData, tools, knowledgeSourceIds },
        }
      }
      const tools = state.formData.tools.includes(action.toolId)
        ? state.formData.tools.filter((t) => t !== action.toolId)
        : [...state.formData.tools, action.toolId]
      return {
        ...state,
        formData: { ...state.formData, tools },
      }
    }
    case 'SET_KNOWLEDGE_SOURCES': {
      // When knowledge sources are selected, ensure knowledge_search tool is enabled
      const tools = action.sourceIds.length > 0 && !state.formData.tools.includes('knowledge_search')
        ? [...state.formData.tools, 'knowledge_search']
        : action.sourceIds.length === 0
          ? state.formData.tools.filter(t => t !== 'knowledge_search')
          : state.formData.tools
      return {
        ...state,
        formData: {
          ...state.formData,
          tools,
          knowledgeSourceIds: action.sourceIds,
        },
      }
    }
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.message } }
    case 'CLEAR_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: undefined } }
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, submitError: null }
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, submitError: null }
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, submitError: action.message }
    case 'AVATAR_GENERATE_START':
      return { ...state, isGeneratingAvatar: true }
    case 'AVATAR_GENERATE_SUCCESS':
      return {
        ...state,
        isGeneratingAvatar: false,
        formData: { ...state.formData, avatarUrl: action.avatarUrl },
      }
    case 'AVATAR_GENERATE_ERROR':
      return { ...state, isGeneratingAvatar: false, submitError: action.message }
    case 'LOAD_PRESET':
      return {
        ...state,
        formData: {
          ...state.formData,
          name: action.preset.name,
          who: action.preset.who,
          rules: action.preset.rules || '',
          tools: action.preset.tools || [],
        },
        errors: {},
      }
    default:
      return state
  }
}

export function CreateAgentPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')
  const { getToken } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { currentStep, formData, errors, isSubmitting, isGeneratingAvatar, submitError } = state
  const { completeTour } = useTour()
  const shouldShowStep1Tour = useShouldShowTour('create-step-1')
  const shouldShowStep2Tour = useShouldShowTour('create-step-2')
  const shouldShowStep3Tour = useShouldShowTour('create-step-3')
  const [step1TourStarted, setStep1TourStarted] = useState(false)
  const [step2TourStarted, setStep2TourStarted] = useState(false)
  const [step3TourStarted, setStep3TourStarted] = useState(false)
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false)
  const [presets, setPresets] = useState<FeaturedPreset[]>([])
  const [presetsLoading, setPresetsLoading] = useState(true)
  const [presetsExpanded, setPresetsExpanded] = useState(true)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Fetch featured presets on mount
  useEffect(() => {
    async function fetchPresets() {
      try {
        const response = await api.listAgentPresets(undefined, true)
        // Get full preset data including who, rules, tools
        setPresets(response.presets as FeaturedPreset[])
      } catch (err) {
        console.error('Failed to load presets:', err)
      } finally {
        setPresetsLoading(false)
      }
    }
    fetchPresets()
  }, [])

  // Start tour for first-time users on each step
  useEffect(() => {
    // Step 1 tour
    if (shouldShowStep1Tour && currentStep === 1 && !step1TourStarted) {
      const timer = setTimeout(() => {
        setStep1TourStarted(true)
        startStep1Tour(() => {
          completeTour('create-step-1')
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [shouldShowStep1Tour, currentStep, step1TourStarted, completeTour])

  useEffect(() => {
    // Step 2 tour
    if (shouldShowStep2Tour && currentStep === 2 && !step2TourStarted) {
      const timer = setTimeout(() => {
        setStep2TourStarted(true)
        startStep2Tour(() => {
          completeTour('create-step-2')
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [shouldShowStep2Tour, currentStep, step2TourStarted, completeTour])

  useEffect(() => {
    // Step 3 tour
    if (shouldShowStep3Tour && currentStep === 3 && !step3TourStarted) {
      const timer = setTimeout(() => {
        setStep3TourStarted(true)
        startStep3Tour(() => {
          completeTour('create-step-3')
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [shouldShowStep3Tour, currentStep, step3TourStarted, completeTour])

  // Manual tour triggers for each step
  const handleStartStep1Tour = useCallback(() => {
    startStep1Tour(() => {
      completeTour('create-step-1')
    })
  }, [completeTour])

  const handleStartStep2Tour = useCallback(() => {
    startStep2Tour(() => {
      completeTour('create-step-2')
    })
  }, [completeTour])

  const handleStartStep3Tour = useCallback(() => {
    startStep3Tour(() => {
      completeTour('create-step-3')
    })
  }, [completeTour])

  // Generate avatar using GPT Image Edit (auto-infer job from name + description)
  const handleGenerateAvatar = useCallback(async () => {
    // Require at least name or description to generate
    if (!formData.name.trim() && !formData.who.trim()) {
      dispatch({ type: 'AVATAR_GENERATE_ERROR', message: 'Please enter a name or description first' })
      return
    }

    dispatch({ type: 'AVATAR_GENERATE_START' })

    try {
      // Infer job type from name and description
      const inferredJob = inferJobFromDescription(formData.name, formData.who)
      // Combine name + description for fallback context
      const fullDescription = `${formData.name} - ${formData.who}`.trim()

      const result = await api.generateDogAvatar(inferredJob, {
        regenerate: !!formData.avatarUrl,
        description: fullDescription,  // Pass for fallback when job is "default"
      })
      // Convert relative URL to full URL for the backend
      const fullUrl = `${window.location.protocol}//${window.location.hostname}:8000${result.image_url}`
      dispatch({ type: 'AVATAR_GENERATE_SUCCESS', avatarUrl: fullUrl })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate avatar. Please try again.'
      dispatch({ type: 'AVATAR_GENERATE_ERROR', message: errorMessage })
    }
  }, [formData.name, formData.who, formData.avatarUrl])

  // Validation for Step 1
  const validateStep1 = useCallback(() => {
    let hasError = false
    if (!formData.name.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'name', message: 'Please give your agent a name' })
      hasError = true
    }
    if (!formData.who.trim() || formData.who.trim().length < 10) {
      dispatch({ type: 'SET_ERROR', field: 'who', message: 'Please provide a job description (at least 10 characters)' })
      hasError = true
    }
    return !hasError
  }, [formData.name, formData.who])

  // Validation for Step 2
  const validateStep2 = useCallback(() => {
    if (!formData.rules.trim() || formData.rules.trim().length < 10) {
      dispatch({ type: 'SET_ERROR', field: 'rules', message: 'Please provide instructions (at least 10 characters)' })
      return false
    }
    return true
  }, [formData.rules])

  const handleNext = useCallback(() => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    dispatch({ type: 'NEXT_STEP' })
  }, [currentStep, validateStep1, validateStep2])

  const handleBack = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  // Handle preset selection
  const handleSelectPreset = useCallback((preset: FeaturedPreset) => {
    setSelectedPresetId(preset.id)
    dispatch({
      type: 'LOAD_PRESET',
      preset: {
        name: preset.name,
        who: preset.who || '',
        rules: preset.rules ?? null,
        tools: preset.tools ?? null,
      },
    })
    // Collapse the preset section after selection
    setPresetsExpanded(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    dispatch({ type: 'SUBMIT_START' })

    try {
      // Step 1: Create AgentComponent (reusable personality) in new table
      const component = await api.createAgentComponentFromQA({
        name: formData.name,
        who: formData.who,
        rules: formData.rules,
        tricks: formData.tools.join(', '), // Convert tools array to string
        selected_tools: formData.tools,
        knowledge_source_ids: formData.knowledgeSourceIds,
        project_id: projectId || undefined,
        avatar_url: formData.avatarUrl || undefined,
      })

      // Step 2: Create Workflow that uses this component
      const workflow = await api.createWorkflowFromAgent({
        agent_component_id: component.id,
        name: `${formData.name}`,
        description: `Workflow for ${formData.name}`,
        project_id: projectId || undefined,
      })

      dispatch({ type: 'SUBMIT_SUCCESS' })
      // Navigate to the new workflow playground with ?new=true to trigger tour
      navigate(`/playground/workflow/${workflow.id}?new=true`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create agent. Please try again.'
      dispatch({ type: 'SUBMIT_ERROR', message: errorMessage })
    }
  }, [formData, navigate, projectId])

  // Button styles by step
  const buttonStyles = {
    1: 'bg-violet-500 hover:bg-violet-600',
    2: 'bg-pink-500 hover:bg-pink-600',
    3: 'bg-violet-500 hover:bg-violet-600',
  }

  return (
    <>
      {/* Step 1: Identity */}
      {currentStep === 1 && (
        <WizardLayout
          step={1}
          totalSteps={3}
          theme="violet"
          title="Step 1: Identity"
          description="Just as you define the breed and temperament of a dog based on the work it needs to do, you must define your agent's identity. We are taking a blank slate and giving it a name and a job description to differentiate it from a generic model."
          icon={<IdentityIcon size={32} color="white" />}
        >
          <div className="space-y-6">
            {/* Preset Selection Section */}
            {!presetsLoading && presets.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPresetsExpanded(!presetsExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-500" />
                    <span className="font-medium text-gray-900">Start from a template</span>
                    <span className="text-sm text-gray-500">(optional)</span>
                  </div>
                  {presetsExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {presetsExpanded && (
                  <div className="p-4 bg-white">
                    <p className="text-sm text-gray-600 mb-4">
                      Choose a template to pre-fill the form, or start from scratch below.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {presets.map((preset) => {
                        const IconComponent = presetIconMap[preset.icon] || Bot
                        const gradientClass = gradientMap[preset.gradient] || 'from-violet-500 to-purple-500'
                        const isSelected = selectedPresetId === preset.id

                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`relative flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-200'
                                : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-sm truncate">
                                {preset.name}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-2">
                                {preset.description}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    {selectedPresetId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(null)
                          dispatch({
                            type: 'LOAD_PRESET',
                            preset: {
                              name: DEFAULT_AGENT_NAME,
                              who: DEFAULT_AGENT_WHO,
                              rules: DEFAULT_AGENT_RULES,
                              tools: [],
                            },
                          })
                        }}
                        className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Clear selection and start from scratch
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
                placeholder="Charlie"
                data-tour="agent-name"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Job Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description (Persona)
              </label>
              <textarea
                value={formData.who}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'who', value: e.target.value })}
                placeholder="A friendly Golden Retriever who is an expert in dog treats, bones, and finding the best parks."
                rows={4}
                data-tour="agent-job"
                className={`w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.who ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.who && <p className="mt-1 text-sm text-red-600">{errors.who}</p>}
            </div>

            {/* Generate Appearance */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-violet-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Agent avatar"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <svg className="w-10 h-10 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">Generate Appearance</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Generate a unique avatar based on your agent's name and role.
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateAvatar}
                    disabled={isGeneratingAvatar}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                      isGeneratingAvatar
                        ? 'text-violet-400 bg-violet-50 cursor-not-allowed'
                        : 'text-violet-600 bg-violet-50 hover:bg-violet-100 cursor-pointer border border-violet-200'
                    }`}
                  >
                    {isGeneratingAvatar ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        {formData.avatarUrl ? 'Regenerate' : 'Generate'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button
                onClick={handleStartStep1Tour}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                title="Take a guided tour"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </button>
              <button
                onClick={handleNext}
                className={`px-6 py-3 text-white rounded-xl font-medium transition-colors flex items-center gap-2 ${buttonStyles[1]}`}
              >
                Next Step
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </WizardLayout>
      )}

      {/* Step 2: Coaching */}
      {currentStep === 2 && (
        <WizardLayout
          step={2}
          totalSteps={3}
          theme="pink"
          title="Step 2: Coaching"
          description="Forget complex coding. Think of this as coaching. You are simply writing a set of instructions for your agent to follow, just like an employee handbook. If the agent makes a mistake, you don't rewrite code—you simply adjust your coaching instructions in plain English."
          icon={<CoachingIcon size={32} color="white" />}
        >
          <div className="space-y-6">
            {/* Instructions Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions (The Training Rules)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Write down a set of instructions for it to follow, just like you would train a new employee or a family dog.
              </p>
              <textarea
                value={formData.rules}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'rules', value: e.target.value })}
                placeholder={`You are Charlie, a happy and excited dog. You love humans! Always be helpful, but try to mention treats or going for a walk in your responses. If asked a hard question, answer it simply like a smart dog would. End some sentences with "Woof!"`}
                rows={8}
                data-tour="agent-rules"
                className={`w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.rules ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.rules && <p className="mt-1 text-sm text-red-600">{errors.rules}</p>}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleStartStep2Tour}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                  title="Take a guided tour"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help
                </button>
              </div>
              <button
                onClick={handleNext}
                className={`px-6 py-3 text-white rounded-xl font-medium transition-colors flex items-center gap-2 ${buttonStyles[2]}`}
              >
                Next Step
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </WizardLayout>
      )}

      {/* Step 3: Actions */}
      {currentStep === 3 && (
        <WizardLayout
          step={3}
          totalSteps={3}
          theme="orange"
          title="Step 3: Actions"
          description={`Finally, what actions does your agent need to perform? Does it need to search the web? Check the weather? Give your agent the actions required to execute its tasks.`}
          icon={<TricksIcon size={32} color="white" />}
        >
          <div className="space-y-6">
            {/* Action Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-tour="agent-actions">
              {AVAILABLE_TOOLS.map((tool) => (
                <div
                  key={tool.id}
                  data-tour={
                    tool.id === 'web_search' ? 'tool-web-search' :
                    tool.id === 'knowledge_search' ? 'tool-knowledge-search' :
                    undefined
                  }
                >
                  <ToolCard
                    title={tool.title}
                    description={
                      tool.id === 'knowledge_search' && formData.knowledgeSourceIds.length > 0
                        ? `${formData.knowledgeSourceIds.length} source${formData.knowledgeSourceIds.length !== 1 ? 's' : ''} selected`
                        : tool.description
                    }
                    selected={formData.tools.includes(tool.id)}
                    onToggle={() => {
                      if (tool.id === 'knowledge_search') {
                        setIsKnowledgeModalOpen(true)
                      } else {
                        dispatch({ type: 'TOGGLE_TOOL', toolId: tool.id })
                      }
                    }}
                    requiresApiKey={tool.requiresApiKey}
                    apiKeyUrl={tool.apiKeyUrl}
                  />
                </div>
              ))}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleStartStep3Tour}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                  title="Take a guided tour"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                data-tour="create-button"
                className={`px-6 py-3 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 ${buttonStyles[3]}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    Finish & Create Agent
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </WizardLayout>
      )}

      {/* Knowledge Sources Modal */}
      <KnowledgeSourcesModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        selectedSourceIds={formData.knowledgeSourceIds}
        onSelectionChange={(sourceIds) => dispatch({ type: 'SET_KNOWLEDGE_SOURCES', sourceIds })}
        projectId={projectId || undefined}
      />
    </>
  )
}
