import { useState } from 'react'
import '../../shared/styles/shell.css'
import '../../shared/styles/register.css'
import '../../shared/styles/analyze.css'
import { SvgDefs, GardenScene, WideScene, PlantAvatar, type PlantKind } from '../../shared/ui/PlantSvg'
import { Icon } from '../../shared/ui/Icon'
import { PageSidebar } from '../../shared/ui/PageSidebar'
import { CalRegisterModal } from '../analyze/CalRegisterModal'

type RegisterState = 'idle' | 'preview' | 'analyzing' | 'result' | 'registered'

const SAMPLE_SPECIES = {
  name: '몬스테라 델리시오사',
  latin: 'Monstera deliciosa',
  difficulty: 'easy' as const,
  difficultyLabel: '쉬움',
  confidence: 96,
  care: {
    water: { k: '물주기', v: '7~10일 간격', sub: '겉흙이 마르면' },
    light: { k: '햇빛', v: '밝은 간접광', sub: '직사광선 피하기' },
    temp: { k: '적정 온도', v: '18 – 27°C', sub: '실내 권장' },
    humidity: { k: '습도', v: '높음 선호', sub: '주 1~2회 분무' },
  },
}

const STEPS = [
  { key: 'upload', label: '이미지 업로드', icon: 'upload' as const },
  { key: 'analyze', label: 'AI 식물 인식', icon: 'scan' as const },
  { key: 'care', label: '관리 정보 · 등록', icon: 'sprout' as const },
]

function stepIndexFor(state: RegisterState) {
  if (state === 'idle' || state === 'preview') return 0
  if (state === 'analyzing') return 1
  return 2
}

function Stepper({ state }: { state: RegisterState }) {
  const cur = stepIndexFor(state)
  const allDone = state === 'registered'
  return (
    <div className="stepper">
      {STEPS.map((s, i) => {
        const cls = allDone || i < cur ? 'done' : i === cur ? 'active' : ''
        return (
          <div key={s.key} style={{ display: 'contents' }}>
            <div className={`step ${cls}`}>
              <span className="step-dot">
                {cls === 'done' ? <Icon name="check" /> : i + 1}
              </span>
              <span className="step-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <span className="step-line" />}
          </div>
        )
      })}
    </div>
  )
}

function PhotoFrame({ analyzing = false }: { analyzing?: boolean }) {
  return (
    <div className="photo-frame">
      <svg className="scene" viewBox="0 0 200 150" aria-hidden="true">
        <GardenScene season="spring" plants={[{ kind: 'monstera' }, { kind: 'peace' }]} />
      </svg>
      <span className="photo-tag"><Icon name="image" />monstera-leaf.jpg</span>
      {analyzing && (
        <div className="analyze-overlay">
          <div className="scan-ring">
            <svg viewBox="0 0 50 50" aria-hidden="true">
              <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(95,142,98,0.18)" strokeWidth="5" />
              <circle cx="25" cy="25" r="20" fill="none" stroke="var(--accent-deep)" strokeWidth="5" strokeLinecap="round" strokeDasharray="40 120" />
            </svg>
          </div>
          <div className="analyze-text">AI가 식물을 분석하고 있어요…</div>
          <div className="analyze-sub">잎 모양과 색을 인식하는 중</div>
          <span className="scan-line" />
        </div>
      )}
    </div>
  )
}

function CareInfo() {
  const c = SAMPLE_SPECIES.care
  return (
    <div className="reg-card">
      <div className="reg-card-head">
        <span className="ic"><Icon name="clock" /></span>
        <h2>기본 관리 정보</h2>
        <span className="sub">F-03</span>
      </div>
      <div className="care-grid">
        <div className="care-item">
          <span className="care-ic"><Icon name="drop" /></span>
          <span className="care-copy"><span className="k">{c.water.k} · {c.water.sub}</span><span className="v">{c.water.v}</span></span>
        </div>
        <div className="care-item">
          <span className="care-ic"><Icon name="sun" /></span>
          <span className="care-copy"><span className="k">{c.light.k} · {c.light.sub}</span><span className="v">{c.light.v}</span></span>
        </div>
        <div className="care-item">
          <span className="care-ic"><Icon name="thermo" /></span>
          <span className="care-copy"><span className="k">{c.temp.k} · {c.temp.sub}</span><span className="v">{c.temp.v}</span></span>
        </div>
        <div className="care-item">
          <span className="care-ic"><Icon name="leaf" /></span>
          <span className="care-copy"><span className="k">{c.humidity.k} · {c.humidity.sub}</span><span className="v">{c.humidity.v}</span></span>
        </div>
      </div>
    </div>
  )
}

