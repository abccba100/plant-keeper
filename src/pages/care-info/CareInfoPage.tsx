import { useState } from 'react'
import '../../shared/styles/shell.css'
import '../../shared/styles/register.css'
import { SvgDefs, GardenScene, WideScene } from '../../shared/ui/PlantSvg'
import { Icon } from '../../shared/ui/Icon'
import { PageSidebar } from '../../shared/ui/PageSidebar'

const CARE_PROFILE = {
  name: '몬스테라 델리시오사',
  latin: 'Monstera deliciosa',
  difficulty: 'easy' as const,
  difficultyLabel: '쉬움',
  desc: '잎이 크고 갈라진 모양이 매력적인 인기 관엽식물이에요. 환경 적응력이 좋아 처음 키우기에 부담이 적고, 밝은 간접광과 적당한 물주기만 지켜주면 잘 자랍니다.',
  origin: '중앙아메리카',
  type: '관엽식물',
  water: { v: '7 – 10일 간격', note: '겉흙 2~3cm가 마르면 충분히 주세요. 과습에 약하니 화분 받침의 고인 물은 버려주세요.', level: 2 },
  light: { v: '밝은 간접광', note: '직사광선은 잎을 태울 수 있어요. 창가에서 한 걸음 떨어진 밝은 자리가 좋아요.', level: 3 },
  temp: { k: '적정 온도', v: '18 – 27°C', sub: '실내 권장 · 10°C 이하 주의' },
  humidity: { k: '습도', v: '높음 선호', sub: '주 1~2회 잎 분무' },
}

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

function CareHero({ p, fallback }: { p: typeof CARE_PROFILE; fallback?: boolean }) {
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

function CoreCare({ p }: { p: typeof CARE_PROFILE }) {
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

function CareFallback() {
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

function DiffGuideRail({ p, fallback }: { p: typeof CARE_PROFILE; fallback?: boolean }) {
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

export function CareInfoPage() {
  const [variant, setVariant] = useState<'full' | 'fallback'>('full')
  const fallback = variant === 'fallback'
  const p = CARE_PROFILE

  return (
    <div className="shell" data-season="spring">
      <SvgDefs />
      <PageSidebar season="spring" activePath="/care-info" />
      <div className="page-area">
        <div className="atmos">
          <span className="atmos-glow" />
          <span className="atmos-shadow" />
        </div>
        <div className="reg-workspace">
          <div className="page-col" style={{ minWidth: 0 }}>
            <div className="page-head">
              <h1>기본 관리 정보</h1>
              <p>
                {fallback
                  ? '인식된 식물의 관리 정보를 확인할 수 없어요.'
                  : '인식된 식물에 딱 맞는 관리 가이드를 확인하세요.'}
              </p>
            </div>
            {fallback ? <CareFallback /> : (
              <>
                <CareHero p={p} />
                <CoreCare p={p} />
              </>
            )}
          </div>
          <DiffGuideRail p={p} fallback={fallback} />
        </div>
      </div>

      {/* 미리보기 전환 스위치 */}
      <div className="preview-switch" role="group" aria-label="미리보기 전환">
        <span className="preview-switch-label">
          <Icon name="info" style={{ width: 13, height: 13 }} />
          미리보기
        </span>
        <button
          className={variant === 'full' ? 'btn-primary' : 'btn-ghost'}
          onClick={() => setVariant('full')}
        >
          정보 있음
        </button>
        <button
          className={variant === 'fallback' ? 'btn-primary' : 'btn-ghost'}
          onClick={() => setVariant('fallback')}
        >
          정보 없음
        </button>
      </div>
    </div>
  )
}
