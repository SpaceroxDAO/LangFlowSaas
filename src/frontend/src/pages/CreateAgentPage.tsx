import { useReducer, useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/providers/DevModeProvider'
import { api } from '@/lib/api'
import { WizardLayout } from '@/components/WizardLayout'
import { ToolCard } from '@/components/ToolCard'
import { IdentityIcon, CoachingIcon, TricksIcon } from '@/components/icons'
import { useTour, useShouldShowTour } from '@/providers/TourProvider'
import { startCreateAgentTour } from '@/tours/createAgentTour'

// Available tools for Step 3
const AVAILABLE_TOOLS = [
  {
    id: 'web_search',
    title: 'Web Search',
    description: 'Search the internet for current information using DuckDuckGo.',
    available: true,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'Perform math calculations and arithmetic operations.',
    available: true,
  },
  {
    id: 'url_reader',
    title: 'URL Reader',
    description: 'Fetch and read content from web pages.',
    available: true,
  },
  {
    id: 'google_maps',
    title: 'Google Maps',
    description: 'Search for locations and places (requires SerpAPI key).',
    available: true,
    requiresApiKey: true,
    apiKeyUrl: 'https://serpapi.com/manage-api-key',
  },
]

// Types
interface FormData {
  name: string
  who: string
  rules: string
  tools: string[]
}

interface WizardState {
  currentStep: number
  formData: FormData
  errors: Partial<Record<string, string>>
  isSubmitting: boolean
  submitError: string | null
}

type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; field: keyof FormData; value: string | string[] }
  | { type: 'TOGGLE_TOOL'; toolId: string }
  | { type: 'SET_ERROR'; field: string; message: string }
  | { type: 'CLEAR_ERROR'; field: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; message: string }

// Reducer
const initialState: WizardState = {
  currentStep: 1,
  formData: {
    name: '',
    who: '',
    rules: '',
    tools: [],
  },
  errors: {},
  isSubmitting: false,
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
      const tools = state.formData.tools.includes(action.toolId)
        ? state.formData.tools.filter((t) => t !== action.toolId)
        : [...state.formData.tools, action.toolId]
      return {
        ...state,
        formData: { ...state.formData, tools },
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
  const { currentStep, formData, errors, isSubmitting, submitError } = state
  const { completeTour } = useTour()
  const shouldShowTour = useShouldShowTour('create-agent')
  const [tourStarted, setTourStarted] = useState(false)

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Start tour for first-time users on step 1
  useEffect(() => {
    if (shouldShowTour && currentStep === 1 && !tourStarted) {
      // Delay to let the UI render
      const timer = setTimeout(() => {
        setTourStarted(true)
        startCreateAgentTour(() => {
          completeTour('create-agent')
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [shouldShowTour, currentStep, tourStarted, completeTour])

  // Manual tour trigger
  const handleStartTour = useCallback(() => {
    startCreateAgentTour(() => {
      completeTour('create-agent')
    })
  }, [completeTour])

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

  const handleSubmit = useCallback(async () => {
    dispatch({ type: 'SUBMIT_START' })

    try {
      // Send selected tools as array to backend, include project_id if provided
      const agent = await api.createAgentFromQA({
        name: formData.name,
        who: formData.who,
        rules: formData.rules,
        selected_tools: formData.tools,
        project_id: projectId || undefined,
      })
      dispatch({ type: 'SUBMIT_SUCCESS' })
      navigate(`/playground/${agent.id}`)
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

            {/* Generate Appearance (Placeholder) */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-violet-50 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Generate Appearance</h4>
                  <p className="text-sm text-gray-500 mb-3">Use AI to create an image based on your description.</p>
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-violet-600 bg-violet-50 rounded-lg opacity-50 cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Generate (Coming Soon)
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button
                onClick={handleStartTour}
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
            {/* Tip Banner */}
            <div className="bg-pink-50 border border-pink-100 rounded-xl px-4 py-3 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <p className="text-sm text-pink-700">
                <span className="font-medium">Tip:</span> We pre-filled this for Charlie. Read it to see how we teach him to be a dog!
              </p>
            </div>

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
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
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

      {/* Step 3: Tricks */}
      {currentStep === 3 && (
        <WizardLayout
          step={3}
          totalSteps={3}
          theme="orange"
          title="Step 3: Tricks"
          description={`Finally, what specific "tricks" or capabilities does your agent need? Does it need to "fetch" information from the web? Does it need to see the world through Maps? Give your agent the tools required to execute its tasks.`}
          icon={<TricksIcon size={32} color="white" />}
        >
          <div className="space-y-6">
            {/* Tool Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-tour="agent-tools">
              {AVAILABLE_TOOLS.map((tool) => (
                <ToolCard
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  selected={formData.tools.includes(tool.id)}
                  onToggle={() => dispatch({ type: 'TOGGLE_TOOL', toolId: tool.id })}
                  requiresApiKey={tool.requiresApiKey}
                  apiKeyUrl={tool.apiKeyUrl}
                />
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
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
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
    </>
  )
}
