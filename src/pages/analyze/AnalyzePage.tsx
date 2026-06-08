import { useEffect, useMemo, useRef, useState } from 'react'
import '../../shared/styles/shell.css'
import '../../shared/styles/register.css'
import '../../shared/styles/analyze.css'
import { SvgDefs, GardenScene, WideScene, PlantAvatar, type PlantKind } from '../../shared/ui/PlantSvg'
import { Icon } from '../../shared/ui/Icon'
import { PageSidebar } from '../../shared/ui/PageSidebar'
import { ProgressStepper } from '../../shared/ui/ProgressStepper'
import { getImageUploadError, replaceObjectUrl, revokeObjectUrl } from '../../shared/lib/imageUpload'
import { CalRegisterModal } from './CalRegisterModal'
import { SCHEDULE_PRESETS } from './schedulePresets'

type AnalyzeState = 'input' | 'questions' | 'analyzing' | 'result'

interface PlantOption {
  name: string
  kind: PlantKind
  tone: string
}

type Diagnosis = {
  score: number
  grade: 'ok' | 'warn' | 'danger'
  gradeLabel: string
  summary: string
  issues: { ic: 'drop' | 'sun' | 'leaf'; t: string; sev: 'high' | 'mid' | 'low'; c: string }[]
  solutions: { st: string; sd: string }[]
}

const SUGGESTED: PlantOption[] = [
  { name: '몬스테라', kind: 'monstera', tone: '#71986f' },
  { name: '스파티필룸', kind: 'peace', tone: '#789671' },
  { name: '산세베리아', kind: 'sansevieria', tone: '#2f9aa3' },
  { name: '필레아 페페', kind: 'peperomia', tone: '#f0a21d' },
]

const QUESTIONS = [
  {
    id: 'water',
    q: '마지막으로 물을 준 건 언제인가요?',
    sub: '물주기 주기를 가늠해 볼게요.',
    multi: false,
    opts: ['3일 이내', '약 1주 전', '2주 이상', '기억나지 않아요'],
  },
  {
    id: 'light',
    q: '식물이 놓인 곳의 빛은 어떤가요?',
    sub: '광량은 잎 상태에 큰 영향을 줘요.',
    multi: false,
    opts: ['밝은 직사광', '밝은 간접광', '다소 어두운 실내'],
  },
  {
    id: 'symptom',
    q: '잎에서 보이는 변화를 모두 골라주세요.',
    sub: '여러 개를 선택할 수 있어요.',
    multi: true,
    opts: ['잎끝이 갈색', '노랗게 변함', '처지고 시듦', '반점·구멍', '특별한 변화 없음'],
  },
  {
    id: 'env',
    q: '실내 환경은 어떤 편인가요?',
    sub: '온도와 습도를 함께 볼게요.',
    multi: false,
    opts: ['건조하고 따뜻함', '적당한 편', '춥고 습함'],
  },
] as const

type Question = (typeof QUESTIONS)[number]
type QuestionId = Question['id']
type Answers = Partial<Record<QuestionId, string[]>>

const NO_SYMPTOM = '특별한 변화 없음'

const AN_STEPS = [
  { key: 'input', label: '정보 입력' },
  { key: 'questions', label: 'AI 추가 질문' },
  { key: 'result', label: '진단 결과' },
]

function anStepIndex(state: AnalyzeState) {
  if (state === 'input') return 0
  if (state === 'questions' || state === 'analyzing') return 1
  return 2
}

