import { useEffect, useRef, useState } from 'react'
import '../../shared/styles/shell.css'
import '../../shared/styles/register.css'
import '../../shared/styles/analyze.css'
import { SvgDefs, GardenScene, WideScene, PlantAvatar, type PlantKind } from '../../shared/ui/PlantSvg'
import { Icon } from '../../shared/ui/Icon'
import { PageSidebar } from '../../shared/ui/PageSidebar'
import { ProgressStepper } from '../../shared/ui/ProgressStepper'
import { CalRegisterModal } from '../analyze/CalRegisterModal'
import { getImageUploadError, replaceObjectUrl, revokeObjectUrl } from '../../shared/lib/imageUpload'
import { navigate } from '../../shared/lib/navigation'

type RegisterState = 'idle' | 'preview' | 'analyzing' | 'result' | 'registered'
type Difficulty = 'easy' | 'normal' | 'hard'

type Species = {
  name: string
  latin: string
  kind: PlantKind
  difficulty: Difficulty
  difficultyLabel: string
  confidence: number
  care: Record<'water' | 'light' | 'temp' | 'humidity', { k: string; v: string; sub: string }>
}

const SPECIES_BY_FILE: Species[] = [
  {
    name: '몬스테라 델리시오사',
    latin: 'Monstera deliciosa',
    kind: 'monstera',
    difficulty: 'easy',
    difficultyLabel: '쉬움',
    confidence: 96,
    care: {
      water: { k: '물주기', v: '7~10일 간격', sub: '겉흙이 마르면 충분히' },
      light: { k: '햇빛', v: '밝은 간접광', sub: '직사광선은 피하기' },
      temp: { k: '적정 온도', v: '18~27°C', sub: '실내 온도 권장' },
      humidity: { k: '습도', v: '높음 선호', sub: '주 1~2회 분무' },
    },
  },
  {
    name: '스파티필룸',
    latin: 'Spathiphyllum wallisii',
    kind: 'peace',
    difficulty: 'easy',
    difficultyLabel: '쉬움',
    confidence: 91,
    care: {
      water: { k: '물주기', v: '5~7일 간격', sub: '잎이 처지기 전 급수' },
      light: { k: '햇빛', v: '반음지', sub: '부드러운 실내광' },
      temp: { k: '적정 온도', v: '18~26°C', sub: '찬바람 주의' },
      humidity: { k: '습도', v: '중간 이상', sub: '건조하면 잎끝 확인' },
    },
  },
  {
    name: '산세베리아',
    latin: 'Dracaena trifasciata',
    kind: 'sansevieria',
    difficulty: 'easy',
    difficultyLabel: '쉬움',
    confidence: 88,
    care: {
      water: { k: '물주기', v: '2~3주 간격', sub: '흙이 완전히 마른 뒤' },
      light: { k: '햇빛', v: '간접광~반음지', sub: '어두운 곳도 적응' },
      temp: { k: '적정 온도', v: '16~28°C', sub: '10°C 이하 주의' },
      humidity: { k: '습도', v: '보통', sub: '분무는 적게' },
    },
  },
]

const STEPS = [
  { key: 'upload', label: '이미지 업로드' },
  { key: 'analyze', label: 'AI 식물 인식' },
  { key: 'care', label: '관리 정보 등록' },
]

function pickSpecies(fileName: string) {
  const key = fileName.toLowerCase()
  if (key.includes('peace') || key.includes('spath')) return SPECIES_BY_FILE[1]
  if (key.includes('snake') || key.includes('sanse')) return SPECIES_BY_FILE[2]
  return SPECIES_BY_FILE[0]
}

function stepIndexFor(state: RegisterState) {
  if (state === 'idle' || state === 'preview') return 0
  if (state === 'analyzing') return 1
  return 2
}

function PhotoFrame({
  fileUrl,
  fileName,
  plantKind = 'monstera',
  analyzing = false,
}: {
  fileUrl?: string
  fileName?: string
  plantKind?: PlantKind
  analyzing?: boolean
}) {
  return (
    <div className="photo-frame">
      {fileUrl ? (
        <img className="scene" src={fileUrl} alt={fileName ?? '업로드한 식물 사진'} />
      ) : (
        <svg className="scene" viewBox="0 0 200 150" aria-hidden="true">
          <GardenScene season="spring" plants={[{ kind: plantKind }, { kind: 'peace' }]} />
        </svg>
      )}
      <span className="photo-tag"><Icon name="image" />{fileName ?? 'plant-photo.jpg'}</span>
      {analyzing && (
        <div className="analyze-overlay">
          <div className="scan-ring">
            <svg viewBox="0 0 50 50" aria-hidden="true">
              <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(95,142,98,0.18)" strokeWidth="5" />
              <circle cx="25" cy="25" r="20" fill="none" stroke="var(--accent-deep)" strokeWidth="5" strokeLinecap="round" strokeDasharray="40 120" />
            </svg>
          </div>
          <div className="analyze-text">AI가 식물을 분석하고 있어요</div>
          <div className="analyze-sub">잎 모양과 색을 인식하는 중</div>
          <span className="scan-line" />
        </div>
      )}
    </div>
  )
}

