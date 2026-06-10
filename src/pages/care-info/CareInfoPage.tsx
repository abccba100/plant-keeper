import { useState } from 'react'
import '../../components/styles/shell.css'
import '../../components/styles/register.css'
import { SvgDefs } from '../../components/plant/PlantSvg'
import { Icon } from '../../components/common/Icon'
import { PageSidebar } from '../../components/layout/PageSidebar'
import { CareFallback, CareHero, CoreCare, DiffGuideRail } from '../../components/care/CareInfoPanels'
import { CARE_PROFILE } from '../../store/careProfile'

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