function createDiagnosis(answers: Answers): Diagnosis {
  let score = 86
  const issues: Diagnosis['issues'] = []
  const solutions: Diagnosis['solutions'] = []
  const symptoms = answers.symptom ?? []
  const water = answers.water?.[0]
  const light = answers.light?.[0]
  const env = answers.env?.[0]

  if (water === '2주 이상' || water === '기억나지 않아요') {
    score -= 14
    issues.push({ ic: 'drop', t: '수분 부족 가능성', sev: 'high', c: '최근 물주기 간격이 길어 잎 처짐이나 갈변이 생길 수 있어요.' })
    solutions.push({ st: '겉흙 상태 확인 후 충분히 물주기', sd: '화분 받침에 고인 물은 버리고, 다음 급수는 흙이 마른 뒤 진행하세요.' })
  } else if (water === '3일 이내') {
    score -= 10
    issues.push({ ic: 'drop', t: '과습 신호', sev: 'mid', c: '급수 간격이 짧으면 뿌리가 숨쉬기 어려워질 수 있어요.' })
    solutions.push({ st: '급수 간격 늘리기', sd: '겉흙 2~3cm가 마른 뒤 물을 주고 통풍을 확보하세요.' })
  }

  if (light === '다소 어두운 실내') {
    score -= 9
    issues.push({ ic: 'sun', t: '광량 부족', sev: 'mid', c: '어두운 자리에서는 새잎이 작아지고 아래쪽 잎이 노랗게 변할 수 있어요.' })
    solutions.push({ st: '밝은 간접광 위치로 옮기기', sd: '창가에서 한두 걸음 떨어진 밝은 자리가 좋아요.' })
  }

  if (env === '건조하고 따뜻함' || symptoms.includes('잎끝이 갈색')) {
    score -= 8
    issues.push({ ic: 'leaf', t: '습도 부족', sev: 'low', c: '건조한 공기는 잎끝 마름을 빠르게 만들 수 있어요.' })
    solutions.push({ st: '주 2회 분무와 잎 정리', sd: '마른 잎끝은 깨끗한 가위로 정리하고 주변 습도를 올려주세요.' })
  }

  if (symptoms.includes('반점·구멍')) {
    score -= 12
    issues.push({ ic: 'leaf', t: '병해충 관찰 필요', sev: 'high', c: '반점이나 구멍은 해충 또는 잎 손상의 초기 신호일 수 있어요.' })
    solutions.push({ st: '잎 뒷면과 줄기 확인', sd: '해충 흔적이 있으면 다른 식물과 잠시 분리하고 잎을 닦아주세요.' })
  }

  if (issues.length === 0) {
    issues.push({ ic: 'leaf', t: '큰 이상 없음', sev: 'low', c: '현재 입력 기준으로는 급한 문제 신호가 적어요.' })
    solutions.push({ st: '현재 루틴 유지', sd: '2주 뒤 잎 색과 새잎 상태를 다시 확인하세요.' })
  }

  solutions.push({ st: '2주 후 상태 다시 확인', sd: '잎 색, 흙 마름 속도, 새잎 변화를 보고 물주기 주기를 미세 조정하세요.' })
  const boundedScore = Math.max(35, Math.min(96, score))
  const grade = boundedScore >= 80 ? 'ok' : boundedScore >= 60 ? 'warn' : 'danger'

  return {
    score: boundedScore,
    grade,
    gradeLabel: grade === 'ok' ? '전반적으로 건강해요' : grade === 'warn' ? '주의가 필요해요' : '빠른 관리가 필요해요',
    summary:
      grade === 'ok'
        ? '입력한 상태로는 큰 이상 신호가 적어요. 현재 관리 루틴을 유지하되 잎끝과 흙 마름 속도를 관찰해 주세요.'
        : grade === 'warn'
          ? '치명적인 문제는 아니지만 물주기, 빛, 습도 중 일부를 조정하면 회복 가능성이 높아요.'
          : '수분과 병해충 상태를 우선 확인해야 해요. 관리 환경을 조정하고 며칠 간 변화를 기록해 주세요.',
    issues,
    solutions,
  }
}

