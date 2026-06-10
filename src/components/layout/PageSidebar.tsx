import type { CSSProperties } from 'react'
import { PlantAvatar, type PlantKind, type Season } from '../plant/PlantSvg'
import { Icon, type IconName } from '../common/Icon'
import { navigate } from '../../api/navigation'

interface SidebarPlant {
  name: string
  tone: string
  kind: PlantKind
}

const MOCK_PLANTS: SidebarPlant[] = [
  { name: '몬스테라', tone: '#71986f', kind: 'monstera' },
  { name: '스파티필름', tone: '#789671', kind: 'peace' },
  { name: '산세베리아', tone: '#2f9aa3', kind: 'sansevieria' },
  { name: '필레아 페페', tone: '#f0a21d', kind: 'peperomia' },
]

interface NavItem {
  icon: IconName
  label: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'scan',     label: '식물 판별',      path: '/register'  },
  { icon: 'clock',   label: '기본 관리 정보',   path: '/care-info' },
  { icon: 'search',  label: '식물 상태 분석',   path: '/analyze'   },
  { icon: 'calendar',label: '관리 캘린더',      path: '/'          },
]

interface Props {
  season?: Season
  activePath?: string
}

export function PageSidebar({ season = 'spring', activePath }: Props) {
  const current = activePath ?? window.location.pathname

  return (
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
          <button aria-label="식물 추가">
            <Icon name="plus" style={{ width: 14, height: 14 }} />
          </button>
        </h2>
        {MOCK_PLANTS.map((plant) => (
          <div
            className="plant-line"
            key={plant.name}
            style={{ '--tone': plant.tone } as CSSProperties}
          >
            <PlantAvatar kind={plant.kind} season={season} />
            <span>{plant.name}</span>
            <i className="dot" />
          </div>
        ))}
      </section>

      <div className="settings">
        <Icon name="clock" style={{ width: 15, height: 15 }} />
        설정
      </div>
    </aside>
  )
}
