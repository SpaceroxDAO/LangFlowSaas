import { useReducer, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { api } from '@/lib/api'

// Types
interface FormData {
  who: string
  rules: string
  tricks: string
}

interface WizardState {
  currentStep: number
  formData: FormData
  errors: Partial<Record<keyof FormData, string>>
  isSubmitting: boolean
}

type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; field: keyof FormData; value: string }
  | { type: 'SET_ERROR'; field: keyof FormData; message: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR' }

// Reducer
const initialState: WizardState = {
  currentStep: 1,
  formData: { who: '', rules: '', tricks: '' },
  errors: {},
  isSubmitting: false,
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
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.message } }
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true }
    case 'SUBMIT_SUCCESS':
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false }
    default:
      return state
  }
}

// Validation
function validateField(_field: keyof FormData, value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'This field is required'
  if (trimmed.length < 10) return 'Please provide more detail (at least 10 characters)'
  return undefined
}

// Step content configuration
const STEPS = [
  {
    number: 1,
    title: 'Persona',
    field: 'who' as const,
    label: 'Who is Charlie?',
    placeholder: `Describe Charlie's personality, tone, and role. For example:

"Charlie is a friendly and patient customer support agent for a bakery. He speaks warmly, uses simple language, and always tries to help customers find the perfect pastry for any occasion."`,
  },
  {
    number: 2,
    title: 'Rules',
    field: 'rules' as const,
    label: 'What are the rules?',
    placeholder: `Define the knowledge and guidelines Charlie should follow. For example:

"Always greet customers warmly. Know our menu including croissants ($3), muffins ($2.50), and custom cakes (from $25). Never discuss competitor products. If unsure about an order, ask clarifying questions."`,
  },
  {
    number: 3,
    title: 'Capabilities',
    field: 'tricks' as const,
    label: 'What tricks can Charlie do?',
    placeholder: `List the tasks and capabilities Charlie can perform. For example:

"Answer questions about menu items and prices. Help customers choose products based on dietary restrictions. Take orders and provide estimated pickup times. Handle basic complaints with empathy."`,
  },
]

export function CreateAgentPage() {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { currentStep, formData, errors, isSubmitting } = state

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  const currentStepConfig = STEPS[currentStep - 1]

  const handleNext = useCallback(() => {
    const error = validateField(currentStepConfig.field, formData[currentStepConfig.field])
    if (error) {
      dispatch({ type: 'SET_ERROR', field: currentStepConfig.field, message: error })
      return
    }
    dispatch({ type: 'NEXT_STEP' })
  }, [currentStepConfig, formData])

  const handleBack = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const handleSubmit = useCallback(async () => {
    // Validate current step
    const error = validateField(currentStepConfig.field, formData[currentStepConfig.field])
    if (error) {
      dispatch({ type: 'SET_ERROR', field: currentStepConfig.field, message: error })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    try {
      const agent = await api.createAgentFromQA({
        who: formData.who,
        rules: formData.rules,
        tricks: formData.tricks,
      })
      dispatch({ type: 'SUBMIT_SUCCESS' })
      navigate(`/playground/${agent.id}`)
    } catch (err) {
      dispatch({ type: 'SUBMIT_ERROR' })
      console.error('Failed to create agent:', err)
    }
  }, [currentStepConfig, formData, navigate])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="flex items-center justify-center mb-8">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {index > 0 && (
              <div
                className={`w-12 h-0.5 ${
                  step.number <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                step.number < currentStep
                  ? 'bg-blue-600 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.number < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.number
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between mb-8 px-4">
        {STEPS.map((step) => (
          <span
            key={step.number}
            className={`text-sm font-medium ${
              step.number === currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {step.title}
          </span>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentStepConfig.label}
        </h2>
        <p className="text-gray-600 mb-6">
          Step {currentStep} of 3
        </p>

        <div className="mb-6">
          <textarea
            value={formData[currentStepConfig.field]}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: currentStepConfig.field,
                value: e.target.value,
              })
            }
            placeholder={currentStepConfig.placeholder}
            rows={8}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors[currentStepConfig.field]
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}
          />
          {errors[currentStepConfig.field] && (
            <p className="mt-2 text-sm text-red-600">
              {errors[currentStepConfig.field]}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-400 text-right">
            {formData[currentStepConfig.field].length} characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Charlie...
                </>
              ) : (
                'Create Charlie'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
