import { useRef, useState } from 'react'
import '../../components/styles/shell.css'
import '../../components/styles/register.css'
import '../../components/styles/analyze.css'
import { SvgDefs } from '../../components/plant/PlantSvg'
import { Icon } from '../../components/common/Icon'
import { PageSidebar } from '../../components/layout/PageSidebar'
import { ProgressStepper } from '../../components/common/ProgressStepper'
import { CalRegisterModal } from '../../components/analyze/CalRegisterModal'
import { useImageUpload } from '../../hooks/useImageUpload'

import { FlowCard, RegRail } from '../../components/register/RegisterPanels'
import { SPECIES_BY_FILE, STEPS, pickSpecies, stepIndexFor, type RegisterState, type Species } from '../../store/registerModel'
import { getPlantTone } from '../../store/plantData'
import { usePlantStore } from '../../store/plantStore'
import { analyzePlantImage } from '../../services/groqPlantAi'
export function RegisterPage() {
  const [state, setState] = useState<RegisterState>('idle')
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState(false)
  const [species, setSpecies] = useState<Species>(SPECIES_BY_FILE[0])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addPlant = usePlantStore((store) => store.addPlant)
  const imageUpload = useImageUpload()

  const subtitle =
    state === 'idle' || state === 'preview'
      ? '사진 한 장으로 식물을 인식하고, 맞춤 관리 일정을 만들 수 있어요.'
      : state === 'analyzing'
        ? 'AI가 식물을 분석하고 있어요.'
        : state === 'result'
          ? '인식된 식물의 관리 정보를 확인하고 등록해 보세요.'
          : '등록이 완료되었어요.'

  function pickFile(file: File) {
    if (!imageUpload.pickImage(file)) {
      return
    }

    setSpecies(pickSpecies(file.name))
    setState('preview')
  }

  async function analyze() {
    if (!imageUpload.file) {
      imageUpload.setUploadError('분석할 이미지를 먼저 선택해 주세요.')
      return
    }

    setState('analyzing')

    try {
      const result = await analyzePlantImage({ imageFile: imageUpload.file, mode: 'identify' })

      setSpecies({
        name: result.plantName,
        latin: result.latinName,
        kind: result.plantKind,
        difficulty: result.difficulty,
        difficultyLabel: result.difficultyLabel,
        confidence: result.confidence,
        care: result.care,
      })
      imageUpload.setUploadError(undefined)
      setState('result')
    } catch (error) {
      imageUpload.setUploadError(error instanceof Error ? error.message : 'AI 분석에 실패했습니다.')
      setState('preview')
    }
  }

  function confirmRegister() {
    const plant = addPlant({
      name: species.name,
      kind: species.kind,
      tone: getPlantTone(species.kind),
    })
    setState('registered')
    setToast(true)
    window.setTimeout(() => setToast(false), 3200)

    return plant
  }

  function reset() {
    imageUpload.resetImage()
    setState('idle')
    setModal(false)
    setToast(false)
    setSpecies(SPECIES_BY_FILE[0])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <>
      <div className="shell" data-season="spring">
        <SvgDefs />
        <PageSidebar season="spring" activePath="/register" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) pickFile(file)
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
                <h1>식물 등록 &amp; AI 분석</h1>
                <p>{subtitle}</p>
              </div>
              <ProgressStepper steps={STEPS} currentIndex={stepIndexFor(state)} complete={state === 'registered'} />
              <FlowCard
                state={state}
                fileUrl={imageUpload.fileUrl}
                fileName={imageUpload.fileName}
                species={species}
                error={imageUpload.uploadError}
                onPickClick={() => fileInputRef.current?.click()}
                onDropFile={pickFile}
                onAnalyze={analyze}
                onReset={reset}
                onRegister={() => setModal(true)}
              />
            </div>
            <RegRail />
          </div>
        </div>
        {toast && (
          <div className="toast">
            <Icon name="check" />{species.name}이 내 식물로 등록되었어요.
          </div>
        )}
      </div>
      <CalRegisterModal
        open={modal}
        preset="identify"
        plantName={species.name}
        plantKind={species.kind}
        title="관리 일정을 캘린더에 등록할까요?"
        onClose={() => setModal(false)}
        onConfirm={confirmRegister}
      />
    </>
  )
}