function FlowCard({
  state,
  onPick,
  onAnalyze,
  onReset,
  onRegister,
}: {
  state: RegisterState
  onPick: () => void
  onAnalyze: () => void
  onReset: () => void
  onRegister: () => void
}) {
  const sp = SAMPLE_SPECIES

  if (state === 'idle') {
    return (
      <div className="reg-card">
        <div className="reg-card-head">
          <span className="ic"><Icon name="upload" /></span>
          <h2>식물 이미지 업로드</h2>
          <span className="sub">F-01</span>
        </div>
        <div className="dropzone">
          <svg className="dz-illus" viewBox="0 0 120 120" aria-hidden="true">
            <g transform="translate(60,108) scale(0.95)">
              <GardenScene season="spring" plants={[{ kind: 'monstera' }]} />
            </g>
          </svg>
          <div className="dz-title">식물 사진을 여기에 끌어다 놓으세요</div>
          <div className="dz-sub">또는 아래 버튼으로 갤러리에서 선택할 수 있어요</div>
          <button className="dz-pick" onClick={onPick}>
            <Icon name="image" />파일 선택
          </button>
          <div className="dz-meta">
            <span className="meta-pill"><Icon name="info" style={{ width: 13, height: 13 }} />JPG · PNG</span>
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
          <PhotoFrame analyzing={busy} />
          <div className="reg-actions">
            <button className="btn-ghost" onClick={onReset} disabled={busy}>
              <Icon name="refresh" />다시 선택
            </button>
            <button className="btn-primary full" onClick={onAnalyze} disabled={busy}>
              <Icon name="scan" />{busy ? '분석 중…' : '이 사진으로 분석하기'}
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
            <div className="photo-frame" style={{ aspectRatio: '3 / 4' }}>
              <svg className="scene" viewBox="0 0 200 150" aria-hidden="true">
                <GardenScene season="spring" plants={[{ kind: 'monstera' }]} />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="species-head">
                <div>
                  <h3 className="species-name">{sp.name}</h3>
                  <p className="species-latin">{sp.latin}</p>
                  <div style={{ marginTop: 10 }}>
                    <span className={`badge ${sp.difficulty}`}>
                      <Icon name="sprout" style={{ width: 13, height: 13 }} />
                      난이도 {sp.difficultyLabel}
                    </span>
                  </div>
                </div>
                <div className="species-confidence">
                  <div className="pct">{sp.confidence}%</div>
                  <div className="lbl">일치도</div>
                </div>
              </div>
              <div className="reg-actions" style={{ marginTop: 'auto' }}>
                <button className="btn-ghost" onClick={onReset}>
                  <Icon name="refresh" />다른 사진
                </button>
                <button className="btn-primary full" onClick={onRegister}>
                  <Icon name="plus" />내 식물로 등록
                </button>
              </div>
            </div>
          </div>
        </div>
        <CareInfo />
      </>
    )
  }

  // registered (F-06)
  return (
    <div className="reg-card">
      <div className="success-card">
        <span className="success-badge"><Icon name="check" /></span>
        <h2>등록이 완료되었어요!</h2>
        <p>
          몬스테라의 관리 일정이 캘린더에 자동으로 추가됐어요.<br />
          이제 물주기와 영양제 알림을 받아볼 수 있어요.
        </p>
        <div className="success-chip">
          <PlantAvatar kind="monstera" season="spring" className="pa" />
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <strong>{sp.name}</strong>
            <span>내 식물 · 난이도 쉬움</span>
          </span>
        </div>
        <div className="reg-actions" style={{ marginTop: 8 }}>
          <button className="btn-ghost" onClick={onReset}>
            <Icon name="plus" />다른 식물 등록
          </button>
          <button
            className="btn-primary"
            onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}
          >
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
          <li><span className="n">2</span><span>밝은 자연광에서, 그림자가 적은 각도가 좋아요.</span></li>
          <li><span className="n">3</span><span>한 화분에 한 종류의 식물만 담아주세요.</span></li>
        </ul>
        <div className="guide-garden">
          <svg viewBox="0 0 320 132" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            <WideScene season="spring" plants={[{ kind: 'monstera' }, { kind: 'peace' }, { kind: 'sansevieria' }, { kind: 'peperomia' }]} />
          </svg>
        </div>
      </div>
      <div className="info-card">
        <h3><Icon name="info" />업로드 정보</h3>
        <div className="info-row"><span className="k">지원 형식</span><span className="v">JPG, PNG</span></div>
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

  const analyze = () => {
    setState('analyzing')
    setTimeout(() => setState('result'), 2200)
  }

  const register = () => setModal(true)

  const confirmRegister = () => {
    setState('registered')
    setToast(true)
    setTimeout(() => setToast(false), 3200)
  }

  const reset = () => { setState('idle'); setModal(false); setToast(false) }

  const subtitle =
    state === 'idle' || state === 'preview'
      ? '사진 한 장으로 식물을 인식하고, 맞춤 관리 일정을 만들어 드려요.'
      : state === 'analyzing'
      ? 'AI가 식물을 분석하고 있어요…'
      : state === 'result'
      ? '식물을 인식했어요. 관리 정보를 확인하고 등록해 보세요.'
      : '등록이 완료됐어요!'

  return (
    <>
      <div className="shell" data-season="spring">
        <SvgDefs />
        <PageSidebar season="spring" activePath="/register" />
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
              <Stepper state={state} />
              <FlowCard
                state={state}
                onPick={() => setState('preview')}
                onAnalyze={analyze}
                onReset={reset}
                onRegister={register}
              />
            </div>
            <RegRail />
          </div>
        </div>
        {toast && (
          <div className="toast">
            <Icon name="check" />몬스테라가 내 식물에 등록되었어요
          </div>
        )}
      </div>
      <CalRegisterModal
        open={modal}
        preset="identify"
        plantName="몬스테라"
        title="관리 일정을 캘린더에 등록할까요?"
        onClose={() => setModal(false)}
        onConfirm={confirmRegister}
      />
    </>
  )
}