function CareInfo({ species }: { species: Species }) {
  const c = species.care
  return (
    <div className="reg-card">
      <div className="reg-card-head">
        <span className="ic"><Icon name="clock" /></span>
        <h2>기본 관리 정보</h2>
        <span className="sub">F-03</span>
      </div>
      <div className="care-grid">
        {([
          ['drop', c.water],
          ['sun', c.light],
          ['thermo', c.temp],
          ['leaf', c.humidity],
        ] as const).map(([icon, item]) => (
          <div className="care-item" key={item.k}>
            <span className="care-ic"><Icon name={icon} /></span>
            <span className="care-copy"><span className="k">{item.k} · {item.sub}</span><span className="v">{item.v}</span></span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FlowCard({
  state,
  fileUrl,
  fileName,
  species,
  error,
  onPickClick,
  onDropFile,
  onAnalyze,
  onReset,
  onRegister,
}: {
  state: RegisterState
  fileUrl?: string
  fileName?: string
  species: Species
  error?: string
  onPickClick: () => void
  onDropFile: (file: File) => void
  onAnalyze: () => void
  onReset: () => void
  onRegister: () => void
}) {
  if (state === 'idle') {
    return (
      <div className="reg-card">
        <div className="reg-card-head">
          <span className="ic"><Icon name="upload" /></span>
          <h2>식물 이미지 업로드</h2>
          <span className="sub">F-01</span>
        </div>
        <div
          className="dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            const file = event.dataTransfer.files[0]
            if (file) onDropFile(file)
          }}
        >
          <svg className="dz-illus" viewBox="0 0 120 120" aria-hidden="true">
            <g transform="translate(60,108) scale(0.95)">
              <GardenScene season="spring" plants={[{ kind: 'monstera' }]} />
            </g>
          </svg>
          <div className="dz-title">식물 사진을 여기에 끌어다 놓으세요</div>
          <div className="dz-sub">또는 아래 버튼으로 갤러리에서 선택할 수 있어요</div>
          <button className="dz-pick" type="button" onClick={onPickClick}>
            <Icon name="image" />파일 선택
          </button>
          {error && <div className="opt-hint" role="alert">{error}</div>}
          <div className="dz-meta">
            <span className="meta-pill"><Icon name="info" style={{ width: 13, height: 13 }} />JPG · PNG · WEBP</span>
            <span className="meta-pill"><Icon name="info" style={{ width: 13, height: 13 }} />최대 5MB</span>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'preview' || state === 'analyzing') {
    const busy = state === 'analyzing'
    return (
      <div className="reg-card">
        <div className="reg-card-head">
          <span className="ic"><Icon name={busy ? 'scan' : 'image'} /></span>
          <h2>{busy ? 'AI 식물 인식' : '이미지 미리보기'}</h2>
          <span className="sub">{busy ? 'F-02' : 'F-01'}</span>
        </div>
        <div className="preview-wrap">
          <PhotoFrame fileUrl={fileUrl} fileName={fileName} plantKind={species.kind} analyzing={busy} />
          <div className="reg-actions">
            <button className="btn-ghost" type="button" onClick={onReset} disabled={busy}>
              <Icon name="refresh" />다시 선택
            </button>
            <button className="btn-primary full" type="button" onClick={onAnalyze} disabled={busy}>
              <Icon name="scan" />{busy ? '분석 중' : '이 사진으로 분석하기'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'result') {
    return (
      <>
        <div className="reg-card">
          <div className="reg-card-head">
            <span className="ic"><Icon name="scan" /></span>
            <h2>AI 인식 결과</h2>
            <span className="sub">F-02</span>
          </div>
          <div className="preview-wrap" style={{ gridTemplateColumns: '200px 1fr', alignItems: 'stretch', gap: 18 }}>
            <PhotoFrame fileUrl={fileUrl} fileName={fileName} plantKind={species.kind} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="species-head">
                <div>
                  <h3 className="species-name">{species.name}</h3>
                  <p className="species-latin">{species.latin}</p>
                  <div style={{ marginTop: 10 }}>
                    <span className={`badge ${species.difficulty}`}>
                      <Icon name="sprout" style={{ width: 13, height: 13 }} />
                      난이도 {species.difficultyLabel}
                    </span>
                  </div>
                </div>
                <div className="species-confidence">
                  <div className="pct">{species.confidence}%</div>
                  <div className="lbl">일치율</div>
                </div>
              </div>
              <div className="reg-actions" style={{ marginTop: 'auto' }}>
                <button className="btn-ghost" type="button" onClick={onReset}>
                  <Icon name="refresh" />다른 사진
                </button>
                <button className="btn-primary full" type="button" onClick={onRegister}>
                  <Icon name="plus" />내 식물로 등록
                </button>
              </div>
            </div>
          </div>
        </div>
        <CareInfo species={species} />
      </>
    )
  }

  return (
    <div className="reg-card">
      <div className="success-card">
        <span className="success-badge"><Icon name="check" /></span>
        <h2>등록이 완료되었어요!</h2>
        <p>
          {species.name} 관리 일정이 캘린더에 추가되었어요.<br />
          이제 물주기와 분무 알림을 캘린더에서 확인할 수 있어요.
        </p>
        <div className="success-chip">
          <PlantAvatar kind={species.kind} season="spring" className="pa" />
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <strong>{species.name}</strong>
            <span>내 식물 · 난이도 {species.difficultyLabel}</span>
          </span>
        </div>
        <div className="reg-actions" style={{ marginTop: 8 }}>
          <button className="btn-ghost" type="button" onClick={onReset}>
            <Icon name="plus" />다른 식물 등록
          </button>
          <button className="btn-primary" type="button" onClick={() => navigate('/')}>
            <Icon name="calendar" />캘린더로 이동
          </button>
        </div>
      </div>
    </div>
  )
}

function RegRail() {
  return (
    <aside className="reg-rail">
      <div className="guide-card">
        <h3><Icon name="camera" />이렇게 촬영해 주세요</h3>
        <ul className="guide-list">
          <li><span className="n">1</span><span>잎과 줄기가 잘 보이도록 가까이서 찍어주세요.</span></li>
          <li><span className="n">2</span><span>밝은 자연광에서 그림자가 적은 각도가 좋아요.</span></li>
          <li><span className="n">3</span><span>한 사진에는 한 종류의 식물만 담아주세요.</span></li>
        </ul>
        <div className="guide-garden">
          <svg viewBox="0 0 320 132" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <WideScene season="spring" plants={[{ kind: 'monstera' }, { kind: 'peace' }, { kind: 'sansevieria' }, { kind: 'peperomia' }]} />
          </svg>
        </div>
      </div>
      <div className="info-card">
        <h3><Icon name="info" />업로드 정보</h3>
        <div className="info-row"><span className="k">지원 형식</span><span className="v">JPG, PNG, WEBP</span></div>
        <div className="info-row"><span className="k">최대 용량</span><span className="v">5 MB</span></div>
        <div className="info-row"><span className="k">권장 해상도</span><span className="v">1024px 이상</span></div>
      </div>
    </aside>
  )
}

export function RegisterPage() {
  const [state, setState] = useState<RegisterState>('idle')
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>()
  const [fileName, setFileName] = useState<string>()
  const [species, setSpecies] = useState<Species>(SPECIES_BY_FILE[0])
  const [error, setError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => revokeObjectUrl(fileUrl), [fileUrl])

  const pickFile = (file: File) => {
    const uploadError = getImageUploadError(file)

    if (uploadError) {
      setError(uploadError)
      return
    }

    setError(undefined)
    setFileUrl((oldUrl) => replaceObjectUrl(oldUrl, file))
    setFileName(file.name)
    setSpecies(pickSpecies(file.name))
    setState('preview')
  }

  const analyze = () => {
    setState('analyzing')
    window.setTimeout(() => setState('result'), 1200)
  }

  const confirmRegister = () => {
    setState('registered')
    setToast(true)
    window.setTimeout(() => setToast(false), 3200)
  }

  const reset = () => {
    revokeObjectUrl(fileUrl)
    setState('idle')
    setModal(false)
    setToast(false)
    setFileUrl(undefined)
    setFileName(undefined)
    setSpecies(SPECIES_BY_FILE[0])
    setError(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const subtitle =
    state === 'idle' || state === 'preview'
      ? '사진 한 장으로 식물을 인식하고, 맞춤 관리 일정을 만들 수 있어요.'
      : state === 'analyzing'
        ? 'AI가 식물을 분석하고 있어요.'
        : state === 'result'
          ? '인식된 식물의 관리 정보를 확인하고 등록해 보세요.'
          : '등록이 완료되었어요.'

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
                fileUrl={fileUrl}
                fileName={fileName}
                species={species}
                error={error}
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
