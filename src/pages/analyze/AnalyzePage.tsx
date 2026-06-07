import { useState } from 'react'
import '../../shared/styles/shell.css'
import '../../shared/styles/register.css'
import '../../shared/styles/analyze.css'
import { SvgDefs, GardenScene, WideScene, PlantAvatar, type PlantKind } from '../../shared/ui/PlantSvg'
import { Icon } from '../../shared/ui/Icon'
import { PageSidebar } from '../../shared/ui/PageSidebar'
import { CalRegisterModal, SCHEDULE_PRESETS } from './CalRegisterModal'

type AnalyzeState = 'input' | 'questions' | 'analyzing' | 'result'

interface PlantOption {
  name: string
  kind: PlantKind
  tone: string
}

const SUGGESTED: PlantOption[] = [
  { name: '몬스테라', kind: 'monstera', tone: '#71986f' },
  { name: '스파티필름', kind: 'peace', tone: '#789671' },
  { name: '산세베리아', kind: 'sansevieria', tone: '#2f9aa3' },
  { name: '필레아 페페', kind: 'peperomia', tone: '#f0a21d' },
]

const QUESTIONS = [
  {
    id: 'water', q: '마지막으로 물을 준 게 언제인가요?', sub: '물주기 주기를 가늠해볼게요', multi: false,
    opts: ['3일 이내', '약 1주 전', '2주 이상', '기억나지 않아요'],
  },
  {
    id: 'light', q: '식물이 놓인 곳의 빛은 어떤가요?', sub: '광량은 잎 상태에 큰 영향을 줘요', multi: false,
    opts: ['밝은 직사광', '밝은 간접광', '다소 어두운 실내'],
  },
  {
    id: 'symptom', q: '잎에서 보이는 변화를 모두 골라주세요', sub: '여러 개 선택할 수 있어요', multi: true,
    opts: ['잎끝이 갈색', '노랗게 변함', '처지고 시듦', '반점·곰팡이', '특별한 변화 없음'],
  },
  {
    id: 'env', q: '실내 환경은 어떤 편인가요?', sub: '온도·습도를 함께 볼게요', multi: false,
    opts: ['건조하고 따뜻', '적당한 편', '춥고 습함'],
  },
]

const DIAGNOSIS = {
  score: 68,
  grade: 'warn' as const,
  gradeLabel: '주의가 필요해요',
  summary: '전반적으로 살아가는 데 문제는 없지만, 최근 물주기 습관과 자리 환경 때문에 잎끝 갈변이 시작됐어요. 아래 해결 방법을 따라 2주만 관리하면 충분히 회복할 수 있어요.',
  issues: [
    { ic: 'drop' as const, t: '과습 신호', sev: 'high' as const, c: '물주기 간격이 짧아 뿌리가 숨 쉬기 어려운 상태예요. 잎끝 갈변의 가장 큰 원인입니다.' },
    { ic: 'sun' as const, t: '광량 부족 가능성', sev: 'mid' as const, c: '다소 어두운 자리에서 아래쪽 잎이 노랗게 변할 수 있어요.' },
    { ic: 'leaf' as const, t: '낮은 습도', sev: 'low' as const, c: '건조한 실내 공기가 잎끝 마름을 더 빠르게 만들어요.' },
  ],
  solutions: [
    { st: '물주기 간격을 10일로 늘리기', sd: '겉흙 2~3cm가 완전히 마른 뒤에 충분히 주고, 받침에 고인 물은 버려 과습을 회복시켜요.' },
    { st: '밝은 간접광 자리로 옮기기', sd: '창가에서 한 걸음 떨어진, 직사광은 닿지 않지만 환한 곳이 가장 좋아요.' },
    { st: '주 2회 잎 분무 + 갈변 잎 정리', sd: '분무로 습도를 높이고, 이미 마른 잎끝은 가위로 살짝 다듬어 주세요.' },
    { st: '2주 뒤 상태 다시 확인', sd: '새 잎 색과 갈변 진행 여부를 보고 물주기 주기를 미세 조정해요.' },
  ],
}

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

