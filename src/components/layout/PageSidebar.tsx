import { useState, type CSSProperties, type FormEvent } from 'react'
import { PlantAvatar, type Season } from '../plant/PlantSvg'
import { Icon, type IconName } from '../common/Icon'
import { navigate } from '../../api/navigation'
import { useThemeStore } from '../../store/themeStore'
import { usePlantStore } from '../../store/plantStore'
import { getPlantTone, plantKinds } from '../../store/plantData'

interface NavItem {
  icon: IconName
  label: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'home',    label: '오늘의 관리',      path: '/'          },
  { icon: 'calendar',label: '관리 캘린더',      path: '/calendar'  },
  { icon: 'scan',    label: '식물 판별',        path: '/register'  },
  { icon: 'search',  label: '식물 상태 분석',   path: '/analyze'   },
]

interface Props {
  season?: Season
  activePath?: string
}

export function PageSidebar({ season = 'spring', activePath }: Props) {
  const current = activePath ?? window.location.pathname
  const isNightMode = useThemeStore((state) => state.isNightMode)
  const toggleNightMode = useThemeStore((state) => state.toggleNightMode)
  const plants = usePlantStore((state) => state.plants)
  const addPlant = usePlantStore((state) => state.addPlant)
  const [addOpen, setAddOpen] = useState(false)
  const [plantName, setPlantName] = useState('')
  const nextKind = plantKinds[plants.length % plantKinds.length]

  function closeAddModal() {
    setAddOpen(false)
    setPlantName('')
  }

  function handleDirectAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = plantName.trim()
    if (!name) {
      return
    }

    addPlant({
      name,
      kind: nextKind,
      tone: getPlantTone(nextKind),
    })
    closeAddModal()
  }

  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-row">
            <svg className="brand-mark" viewBox="0 0 28 28" aria-hidden="true">
              <path d="M6 22C6 12 12 6 23 6c0 10-6 16-17 16z" fill="var(--accent)" opacity="0.92" />
              <path d="M6 22C10 15 15 12 20 9.5" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
            <strong>Plant Keeper</strong>
          </div>
          <small>나의 식물 관리 다이어리</small>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${current === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <section className="my-plants">
          <h2>
            내 식물
            <button type="button" aria-label="식물 추가" onClick={() => setAddOpen(true)}>
              <Icon name="plus" style={{ width: 14, height: 14 }} />
            </button>
          </h2>
          {plants.map((plant) => (
            <div
              className="plant-line"
              key={plant.id}
              style={{ '--tone': plant.tone } as CSSProperties}
            >
              <PlantAvatar kind={plant.kind} season={season} />
              <span>{plant.name}</span>
              <i className="dot" />
            </div>
          ))}
        </section>

        <div className="settings">
          <button
            type="button"
            className="theme-toggle"
            aria-pressed={isNightMode}
            onClick={toggleNightMode}
          >
            <span className="theme-toggle-icon">
              <Icon name={isNightMode ? 'moon' : 'sun'} />
            </span>
            <span className="theme-toggle-copy">
              <span>{isNightMode ? '밤 모드' : '낮 모드'}</span>
              <small>{isNightMode ? '차분한 밤 정원' : '밝은 정원'}</small>
            </span>
            <span className="theme-toggle-track" aria-hidden="true">
              <i />
            </span>
          </button>
        </div>
      </aside>

      {addOpen ? (
        <div className="plant-add-overlay" onClick={closeAddModal}>
          <form className="plant-add-modal" onSubmit={handleDirectAdd} onClick={(event) => event.stopPropagation()}>
            <button className="plant-add-close" type="button" aria-label="닫기" onClick={closeAddModal}>
              <Icon name="x" />
            </button>
            <span className="plant-add-icon">
              <PlantAvatar kind={nextKind} season={season} />
            </span>
            <h2>식물 추가</h2>
            <label>
              식물 이름
              <input
                autoFocus
                value={plantName}
                onChange={(event) => setPlantName(event.target.value)}
                placeholder="예: 거실 몬스테라"
              />
            </label>
            <div className="plant-add-actions">
              <button className="btn-ghost" type="button" onClick={closeAddModal}>취소</button>
              <button className="btn-primary" type="submit" disabled={plantName.trim().length === 0}>추가</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  )
}
