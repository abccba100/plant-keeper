import { GardenScene, WideScene } from '../plant/PlantSvg'
import { Icon } from '../common/Icon'
import type { CareProfile } from '../../store/careProfile'

const DIFF_LEVELS = [
  { key: 'easy', label: '쉬움', d: '관리 빈도가 낮고 환경 변화에 강해요. 입문자에게 추천.' },
  { key: 'normal', label: '보통', d: '규칙적인 물주기와 빛 관리가 필요해요.' },
  { key: 'hard', label: '어려움', d: '습도·온도에 민감해 세심한 관리가 필요해요.' },
]

function Ladder({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <span className="ladder">
      {Array.from({ length: max }).map((_, i) => (
        <i key={i} className={i < level ? 'on' : ''} />
      ))}
    </span>
  )
}

export function CareHero({ p }: { p: CareProfile }) {
  return (
    <div className="reg-card">
      <div className="care-hero">
        <div className="photo-frame">
          <svg className="scene" viewBox="0 0 200 150" aria-hidden="true">
            <GardenScene season="spring" plants={[{ kind: 'monstera' }]} />
          </svg>
          <span className="photo-tag"><Icon name="image" />monstera-leaf.jpg</span>
        </div>
        <div className="care-hero-meta">
          <span className="eyebrow"><Icon name="scan" />AI 인식 완료 · 일치도 96%</span>
          <h2>{p.name}</h2>
          <p className="latin">{p.latin}</p>
          <div className="care-hero-tags">
            <span className={`badge ${p.difficulty}`}>
              <Icon name="sprout" style={{ width: 13, height: 13 }} />
              난이도 {p.difficultyLabel}
            </span>
            <span className="hero-stat"><Icon name="leaf" />{p.type}</span>
            <span className="hero-stat"><Icon name="info" />원산지 <b>{p.origin}</b></span>
          </div>
          <p className="desc">{p.desc}</p>
          <div className="care-hero-actions">
            <button className="btn-primary"><Icon name="calendar" />관리 일정 만들기</button>
            <button className="btn-ghost"><Icon name="pen" />상태 진단하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CoreCare({ p }: { p: CareProfile }) {
  return (
    <div className="reg-card">
      <h3 className="section-label">
        <Icon name="clock" style={{ width: 16, height: 16, color: 'var(--accent-deep)' }} />
        핵심 관리
        <span className="tagn">F-03</span>
      </h3>
      <div className="core-care">
        <div className="care-tile">
          <div className="care-tile-head">
            <span className="ic"><Icon name="drop" /></span>
            <div><div className="lbl">물주기</div><div className="big">{p.water.v}</div></div>
          </div>
          <Ladder level={p.water.level} />
          <p className="note">{p.water.note}</p>
        </div>
        <div className="care-tile">
          <div className="care-tile-head">
            <span className="ic"><Icon name="sun" /></span>
            <div><div className="lbl">햇빛</div><div className="big">{p.light.v}</div></div>
          </div>
          <Ladder level={p.light.level} />
          <p className="note">{p.light.note}</p>
        </div>
      </div>
      <div className="care-supp">
        <h3 className="section-label" style={{ fontSize: 13 }}>추가 정보</h3>
        <div className="care-grid">
          <div className="care-item">
            <span className="care-ic"><Icon name="thermo" /></span>
            <span className="care-copy"><span className="k">{p.temp.k} · {p.temp.sub}</span><span className="v">{p.temp.v}</span></span>
          </div>
          <div className="care-item">
            <span className="care-ic"><Icon name="leaf" /></span>
            <span className="care-copy"><span className="k">{p.humidity.k} · {p.humidity.sub}</span><span className="v">{p.humidity.v}</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CareFallback() {
  return (
    <div className="reg-card">
      <h3 className="section-label">
        <Icon name="clock" style={{ width: 16, height: 16, color: 'var(--accent-deep)' }} />
        기본 관리 정보
        <span className="tagn">F-03</span>
      </h3>
      <div className="care-fallback big">
        <Icon name="search" />
        <div className="t">관리 정보를 찾을 수 없어요</div>
        <div className="d">아직 이 식물의 관리 데이터가 준비되지 않았어요. 식물 종을 직접 선택하거나, 상태를 입력해 맞춤 가이드를 받아보세요.</div>
        <div className="reg-actions">
          <button className="btn-ghost"><Icon name="refresh" />다시 인식하기</button>
          <button className="btn-primary"><Icon name="pen" />직접 입력하기</button>
        </div>
      </div>
    </div>
  )
}

export function DiffGuideRail({ p, fallback }: { p: CareProfile; fallback?: boolean }) {
  return (
    <aside className="reg-rail">
      <div className="info-card diff-guide">
        <h3><Icon name="sprout" />난이도 가이드</h3>
        {DIFF_LEVELS.map((lv) => {
          const cur = !fallback && lv.key === p.difficulty
          return (
            <div className={`row ${cur ? 'cur' : ''}`} key={lv.key}>
              <span className={`badge ${lv.key}`}>{lv.label}</span>
              <span className="d">
                {lv.d}
                {cur && <span className="cur-tag">현재 식물</span>}
              </span>
            </div>
          )
        })}
      </div>
      <div className="guide-card">
        <h3><Icon name="bulb" />관리 팁</h3>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.8, color: '#353c34' }}>
          {fallback
            ? '정확한 인식을 위해 잎과 줄기가 선명하게 보이는 사진을 사용해 주세요.'
            : '새 잎이 나는 봄·여름에는 2주에 한 번 영양제를 함께 주면 더 건강하게 자라요.'}
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