function AnStepper({ state }: { state: AnalyzeState }) {
  const cur = anStepIndex(state)
  return (
    <div className="stepper">
      {AN_STEPS.map((s, i) => {
        const cls = i < cur ? 'done' : i === cur ? 'active' : ''
        return (
          <div key={s.key} style={{ display: 'contents' }}>
            <div className={`step ${cls}`}>
              <span className="step-dot">{cls === 'done' ? <Icon name="check" /> : i + 1}</span>
              <span className="step-label">{s.label}</span>
            </div>
            {i < AN_STEPS.length - 1 && <span className="step-line" />}
          </div>
        )
      })}
    </div>
  )
}

/* ---- Step 1 · 정보 입력 ---- */
function InputCard({
  plant,
  photoFilled,
  onPick,
  onPhoto,
  onStart,
}: {
  plant: PlantOption | null
  photoFilled: boolean
  onPick: (p: PlantOption) => void
  onPhoto: () => void
  onStart: () => void
}) {
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
            <span className="hint">정확할수록 진단이 똑똑해져요</span>
          </label>
          <input
            className="an-input"
            placeholder="예: 몬스테라 델리시오사"
            value={plant ? plant.name : ''}
            readOnly
          />
          <div className="suggest-chips">
            {SUGGESTED.map((s) => (
              <button
                type="button"
                key={s.kind}
                className={`chip ${plant?.kind === s.kind ? 'on' : ''}`}
                onClick={() => onPick(s)}
              >
                <PlantAvatar
                  kind={s.kind}
                  season="spring"
                  className="pa"
                  style={{ '--tone': s.tone } as React.CSSProperties}
                />
                {s.name}
              </button>
            ))}
            <button type="button" className="chip">
              <Icon name="pen" style={{ width: 14, height: 14 }} />직접 입력
            </button>
          </div>
        </div>

        <div className="field">
          <label className="field-label">
            현재 상태 사진 <span className="req">*</span>
            <span className="hint">잎과 줄기가 잘 보이게</span>
          </label>
          {photoFilled ? (
            <div className="dropzone filled">
              <div className="photo-frame" style={{ aspectRatio: 'auto', height: 210, borderRadius: 0, border: 'none' }}>
                <svg className="scene" viewBox="0 0 200 150" aria-hidden="true">
                  <GardenScene season="spring" plants={[{ kind: plant?.kind ?? 'monstera' }]} />
                </svg>
                <span className="photo-tag">
                  <Icon name="image" />{(plant?.kind ?? 'plant')}-status.jpg
                </span>
              </div>
            </div>
          ) : (
            <div className="dropzone compact" onClick={onPhoto} style={{ cursor: 'pointer' }}>
              <svg className="dz-illus" viewBox="0 0 120 120" aria-hidden="true">
                <GardenScene season="spring" plants={[{ kind: plant?.kind ?? 'monstera' }]} />
              </svg>
              <div className="dz-title">상태가 잘 보이는 사진을 올려주세요</div>
              <button className="dz-pick" type="button">
                <Icon name="image" />사진 선택
              </button>
            </div>
          )}
        </div>

        <button
          className="btn-primary full"
          style={{ height: 46 }}
          disabled={!(plant && photoFilled)}
          onClick={onStart}
        >
          <Icon name="scan" />AI 분석 시작하기
        </button>
      </div>
    </div>
  )
}

