import { Icon } from './Icon'

interface Step {
  key: string
  label: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentIndex: number
  complete?: boolean
}

export function ProgressStepper({ steps, currentIndex, complete = false }: ProgressStepperProps) {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const status = complete || index < currentIndex ? 'done' : index === currentIndex ? 'active' : ''
        const className = status ? `step ${status}` : 'step'

        return (
          <div key={step.key} style={{ display: 'contents' }}>
            <div className={className}>
              <span className="step-dot">{status === 'done' ? <Icon name="check" /> : index + 1}</span>
              <span className="step-label">{step.label}</span>
            </div>
            {index < steps.length - 1 && <span className="step-line" />}
          </div>
        )
      })}
    </div>
  )
}
