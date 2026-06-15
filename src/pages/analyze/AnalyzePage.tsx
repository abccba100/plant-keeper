import { useEffect, useMemo, useRef, useState } from 'react'
import '../../components/styles/shell.css'
import '../../components/styles/register.css'
import '../../components/styles/analyze.css'
import { SvgDefs } from '../../components/plant/PlantSvg'
import { PageSidebar } from '../../components/layout/PageSidebar'
import { ProgressStepper } from '../../components/common/ProgressStepper'
import { getImageUploadError, replaceObjectUrl, revokeObjectUrl } from '../../api/imageUpload'
import { CalRegisterModal } from '../../components/analyze/CalRegisterModal'

import { AnalyzingCard, AnalyzeRail, DiagnosisCards, InputCard, QuestionsCard } from '../../components/analyze/AnalyzePanels'
import { AN_STEPS, NO_SYMPTOM, QUESTIONS, anStepIndex, createDiagnosis, type AnalyzeState, type Answers, type PlantOption, type Question } from '../../store/analyzeModel'
import { getPlantTone, type PlantKind } from '../../store/plantData'
import { usePlantStore } from '../../store/plantStore'
import { analyzePlantImage } from '../../services/groqPlantAi'
export function AnalyzePage() {
  const [state, setState] = useState<AnalyzeState>('input')
  const [plant, setPlant] = useState<PlantOption | null>(null)
  const [plantName, setPlantName] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string>()
  const [photoFile, setPhotoFile] = useState<File>()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [aiDiagnosis, setAiDiagnosis] = useState<ReturnType<typeof createDiagnosis>>()
  const [modal, setModal] = useState(false)
  const [error, setError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const diagnosis = useMemo(() => aiDiagnosis ?? createDiagnosis(answers), [aiDiagnosis, answers])
  const addPlant = usePlantStore((store) => store.addPlant)
  const selectedPlantKind: PlantKind = plant?.kind ?? 'monstera'
  const selectedPlantName = plantName.trim() || '내 식물'

  const subtitle =
    state === 'input'
      ? '식물 이름과 사진을 올리면 AI가 상태를 분석해 드려요.'
      : state === 'questions' || state === 'analyzing'
        ? '정확한 진단을 위해 몇 가지를 더 물어볼게요.'
        : '현재 상태 진단과 맞춤 해결 방법을 확인하세요.'

  function pickPhoto(file: File) {
    const uploadError = getImageUploadError(file)

    if (uploadError) {
      setError(uploadError)
      return
    }

    setError(undefined)
    setPhotoFile(file)
    setPhotoUrl((oldUrl) => replaceObjectUrl(oldUrl, file))
  }

  function handleAnswer(question: Question, option: string) {
    setAnswers((current) => {
      if (!question.multi) return { ...current, [question.id]: [option] }

      const selected = current[question.id] ?? []
      if (option === NO_SYMPTOM) {
        return { ...current, [question.id]: selected.includes(option) ? [] : [option] }
      }

      const withoutNoSymptom = selected.filter((item) => item !== NO_SYMPTOM)
      const next = withoutNoSymptom.includes(option)
        ? withoutNoSymptom.filter((item) => item !== option)
        : [...withoutNoSymptom, option]

      return { ...current, [question.id]: next }
    })
  }

  async function goToNextQuestion() {
    if (step < QUESTIONS.length - 1) {
      setStep((currentStep) => currentStep + 1)
      return
    }

    if (!photoFile) {
      setError('분석할 이미지를 먼저 선택해 주세요.')
      setState('input')
      return
    }

    setState('analyzing')

    try {
      const result = await analyzePlantImage({
        imageFile: photoFile,
        mode: 'diagnose',
        plantName: plantName.trim(),
        answers,
      })

      setAiDiagnosis(result.diagnosis ?? createDiagnosis(answers))
      setError(undefined)
      setState('result')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'AI 분석에 실패했습니다.')
      setState('questions')
    }
  }

  function startDiagnosis() {
    setState('questions')
    setStep(0)
    setAnswers({})
    setAiDiagnosis(undefined)
  }

  function retryDiagnosis() {
    setState('input')
    setStep(0)
    setAnswers({})
    setAiDiagnosis(undefined)
    setModal(false)
  }

  function selectPlant(option: PlantOption) {
    setPlant(option)
    setPlantName(option.name)
  }

  useEffect(() => () => revokeObjectUrl(photoUrl), [photoUrl])

  return (
    <>
      <div className="shell" data-season="spring">
        <SvgDefs />
        <PageSidebar season="spring" activePath="/analyze" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) pickPhoto(file)
          }}
        />
        <div className="page-area">
          <div className="atmos">
            <span className="atmos-glow" />
            <span className="atmos-shadow" />
          </div>
          <div className="reg-workspace">
            <div className="page-col" style={{ minWidth: 0 }}>
              <div className="page-head">
                <h1>식물 상태 분석</h1>
                <p>{subtitle}</p>
              </div>
              <ProgressStepper steps={AN_STEPS} currentIndex={anStepIndex(state)} />

              {state === 'input' && (
                <InputCard
                  plant={plant}
                  plantName={plantName}
                  photoUrl={photoUrl}
                  error={error}
                  onPick={selectPlant}
                  onNameChange={(name) => {
                    setPlantName(name)
                    setPlant(null)
                  }}
                  onPhotoClick={() => fileInputRef.current?.click()}
                  onStart={startDiagnosis}
                />
              )}
              {state === 'questions' && <QuestionsCard step={step} answers={answers} onAnswer={handleAnswer} onNext={goToNextQuestion} />}
              {state === 'analyzing' && <AnalyzingCard />}
              {state === 'result' && <DiagnosisCards diagnosis={diagnosis} onRegister={() => setModal(true)} onRetry={retryDiagnosis} />}
            </div>
            <AnalyzeRail state={state} diagnosis={diagnosis} />
          </div>
        </div>
      </div>

      <CalRegisterModal
        open={modal}
        preset="diagnose"
        plantName={selectedPlantName}
        plantKind={selectedPlantKind}
        onClose={() => setModal(false)}
        onConfirm={() => addPlant({ name: selectedPlantName, kind: selectedPlantKind, tone: getPlantTone(selectedPlantKind) })}
      />
    </>
  )
}