/* ---- Step 2 · AI 추가 질문 ---- */
function QuestionsCard({
  step,
  answers,
  onAnswer,
  onNext,
}: {
  step: number
  answers: Record<string, string | string[]>
  onAnswer: (q: (typeof QUESTIONS)[number], o: string) => void
  onNext: () => void
}) {
  const cur = QUESTIONS[step]
  const pct = Math.round((step / QUESTIONS.length) * 100)
  const multiReady = cur.multi
    ? Array.isArray(answers[cur.id]) && (answers[cur.id] as string[]).length > 0
    : true

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
          const sel = answers[q.id]
          const isActive = i === step
          const isOn = (o: string) =>
            q.multi ? Array.isArray(sel) && sel.includes(o) : sel === o

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
                        <button
                          type="button"
                          key={o}
                          className={`opt-chip ${isOn(o) ? 'on' : ''}`}
                          onClick={() => onAnswer(q, o)}
                        >
                          <Icon name="check" className="tick" />
                          {o}
                        </button>
                      ))}
                    </div>
                    {q.multi && <div className="opt-hint">여러 개 선택 가능 · 선택 후 '다음'을 눌러주세요</div>}
                  </>
                ) : (
                  <div style={{ marginTop: 8 }}>
                    <div className="user-answer">
                      <span className="bub">
                        <Icon name="check" />
                        {q.multi
                          ? Array.isArray(sel) && sel.length ? sel.join(', ') : '해당 없음'
                          : sel as string}
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
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={cur.multi ? !multiReady : !answers[cur.id]}
        >
          {step === QUESTIONS.length - 1
            ? <><Icon name="scan" />진단 결과 보기</>
            : <>다음 질문<Icon name="check" /></>}
        </button>
      </div>
    </div>
  )
}

/* ---- Analyzing interstitial ---- */
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
        <div className="analyze-text">AI가 상태를 진단하고 있어요…</div>
        <div className="analyze-sub" style={{ marginTop: 0 }}>사진과 답변을 종합해 원인을 찾는 중</div>
      </div>
    </div>
  )
}

