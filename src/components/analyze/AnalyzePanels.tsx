import type { CSSProperties } from 'react'
import { SCHEDULE_PRESETS } from '../../store/schedulePresets'
import { GardenScene, PlantAvatar, WideScene } from '../plant/PlantSvg'
import { Icon } from '../common/Icon'
import { QUESTIONS, SUGGESTED, anStepIndex, type AnalyzeState, type Answers, type Diagnosis, type PlantOption, type Question } from '../../store/analyzeModel'

export function InputCard({
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
                <PlantAvatar kind={s.kind} season="spring" className="pa" style={{ '--tone': s.tone } as CSSProperties} />
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
            <div className="dropzone filled clickable" onClick={onPhotoClick}>
              <div className="photo-frame analyze-photo-frame">
                <img className="scene" src={photoUrl} alt="업로드한 식물 상태 사진" />
                <span className="photo-tag"><Icon name="image" />상태 사진 변경</span>
              </div>
            </div>
          ) : (
            <div className="dropzone compact clickable" onClick={onPhotoClick}>
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

        <button className="btn-primary full analyze-start-button" disabled={!canStart} onClick={onStart}>
          <Icon name="scan" />AI 분석 시작하기
        </button>
      </div>
    </div>
  )
}

export function QuestionsCard({
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
                  <div className="answered-row">
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

export function AnalyzingCard() {
  return (
    <div className="reg-card">
      <div className="analyzing-panel">
        <div className="scan-ring analyzing-ring">
          <svg viewBox="0 0 50 50" aria-hidden="true">
            <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(95,142,98,0.18)" strokeWidth="5" />
            <circle cx="25" cy="25" r="20" fill="none" stroke="var(--accent-deep)" strokeWidth="5" strokeLinecap="round" strokeDasharray="40 120" />
          </svg>
        </div>
        <div className="analyze-text">AI가 상태를 진단하고 있어요</div>
        <div className="analyze-sub analyzing-sub">사진과 답변을 종합해 원인을 찾는 중</div>
      </div>
    </div>
  )
}

export function HealthGauge({ score }: { score: number }) {
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

export function DiagnosisCards({ diagnosis, onRegister, onRetry }: { diagnosis: Diagnosis; onRegister: () => void; onRetry: () => void }) {
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
              <Icon name="info" className="icon-xs" />
              {diagnosis.grade === 'ok' ? '안정' : diagnosis.grade === 'warn' ? '주의' : '긴급'}
            </span>
            <p>{diagnosis.summary}</p>
          </div>
        </div>
      </div>

      <div className="reg-card">
        <h3 className="section-label">
          <Icon name="search" className="section-icon" />
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
          <Icon name="bulb" className="section-icon" />
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
          <Icon name="calendar" className="section-icon" />
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

export function AnalyzeRail({ state, diagnosis }: { state: AnalyzeState; diagnosis: Diagnosis }) {
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
          <p className="guide-copy">
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