function InputCard({
  plant,
  plantName,
  photoUrl,
  error,
  onPick,
  onNameChange,
  onPhotoClick,
  onStart,
}: {
  plant: PlantOption | null
  plantName: string
  photoUrl?: string
  error?: string
  onPick: (p: PlantOption) => void
  onNameChange: (name: string) => void
  onPhotoClick: () => void
  onStart: () => void
}) {
  const canStart = plantName.trim().length > 0 && Boolean(photoUrl)

  return (
    <div className="reg-card">
      <div className="reg-card-head">
        <span className="ic"><Icon name="pen" /></span>
        <h2>식물 정보 입력</h2>
        <span className="sub">상태 분석</span>
      </div>
      <div className="an-form">
        <div className="field">
          <label className="field-label">
            식물 종 이름 <span className="req">*</span>
            <span className="hint">정확할수록 진단이 좋아져요.</span>
          </label>
          <input
            className="an-input"
            placeholder="예: 몬스테라 델리시오사"
            value={plantName}
            onChange={(event) => onNameChange(event.target.value)}
          />
          <div className="suggest-chips">
            {SUGGESTED.map((s) => (
              <button
                type="button"
                key={s.kind}
                className={`chip ${plant?.kind === s.kind ? 'on' : ''}`}
                onClick={() => onPick(s)}
              >
                <PlantAvatar kind={s.kind} season="spring" className="pa" style={{ '--tone': s.tone } as React.CSSProperties} />
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label">
            현재 상태 사진 <span className="req">*</span>
            <span className="hint">잎과 줄기가 잘 보이게 올려주세요.</span>
          </label>
          {photoUrl ? (
            <div className="dropzone filled" onClick={onPhotoClick} style={{ cursor: 'pointer' }}>
              <div className="photo-frame" style={{ aspectRatio: 'auto', height: 210, borderRadius: 0, border: 'none' }}>
                <img className="scene" src={photoUrl} alt="업로드한 식물 상태 사진" />
                <span className="photo-tag"><Icon name="image" />상태 사진 변경</span>
              </div>
            </div>
          ) : (
            <div className="dropzone compact" onClick={onPhotoClick} style={{ cursor: 'pointer' }}>
              <svg className="dz-illus" viewBox="0 0 120 120" aria-hidden="true">
                <GardenScene season="spring" plants={[{ kind: plant?.kind ?? 'monstera' }]} />
              </svg>
              <div className="dz-title">상태가 잘 보이는 사진을 올려주세요</div>
              <button className="dz-pick" type="button">
                <Icon name="image" />사진 선택
              </button>
            </div>
          )}
          {error && <div className="opt-hint" role="alert">{error}</div>}
        </div>

        <button className="btn-primary full" style={{ height: 46 }} disabled={!canStart} onClick={onStart}>
          <Icon name="scan" />AI 분석 시작하기
        </button>
      </div>
    </div>
  )
}

function QuestionsCard({
  step,
  answers,
  onAnswer,
  onNext,
}: {
  step: number
  answers: Answers
  onAnswer: (q: Question, o: string) => void
  onNext: () => void
}) {
  const cur = QUESTIONS[step]
  const pct = Math.round((step / QUESTIONS.length) * 100)
  const selected = answers[cur.id] ?? []

  return (
    <div className="reg-card">
      <div className="reg-card-head">
        <span className="ic"><Icon name="search" /></span>
        <h2>AI 추가 질문</h2>
        <span className="sub">상태 분석</span>
      </div>
      <div className="qa-progress">
        <span>맞춤 진단을 위한 추가 질문</span>
        <span className="bar"><i style={{ width: `${Math.max(pct, 6)}%` }} /></span>
        <span className="count">{step + 1} / {QUESTIONS.length}</span>
      </div>
      <div className="qa-stream">
        {QUESTIONS.slice(0, step + 1).map((q, i) => {
          const selectedOptions = answers[q.id] ?? []
          const isActive = i === step
          const isOn = (o: string) => selectedOptions.includes(o)

          return (
            <div className="ai-row" key={q.id}>
              <span className="ai-avatar"><Icon name="bulb" /></span>
              <div className="ai-body">
                <div className="ai-bubble">
                  {q.q}<span className="q-sub">{q.sub}</span>
                </div>
                {isActive ? (
                  <>
                    <div className="opt-chips">
                      {q.opts.map((o) => (
                        <button type="button" key={o} className={`opt-chip ${isOn(o) ? 'on' : ''}`} onClick={() => onAnswer(q, o)}>
                          <Icon name="check" className="tick" />
                          {o}
                        </button>
                      ))}
                    </div>
                    {q.multi && <div className="opt-hint">여러 개 선택 가능 · 선택 후 다음을 눌러주세요.</div>}
                  </>
                ) : (
                  <div style={{ marginTop: 8 }}>
                    <div className="user-answer">
                      <span className="bub">
                        <Icon name="check" />
                        {selectedOptions.join(', ') || '해당 없음'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="qa-foot">
        <button className="btn-primary" onClick={onNext} disabled={selected.length === 0}>
          {step === QUESTIONS.length - 1
            ? <><Icon name="scan" />진단 결과 보기</>
            : <>다음 질문<Icon name="check" /></>}
        </button>
      </div>
    </div>
  )
}

function AnalyzingCard() {
  return (
    <div className="reg-card">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '46px 20px' }}>
        <div className="scan-ring" style={{ width: 60, height: 60 }}>
          <svg viewBox="0 0 50 50" aria-hidden="true">
            <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(95,142,98,0.18)" strokeWidth="5" />
            <circle cx="25" cy="25" r="20" fill="none" stroke="var(--accent-deep)" strokeWidth="5" strokeLinecap="round" strokeDasharray="40 120" />
          </svg>
        </div>
        <div className="analyze-text">AI가 상태를 진단하고 있어요</div>
        <div className="analyze-sub" style={{ marginTop: 0 }}>사진과 답변을 종합해 원인을 찾는 중</div>
      </div>
    </div>
  )
}

function HealthGauge({ score }: { score: number }) {
  const r = 56
  const c = 2 * Math.PI * r
  const tone = score >= 80 ? 'var(--accent)' : score >= 60 ? '#bf7b2f' : '#c8615b'
  return (
    <div className="health-gauge">
      <svg viewBox="0 0 132 132" aria-hidden="true">
        <circle cx="66" cy="66" r={r} fill="none" stroke="var(--control-line)" strokeWidth="11" />
        <circle cx="66" cy="66" r={r} fill="none" stroke={tone} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} />
      </svg>
      <div className="center">
        <div className="score">{score}<small>점</small></div>
        <div className="unit">건강 점수</div>
      </div>
    </div>
  )
}

function DiagnosisCards({ diagnosis, onRegister, onRetry }: { diagnosis: Diagnosis; onRegister: () => void; onRetry: () => void }) {
  const schedTasks = SCHEDULE_PRESETS.diagnose.filter((t) => t.on)

  return (
    <>
      <div className="reg-card">
        <div className="reg-card-head">
          <span className="ic"><Icon name="scan" /></span>
          <h2>AI 상태 진단</h2>
          <span className="sub">진단 결과</span>
        </div>
        <div className="diag-summary">
          <HealthGauge score={diagnosis.score} />
          <div className="summary-copy">
            <h2>{diagnosis.gradeLabel}</h2>
            <span className={`grade-badge ${diagnosis.grade}`}>
              <Icon name="info" style={{ width: 13, height: 13 }} />
              {diagnosis.grade === 'ok' ? '안정' : diagnosis.grade === 'warn' ? '주의' : '긴급'}
            </span>
            <p>{diagnosis.summary}</p>
          </div>
        </div>
      </div>

      <div className="reg-card">
        <h3 className="section-label">
          <Icon name="search" style={{ width: 16, height: 16, color: 'var(--accent-deep)' }} />
          발견한 문제와 원인
          <span className="tagn">{diagnosis.issues.length}건</span>
        </h3>
        <div className="diag-issues">
          {diagnosis.issues.map((it) => (
            <div className="issue-row" key={it.t}>
              <span className="issue-ic"><Icon name={it.ic} /></span>
              <div className="issue-copy"><div className="t">{it.t}</div><div className="c">{it.c}</div></div>
              <span className={`sev ${it.sev}`}>{it.sev === 'high' ? '높음' : it.sev === 'mid' ? '보통' : '낮음'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reg-card">
        <h3 className="section-label">
          <Icon name="bulb" style={{ width: 16, height: 16, color: 'var(--accent-deep)' }} />
          해결 방법
          <span className="tagn">단계별</span>
        </h3>
        <div className="diag-solutions">
          {diagnosis.solutions.map((s, i) => (
            <div className="solution-step" key={`${s.st}-${i}`}>
              <span className="num">{i + 1}</span>
              <div><div className="st">{s.st}</div><div className="sd">{s.sd}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="reg-card">
        <h3 className="section-label">
          <Icon name="calendar" style={{ width: 16, height: 16, color: 'var(--accent-deep)' }} />
          추천 관리 일정
          <span className="tagn">캘린더 등록 가능</span>
        </h3>
        <div className="sched-preview">
          {schedTasks.map((t) => (
            <div className="sched-row" key={t.id}>
              <span className="sched-ic"><Icon name={t.type} /></span>
              <div className="sched-copy"><div className="t">{t.title}</div><div className="d">{t.detail}</div></div>
              <span className="sched-when">{t.when}</span>
            </div>
          ))}
        </div>
        <div className="diag-cta">
          <button className="btn-ghost" onClick={onRetry}><Icon name="refresh" />다시 진단</button>
          <button className="btn-primary full" onClick={onRegister}>
            <Icon name="calendar" />이 일정 캘린더에 등록하기
          </button>
        </div>
      </div>
    </>
  )
}

function AnalyzeRail({ state, diagnosis }: { state: AnalyzeState; diagnosis: Diagnosis }) {
  if (anStepIndex(state) === 2) {
    return (
      <aside className="reg-rail">
        <div className="info-card">
          <h3><Icon name="info" />진단 요약</h3>
          <div className="info-row"><span className="k">건강 점수</span><span className="v">{diagnosis.score}점</span></div>
          <div className="info-row"><span className="k">주요 원인</span><span className="v">{diagnosis.issues[0]?.t ?? '관찰 필요'}</span></div>
          <div className="info-row"><span className="k">예상 회복</span><span className="v">약 2주</span></div>
          <div className="info-row"><span className="k">추천 일정</span><span className="v">3건</span></div>
        </div>
        <div className="guide-card">
          <h3><Icon name="bulb" />회복 팁</h3>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.8, color: '#353c34' }}>
            회복 기간에는 비료를 잠시 멈추고 물주기와 빛만 안정적으로 맞춰주는 편이 좋아요.
          </p>
          <div className="guide-garden">
            <svg viewBox="0 0 320 132" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
              <WideScene season="spring" plants={[{ kind: 'monstera' }, { kind: 'peace' }, { kind: 'sansevieria' }, { kind: 'peperomia' }]} />
            </svg>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="reg-rail">
      <div className="guide-card">
        <h3><Icon name="search" />이렇게 분석해요</h3>
        <ul className="guide-list">
          <li><span className="n">1</span><span>식물 이름과 현재 상태 사진을 올려주세요.</span></li>
          <li><span className="n">2</span><span>AI가 관리 습관을 묻는 몇 가지 질문을 해요.</span></li>
          <li><span className="n">3</span><span>현재 상태 진단과 해결 방법을 정리해 드려요.</span></li>
        </ul>
        <div className="guide-garden">
          <svg viewBox="0 0 320 132" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <WideScene season="spring" plants={[{ kind: 'monstera' }, { kind: 'peace' }, { kind: 'sansevieria' }, { kind: 'peperomia' }]} />
          </svg>
        </div>
      </div>
      <div className="info-card">
        <h3><Icon name="info" />무엇을 보나요?</h3>
        <div className="info-row"><span className="k">건강 점수</span><span className="v">0~100점</span></div>
        <div className="info-row"><span className="k">원인 분석</span><span className="v">과습·광량·습도</span></div>
        <div className="info-row"><span className="k">맞춤 일정</span><span className="v">캘린더 연동</span></div>
      </div>
    </aside>
  )
}

export function AnalyzePage() {
  const [state, setState] = useState<AnalyzeState>('input')
  const [plant, setPlant] = useState<PlantOption | null>(null)
  const [plantName, setPlantName] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string>()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [modal, setModal] = useState(false)
  const [error, setError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const diagnosis = useMemo(() => createDiagnosis(answers), [answers])

  useEffect(() => () => revokeObjectUrl(photoUrl), [photoUrl])

  const pickPhoto = (file: File) => {
    const uploadError = getImageUploadError(file)

    if (uploadError) {
      setError(uploadError)
      return
    }

    setError(undefined)
    setPhotoUrl((oldUrl) => replaceObjectUrl(oldUrl, file))
  }

  const onAnswer = (q: Question, option: string) => {
    setAnswers((current) => {
      if (!q.multi) return { ...current, [q.id]: [option] }

      const selected = current[q.id] ?? []
      if (option === NO_SYMPTOM) {
        return { ...current, [q.id]: selected.includes(option) ? [] : [option] }
      }

      const withoutNoSymptom = selected.filter((item) => item !== NO_SYMPTOM)
      const next = withoutNoSymptom.includes(option)
        ? withoutNoSymptom.filter((item) => item !== option)
        : [...withoutNoSymptom, option]

      return { ...current, [q.id]: next }
    })
  }

  const onNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1)
      return
    }
    setState('analyzing')
    window.setTimeout(() => setState('result'), 1200)
  }

  const start = () => {
    setState('questions')
    setStep(0)
    setAnswers({})
  }

  const retry = () => {
    setState('input')
    setStep(0)
    setAnswers({})
    setModal(false)
  }

  const selectPlant = (option: PlantOption) => {
    setPlant(option)
    setPlantName(option.name)
  }

  const subtitle =
    state === 'input'
      ? '식물 이름과 사진을 올리면 AI가 상태를 분석해 드려요.'
      : state === 'questions' || state === 'analyzing'
        ? '정확한 진단을 위해 몇 가지를 더 물어볼게요.'
        : '현재 상태 진단과 맞춤 해결 방법을 확인하세요.'

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
                  onStart={start}
                />
              )}
              {state === 'questions' && <QuestionsCard step={step} answers={answers} onAnswer={onAnswer} onNext={onNext} />}
              {state === 'analyzing' && <AnalyzingCard />}
              {state === 'result' && <DiagnosisCards diagnosis={diagnosis} onRegister={() => setModal(true)} onRetry={retry} />}
            </div>
            <AnalyzeRail state={state} diagnosis={diagnosis} />
          </div>
        </div>
      </div>

      <CalRegisterModal
        open={modal}
        preset="diagnose"
        plantName={plantName || '내 식물'}
        plantKind={plant?.kind ?? 'monstera'}
        onClose={() => setModal(false)}
      />
    </>
  )
}