/* ---- Step 3 · 진단 결과 ---- */
function HealthGauge({ score }: { score: number }) {
  const r = 56, c = 2 * Math.PI * r
  const tone = score >= 80 ? 'var(--accent)' : score >= 60 ? '#bf7b2f' : '#c8615b'
  return (
    <div className="health-gauge">
      <svg viewBox="0 0 132 132" aria-hidden="true">
        <circle cx="66" cy="66" r={r} fill="none" stroke="var(--control-line)" strokeWidth="11" />
        <circle cx="66" cy="66" r={r} fill="none" stroke={tone} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`} />
      </svg>
      <div className="center">
        <div className="score">{score}<small>점</small></div>
        <div className="unit">건강 점수</div>
      </div>
    </div>
  )
}

function DiagnosisCards({ onRegister }: { onRegister: () => void }) {
  const d = DIAGNOSIS
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
          <HealthGauge score={d.score} />
          <div className="summary-copy">
            <h2>{d.gradeLabel}</h2>
            <span className={`grade-badge ${d.grade}`}>
              <Icon name="info" style={{ width: 13, height: 13 }} />
              주의 1 · 관찰 2
            </span>
            <p>{d.summary}</p>
          </div>
        </div>
      </div>

      <div className="reg-card">
        <h3 className="section-label">
          <Icon name="search" style={{ width: 16, height: 16, color: 'var(--accent-deep)' }} />
          발견된 문제와 원인
          <span className="tagn">{d.issues.length}건</span>
        </h3>
        <div className="diag-issues">
          {d.issues.map((it) => (
            <div className="issue-row" key={it.t}>
              <span className="issue-ic"><Icon name={it.ic} /></span>
              <div className="issue-copy">
                <div className="t">{it.t}</div>
                <div className="c">{it.c}</div>
              </div>
              <span className={`sev ${it.sev}`}>
                {it.sev === 'high' ? '높음' : it.sev === 'mid' ? '보통' : '낮음'}
              </span>
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
          {d.solutions.map((s, i) => (
            <div className="solution-step" key={i}>
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
          <button className="btn-ghost"><Icon name="refresh" />다시 진단</button>
          <button className="btn-primary full" onClick={onRegister}>
            <Icon name="calendar" />이 일정 캘린더에 등록하기
          </button>
        </div>
      </div>
    </>
  )
}

/* ---- Right rail ---- */
function AnalyzeRail({ state }: { state: AnalyzeState }) {
  if (anStepIndex(state) === 2) {
    return (
      <aside className="reg-rail">
        <div className="info-card">
          <h3><Icon name="info" />진단 요약</h3>
          <div className="info-row"><span className="k">건강 점수</span><span className="v">{DIAGNOSIS.score}점 · 주의</span></div>
          <div className="info-row"><span className="k">핵심 원인</span><span className="v">과습</span></div>
          <div className="info-row"><span className="k">예상 회복</span><span className="v">약 2주</span></div>
          <div className="info-row"><span className="k">추천 일정</span><span className="v">3건</span></div>
        </div>
        <div className="guide-card">
          <h3><Icon name="bulb" />회복 팁</h3>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.8, color: '#353c34' }}>
            회복 기간에는 영양제를 잠시 멈추고, 물주기와 빛만 안정적으로 맞춰주는 게 좋아요.
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
          <li><span className="n">1</span><span>식물 종 이름과 현재 상태 사진을 알려주세요.</span></li>
          <li><span className="n">2</span><span>AI가 관리 습관을 묻는 몇 가지 질문을 더 해요.</span></li>
          <li><span className="n">3</span><span>현재 상태 진단과 해결 방법을 정리해 드려요.</span></li>
        </ul>
        <div className="guide-garden">
          <svg viewBox="0 0 320 132" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <WideScene season="spring" plants={[{ kind: 'monstera' }, { kind: 'peace' }, { kind: 'sansevieria' }, { kind: 'peperomia' }]} />
          </svg>
        </div>
      </div>
      <div className="info-card">
        <h3><Icon name="info" />무엇을 알 수 있나요</h3>
        <div className="info-row"><span className="k">건강 점수</span><span className="v">0 – 100점</span></div>
        <div className="info-row"><span className="k">원인 분석</span><span className="v">과습·빛·습도</span></div>
        <div className="info-row"><span className="k">맞춤 일정</span><span className="v">캘린더 연동</span></div>
      </div>
    </aside>
  )
}

export function AnalyzePage() {
  const [state, setState] = useState<AnalyzeState>('input')
  const [plant, setPlant] = useState<PlantOption | null>(null)
  const [photoFilled, setPhotoFilled] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [modal, setModal] = useState(false)

  const cur = QUESTIONS[step]

  const onAnswer = (q: (typeof QUESTIONS)[number], o: string) => {
    setAnswers((a) => {
      if (!q.multi) return { ...a, [q.id]: o }
      const list = (a[q.id] as string[]) || []
      return {
        ...a,
        [q.id]: list.includes(o) ? list.filter((x) => x !== o) : [...list, o],
      }
    })
  }

  const onNext = () => {
    if (step < QUESTIONS.length - 1) { setStep((s) => s + 1); return }
    setState('analyzing')
    setTimeout(() => setState('result'), 2100)
  }

  const start = () => { setState('questions'); setStep(0) }

  const subtitle =
    state === 'input' ? '식물 종 이름과 사진을 올리면 AI가 상태를 분석해 드려요.'
    : state === 'questions' || state === 'analyzing' ? 'AI가 정확한 진단을 위해 몇 가지를 더 물어봐요.'
    : '현재 상태 진단과 맞춤 해결 방법을 확인하세요.'

  return (
    <>
      <div className="shell" data-season="spring">
        <SvgDefs />
        <PageSidebar season="spring" activePath="/analyze" />
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
              <AnStepper state={state} />

              {state === 'input' && (
                <InputCard
                  plant={plant}
                  photoFilled={photoFilled}
                  onPick={setPlant}
                  onPhoto={() => setPhotoFilled(true)}
                  onStart={start}
                />
              )}
              {state === 'questions' && (
                <QuestionsCard step={step} answers={answers} onAnswer={onAnswer} onNext={onNext} />
              )}
              {state === 'analyzing' && <AnalyzingCard />}
              {state === 'result' && (
                <DiagnosisCards onRegister={() => setModal(true)} />
              )}
            </div>
            <AnalyzeRail state={state} />
          </div>
        </div>
      </div>

      <CalRegisterModal
        open={modal}
        preset="diagnose"
        plantName={plant?.name ?? '몬스테라'}
        onClose={() => setModal(false)}
      />
    </>
  )
}
