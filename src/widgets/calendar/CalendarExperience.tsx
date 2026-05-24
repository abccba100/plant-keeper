import type { CSSProperties } from 'react'
import styled from '@emotion/styled'
import { getCalendarDays, seasonMeta, seasonOrder, weekdays, type CalendarDay, type Season } from '../../entities/calendar/model/calendar'
import { plants, type Plant } from '../../entities/plant/model/plant'
import { useCalendarStore } from '../../features/calendar/model/useCalendarStore'
import { radii, seasonTheme, shadows } from '../../shared/design-system/tokens'
import { CanopyAtmosphere } from './atmosphere/CanopyAtmosphere'

const navItems = [
  { icon: '↥', label: '식물 이미지 업로드' },
  { icon: '◎', label: 'AI 식물 인식' },
  { icon: '◷', label: '기본 관리 정보' },
  { icon: '✎', label: '식물 상태 입력' },
  { icon: '⌕', label: '상태 진단 결과' },
  { icon: '⌘', label: '내 식물 등록' },
]

export function CalendarExperience() {
  const season = useCalendarStore((state) => state.season)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const showDetail = useCalendarStore((state) => state.showDetail)
  const closeDetail = useCalendarStore((state) => state.closeDetail)
  const days = getCalendarDays(season, selectedDate)
  const selectedDay = days.find((day) => day.inMonth && day.date === selectedDate)

  return (
    <Shell season={season}>
      <CanopyAtmosphere season={season} />
      <Sidebar />
      <Workspace>
        <CalendarMain season={season} days={days} />
        <RightRail season={season} />
      </Workspace>
      {showDetail && selectedDay ? <DayDetail season={season} day={selectedDay} onClose={closeDetail} /> : null}
    </Shell>
  )
}

function Sidebar() {
  return (
    <SidebarFrame>
      <Brand>
        <span className="brand-leaf" />
        <strong>Plant Keeper</strong>
        <small>나의 식물 관리 다이어리</small>
      </Brand>
      <Nav>
        {navItems.map((item) => (
          <NavItem key={item.label}>
            <NavIcon aria-hidden="true">{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}
        <NavItem active>
          <NavIcon aria-hidden="true" active>
            ▣
          </NavIcon>
          관리 캘린더
        </NavItem>
        <NavItem>
          <NavIcon aria-hidden="true">□</NavIcon>
          일정 상세 보기
        </NavItem>
      </Nav>
      <MyPlantCard>
        <h2>
          내 식물 <span>＋</span>
        </h2>
        {plants.map((plant) => (
          <PlantLine key={plant.name} style={{ '--tone': plant.tone } as CSSProperties}>
            <PlantAvatar plant={plant} />
            <span>{plant.name}</span>
            <i />
          </PlantLine>
        ))}
      </MyPlantCard>
      <Settings>설정</Settings>
    </SidebarFrame>
  )
}

function CalendarMain({ season, days }: { season: Season; days: CalendarDay[] }) {
  const setSeason = useCalendarStore((state) => state.setSeason)

  return (
    <CalendarArea>
      <TopBar>
        <h1>관리 캘린더</h1>
        <IconControls aria-label="View controls">
          <IconButton type="button" aria-label="Calendar view">
            ◴
          </IconButton>
          <IconButton type="button" aria-label="List view">
            ☰
          </IconButton>
        </IconControls>
      </TopBar>
      <Toolbar>
        <MonthControls>
          <ArrowButton type="button" aria-label="Previous month">
            ‹
          </ArrowButton>
          <MonthButton type="button">
            <strong>{seasonMeta[season].month}</strong>
          </MonthButton>
          <ArrowButton type="button" aria-label="Next month">
            ›
          </ArrowButton>
        </MonthControls>
        <SoftButton type="button">오늘</SoftButton>
        <ToolbarSpacer />
        <SoftButton type="button">모든 식물⌄</SoftButton>
        <SoftButton type="button">월간 보기⌄</SoftButton>
        <SeasonTabs>
          {seasonOrder.map((seasonKey) => (
            <SeasonTab key={seasonKey} type="button" active={season === seasonKey} seasonKey={seasonKey} onClick={() => setSeason(seasonKey)}>
              <span aria-hidden="true" />
              {seasonMeta[seasonKey].label}
            </SeasonTab>
          ))}
        </SeasonTabs>
      </Toolbar>
      <CalendarFrame>
        <WeekHeader>
          {weekdays.map((weekday, index) => (
            <Weekday key={weekday} sunday={index === 6}>
              {weekday}
            </Weekday>
          ))}
        </WeekHeader>
        <CalendarGrid>
          {days.map((day, index) => (
            <CalendarCell key={`${day.date}-${index}`} season={season} day={day} />
          ))}
        </CalendarGrid>
      </CalendarFrame>
    </CalendarArea>
  )
}

function CalendarCell({ season, day }: { season: Season; day: CalendarDay }) {
  const selectDate = useCalendarStore((state) => state.selectDate)

  return (
    <DayCell season={season} day={day} type="button" onClick={() => day.inMonth && selectDate(day.date)} aria-label={`${day.date}일`}>
      {day.isToday ? <TodayBadge>오늘</TodayBadge> : null}
      <DateText day={day}>{day.date}</DateText>
      <Landscape season={season} day={day}>
        <CellGarden season={season} day={day} />
      </Landscape>
    </DayCell>
  )
}

function CellGarden({ season, day }: { season: Season; day: CalendarDay }) {
  const displayPlants = day.plants.slice(0, day.density === 0 ? 1 : day.density === 1 ? 2 : 3)

  return (
    <CellGardenScene season={season} day={day}>
      <span className="scene-glow" />
      <span className="season-sprinkles" />
      <CellSoil season={season} day={day}>
        <span className="soil-shine" />
        <span className="puddle" />
      </CellSoil>
      {displayPlants.map((plant, index) => (
        <CellPlant key={`${plant.name}-${index}`} plant={plant} index={index} total={displayPlants.length} growth={day.growth} muted={!day.inMonth} />
      ))}
      {displayPlants.length === 0 ? <TinySprout season={season} /> : null}
    </CellGardenScene>
  )
}

function CellPlant({
  plant,
  index,
  total,
  growth,
  muted,
}: {
  plant: Plant
  index: number
  total: number
  growth: CalendarDay['growth']
  muted: boolean
}) {
  const slots = total === 1 ? [50] : total === 2 ? [36, 64] : [27, 52, 73]
  const scale = 0.56 + growth * 0.058 + (plant.kind === 'monstera' ? 0.09 : plant.kind === 'sansevieria' ? 0.03 : 0)

  return (
    <CellPlantNode
      plant={plant}
      muted={muted}
      style={
        {
          '--x': `${slots[index] ?? 50}%`,
          '--scale': scale,
          '--delay': `${index * -0.9}s`,
        } as CSSProperties
      }
    >
      <span className="pot" />
      <span className="pot-lip" />
      <span className="stem stem-a" />
      <span className="stem stem-b" />
      <span className="stem stem-c" />
      {Array.from({ length: 6 }, (_, leafIndex) => (
        <span key={leafIndex} className={`leaf leaf-${leafIndex + 1}`} />
      ))}
      <span className="bloom bloom-a" />
      <span className="bloom bloom-b" />
    </CellPlantNode>
  )
}

function RightRail({ season }: { season: Season }) {
  return (
    <RightPanel>
      <RailCard>
        <h2>식물 목록</h2>
        {plants.map((plant) => (
          <PlantLine key={plant.name} style={{ '--tone': plant.tone } as CSSProperties}>
            <PlantAvatar plant={plant} />
            <span>{plant.name}</span>
            <i />
          </PlantLine>
        ))}
        <AddMore>+2 추가</AddMore>
      </RailCard>
      <RailCard>
        <h2>이번 달 요약</h2>
        {plants.map((plant) => (
          <PlantLine key={`summary-${plant.name}`} style={{ '--tone': plant.tone } as CSSProperties}>
            <PlantAvatar plant={plant} />
            <span>{plant.name}</span>
            <span>-</span>
          </PlantLine>
        ))}
      </RailCard>
      <TipCard season={season}>
        <h2>{seasonMeta[season].tipTitle}</h2>
        <p>{seasonMeta[season].tip}</p>
        <TipGarden>
          <SoilBand season={season} day={{ inMonth: true, moisture: 'balanced' } as CalendarDay} />
          <PottedPlant plant={plants[0]} index={0} total={2} growth={2} muted={false} />
          <PottedPlant plant={plants[2]} index={1} total={2} growth={3} muted={false} />
        </TipGarden>
      </TipCard>
    </RightPanel>
  )
}

function DayDetail({ season, day, onClose }: { season: Season; day: CalendarDay; onClose: () => void }) {
  return (
    <DetailPanel season={season}>
      <DetailClose type="button" onClick={onClose} aria-label="상세 닫기">
        ×
      </DetailClose>
      <h2>
        {seasonMeta[season].month} {day.date}일
      </h2>
      <SeasonLine season={season}>
        <span />
        {seasonMeta[season].label}
      </SeasonLine>
      <DetailScene>
        <SoilBand season={season} day={{ ...day, inMonth: true }} />
        {day.plants.map((plant, index) => (
          <PottedPlant key={`detail-${plant.name}-${index}`} plant={plant} index={index} total={day.plants.length} growth={3} muted={false} />
        ))}
      </DetailScene>
      <DetailSection>
        <h3>이 날의 식물 상태</h3>
        {day.plants.map((plant) => (
          <DetailPlant key={`detail-line-${plant.name}`} style={{ '--tone': plant.tone } as CSSProperties}>
            <PlantAvatar plant={plant} />
            <span>{plant.name}</span>
            <i />
            <MiniScene>
              <SoilBand season={season} day={{ ...day, inMonth: true }} />
              <PottedPlant plant={plant} index={0} total={1} growth={2} muted={false} />
            </MiniScene>
          </DetailPlant>
        ))}
      </DetailSection>
      <DetailSection>
        <h3>메모</h3>
        <Memo>새 잎이 많이 올라오고 있어요. 창가 쪽으로 위치를 옮겨줬어요.</Memo>
      </DetailSection>
    </DetailPanel>
  )
}

function PottedPlant({
  plant,
  index,
  total,
  growth,
  muted,
}: {
  plant: Plant
  index: number
  total: number
  growth: CalendarDay['growth']
  muted: boolean
}) {
  const slots = total === 1 ? [50] : total === 2 ? [35, 65] : [24, 52, 78]
  const scale = 0.72 + growth * 0.055 + (plant.kind === 'monstera' ? 0.08 : 0)

  return (
    <PlantNode
      plant={plant}
      muted={muted}
      style={
        {
          '--x': `${slots[index] ?? 50}%`,
          '--scale': scale,
        } as CSSProperties
      }
    >
      <span className="pot" />
      <span className="stem stem-a" />
      <span className="stem stem-b" />
      {Array.from({ length: 6 }, (_, leafIndex) => (
        <span key={leafIndex} className={`leaf leaf-${leafIndex + 1}`} />
      ))}
      <span className="flower flower-a" />
      <span className="flower flower-b" />
    </PlantNode>
  )
}

function PlantAvatar({ plant }: { plant: Plant }) {
  return (
    <Avatar plant={plant}>
      <span className="pot" />
      <span className="leaf leaf-a" />
      <span className="leaf leaf-b" />
      <span className="leaf leaf-c" />
    </Avatar>
  )
}

const Shell = styled.div<{ season: Season }>`
  --accent: ${({ season }) => seasonTheme[season].accent};
  --accent-soft: ${({ season }) => seasonTheme[season].accentSoft};
  --surface: ${({ season }) => seasonTheme[season].surface};
  --line: ${({ season }) => seasonTheme[season].line};
  --muted-line: ${({ season }) => seasonTheme[season].mutedLine};
  --control-surface: ${({ season }) => seasonTheme[season].controlSurface};
  --control-line: ${({ season }) => seasonTheme[season].controlLine};
  --calendar-surface: ${({ season }) => seasonTheme[season].calendarSurface};
  --grid-line: ${({ season }) => seasonTheme[season].gridLine};
  --selected-cell: ${({ season }) => seasonTheme[season].selectedCell};
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  background: ${({ season }) => seasonTheme[season].pageBackground};
  color: #151815;
  isolation: isolate;

  @media (max-width: 1180px) {
    grid-template-columns: 190px minmax(0, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const SidebarFrame = styled.aside`
  position: sticky;
  top: 0;
  z-index: 4;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 30px 13px;
  border-right: 1px solid var(--control-line);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.68), rgba(255, 255, 255, 0.48)),
    var(--control-surface);
  backdrop-filter: blur(20px);
  box-shadow: 18px 0 42px rgba(63, 58, 46, 0.055);

  @media (max-width: 900px) {
    position: relative;
    height: auto;
    padding: 22px 16px 14px;
    border-right: 0;
    border-bottom: 1px solid var(--control-line);
  }
`

const Brand = styled.div`
  position: relative;
  padding: 0 12px 24px;
  border-bottom: 1px solid rgba(82, 88, 68, 0.12);

  .brand-leaf {
    display: block;
    width: 22px;
    height: 24px;
    margin-bottom: 8px;
    background:
      radial-gradient(ellipse at 34% 40%, #366c3f 0 29%, transparent 30%),
      radial-gradient(ellipse at 68% 30%, #6a9b62 0 28%, transparent 29%);
  }

  strong {
    display: block;
    color: var(--accent);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 25px;
    line-height: 1.05;
    white-space: nowrap;
  }

  small {
    display: block;
    margin-top: 9px;
    color: #313931;
    font-size: 13px;
  }
`

const Nav = styled.nav`
  display: grid;
  gap: 6px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const NavItem = styled.button<{ active?: boolean }>`
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ active }) => (active ? 'color-mix(in srgb, var(--accent) 38%, transparent)' : 'transparent')};
  border-radius: ${radii.control};
  color: ${({ active }) => (active ? '#ffffff' : '#151a16')};
  background: ${({ active }) => (active ? 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 92%, #ffffff 8%), var(--accent))' : 'transparent')};
  box-shadow: ${({ active }) => (active ? shadows.soft : 'none')};
  font-size: 14px;
  text-align: left;
  cursor: default;
`

const NavIcon = styled.span<{ active?: boolean }>`
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  color: currentColor;
  font-size: 18px;
  line-height: 1;
  opacity: ${({ active }) => (active ? 0.95 : 0.78)};
`

const MyPlantCard = styled.section`
  margin-top: 32px;
  padding: 16px 14px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.panel};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.42)),
    var(--control-surface);
  box-shadow: 0 12px 28px rgba(59, 54, 44, 0.045);

  h2 {
    display: flex;
    justify-content: space-between;
    margin: 0 0 14px;
    font-size: 15px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`

const Settings = styled.div`
  margin-top: auto;
  padding: 24px 12px 0;
  border-top: 1px solid var(--control-line);
  color: #1d241f;
  font-size: 14px;

  @media (max-width: 900px) {
    display: none;
  }
`

const Workspace = styled.main`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(760px, 1fr) 156px;
  gap: 18px;
  min-width: 0;
  padding: 30px 15px 24px 20px;

  @media (max-width: 1180px) {
    grid-template-columns: minmax(0, 1fr);
    padding-right: 20px;
  }

  @media (max-width: 900px) {
    padding: 20px 12px 24px;
  }
`

const CalendarArea = styled.section`
  min-width: 0;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 25px;
    line-height: 1;
    letter-spacing: 0;
  }
`

const IconControls = styled.div`
  display: flex;
  gap: 8px;
`

const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid var(--control-line);
  border-radius: ${radii.control};
  background: var(--control-surface);
  box-shadow:
    0 8px 18px rgba(72, 67, 53, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  color: #172018;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  min-width: 0;

  @media (max-width: 1120px) {
    flex-wrap: wrap;
  }
`

const MonthControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
`

const ArrowButton = styled.button`
  display: grid;
  place-items: center;
  width: 38px;
  height: 42px;
  padding: 0;
  border: 1px solid var(--control-line);
  border-radius: ${radii.control};
  color: #141814;
  background: var(--control-surface);
  box-shadow:
    0 8px 18px rgba(72, 67, 53, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  font-size: 25px;
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`

const MonthButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 164px;
  height: 42px;
  padding: 0 16px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.control};
  background: var(--control-surface);
  box-shadow:
    0 8px 20px rgba(72, 67, 53, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  cursor: pointer;

  strong {
    font-size: 19px;
    line-height: 1;
    white-space: nowrap;
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`

const SoftButton = styled.button`
  min-width: 64px;
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.control};
  color: #1b201b;
  background: var(--control-surface);
  box-shadow:
    0 8px 20px rgba(72, 67, 53, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`

const ToolbarSpacer = styled.span`
  flex: 1;

  @media (max-width: 1120px) {
    display: none;
  }
`

const SeasonTabs = styled.div`
  display: flex;
  overflow: hidden;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid var(--control-line);
  border-radius: ${radii.control};
  background: var(--control-surface);
  box-shadow:
    0 8px 20px rgba(72, 67, 53, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);

  @media (max-width: 760px) {
    width: 100%;
    overflow-x: auto;
  }
`

const SeasonTab = styled.button<{ active?: boolean; seasonKey: Season }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 78px;
  padding: 0 10px;
  border: 0;
  border-left: 1px solid var(--control-line);
  color: ${({ active }) => (active ? '#ffffff' : '#20261f')};
  background: ${({ active }) => (active ? 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 88%, #ffffff 12%), var(--accent))' : 'transparent')};
  box-shadow: ${({ active }) => (active ? 'inset 0 1px 0 rgba(255,255,255,0.24)' : 'none')};
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -3px;
  }

  &:first-of-type {
    border-left: 0;
  }

  span {
    flex: 0 0 auto;
    width: 13px;
    height: 13px;
    border: 1px solid ${({ active }) => (active ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.38)')};
    border-radius: ${({ seasonKey }) => (seasonKey === 'autumn' ? '55% 8% 60% 10%' : '50%')};
    background: ${({ seasonKey }) => seasonTheme[seasonKey].accent};
  }
`

const CalendarFrame = styled.div`
  overflow: hidden;
  border: 1px solid var(--grid-line);
  border-radius: ${radii.panel};
  background: var(--calendar-surface);
  box-shadow:
    0 18px 44px color-mix(in srgb, var(--accent) 14%, rgba(58, 52, 42, 0.07)),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(13px);
`

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  height: 44px;
  border-bottom: 1px solid var(--grid-line);
  background: var(--grid-line);
`

const Weekday = styled.div<{ sunday?: boolean }>`
  display: grid;
  place-items: center;
  color: ${({ sunday }) => (sunday ? '#e12b2b' : '#151815')};
  background: color-mix(in srgb, var(--surface) 74%, rgba(255, 255, 255, 0.68));
  font-weight: 700;
  font-size: 14px;
`

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  background: var(--grid-line);
`

const DayCell = styled.button<{ season: Season; day: CalendarDay }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: clamp(111px, 12.55vh, 132px);
  padding: 13px 12px 0;
  border: 0;
  background: ${({ day, season }) => (day.isSelected ? seasonTheme[season].selectedCell : seasonTheme[season].cellLight)};
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    inset 0 -28px 36px rgba(88, 72, 51, 0.022);

  &:hover {
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.76), var(--accent-soft)),
      ${({ season }) => seasonTheme[season].cellLight};
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -3px;
    z-index: 2;
  }

  ${({ day }) =>
    day.isSelected
      ? `
    box-shadow:
      inset 0 0 0 2px var(--accent),
      inset 0 0 34px color-mix(in srgb, var(--accent) 18%, transparent),
      0 0 0 1px rgba(255, 255, 255, 0.76);
    z-index: 1;
  `
      : ''}

  ${({ day }) =>
    !day.inMonth
      ? `
    color: #aaa9a1;
  `
      : ''}

  @media (max-width: 760px) {
    min-height: 92px;
    padding: 9px 7px 0;
  }
`

const DateText = styled.span<{ day: CalendarDay }>`
  position: relative;
  z-index: 3;
  display: inline-grid;
  place-items: center;
  margin-left: ${({ day }) => (day.isToday ? '39px' : '0')};
  min-width: ${({ day }) => (day.isToday ? '33px' : 'auto')};
  height: ${({ day }) => (day.isToday ? '33px' : 'auto')};
  border-radius: 50%;
  color: ${({ day }) => (day.isToday ? '#ffffff' : day.isSunday ? '#ff2323' : day.inMonth ? '#111711' : '#aaa9a1')};
  background: ${({ day }) => (day.isToday ? 'var(--accent)' : 'transparent')};
  box-shadow: ${({ day }) => (day.isToday ? '0 7px 14px color-mix(in srgb, var(--accent) 28%, transparent)' : 'none')};
  font-size: 17px;
  font-weight: 700;

  @media (max-width: 760px) {
    margin-left: ${({ day }) => (day.isToday ? '30px' : '0')};
    min-width: ${({ day }) => (day.isToday ? '28px' : 'auto')};
    height: ${({ day }) => (day.isToday ? '28px' : 'auto')};
    font-size: 14px;
  }
`

const TodayBadge = styled.span`
  position: absolute;
  z-index: 4;
  top: 13px;
  left: 12px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;

  @media (max-width: 760px) {
    top: 11px;
    left: 7px;
    font-size: 10px;
  }
`

const Landscape = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  z-index: 1;
  height: 88px;
  opacity: ${({ day }) => (day.inMonth ? 1 : 0.36)};
  transform: translateZ(0);

  &::before {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 54px;
    background:
      radial-gradient(ellipse at 50% 94%, rgba(55, 42, 29, 0.13), transparent 58%),
      radial-gradient(ellipse at 52% 82%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 18%, transparent), transparent 68%),
      ${({ season }) => seasonTheme[season].particle};
    background-size:
      auto,
      54px 18px;
    mix-blend-mode: multiply;
    opacity: ${({ season }) => (season === 'winter' ? 0.34 : 0.52)};
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 22px;
    background:
      linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.3)),
      linear-gradient(90deg, transparent, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 14%, transparent), transparent);
    opacity: ${({ day }) => (day.inMonth ? 0.26 : 0.45)};
  }

  @media (max-width: 760px) {
    height: 70px;
  }
`

const CellGardenScene = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  inset: 0;
  opacity: ${({ day }) => (day.inMonth ? 1 : 0.42)};

  .scene-glow {
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: 5px;
    height: 54px;
    background:
      radial-gradient(ellipse at 50% 92%, rgba(92, 66, 39, 0.14), transparent 54%),
      radial-gradient(ellipse at 54% 54%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 24%, transparent), transparent 64%);
    mix-blend-mode: screen;
    opacity: ${({ season }) => (season === 'winter' ? 0.56 : 0.84)};
  }

  .season-sprinkles {
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 9px;
    height: 19px;
    border-radius: 50%;
    background: ${({ season }) =>
      season === 'spring'
        ? `
          radial-gradient(circle at 12% 62%, rgba(245, 151, 165, .7) 0 2px, transparent 3px),
          radial-gradient(circle at 76% 42%, rgba(255, 201, 209, .72) 0 2px, transparent 3px),
          radial-gradient(circle at 88% 68%, rgba(235, 162, 173, .52) 0 2px, transparent 3px)`
        : season === 'autumn'
          ? `
          radial-gradient(ellipse at 14% 62%, rgba(205, 103, 32, .72) 0 5px, transparent 6px),
          radial-gradient(ellipse at 70% 44%, rgba(230, 148, 43, .68) 0 5px, transparent 6px),
          radial-gradient(ellipse at 92% 68%, rgba(136, 77, 32, .48) 0 4px, transparent 5px)`
          : season === 'winter'
            ? `
          radial-gradient(circle at 14% 55%, rgba(255,255,255,.95) 0 4px, transparent 5px),
          radial-gradient(circle at 74% 44%, rgba(235,244,249,.9) 0 5px, transparent 6px),
          radial-gradient(circle at 90% 65%, rgba(255,255,255,.78) 0 4px, transparent 5px)`
            : `
          radial-gradient(circle at 18% 58%, rgba(70, 112, 47, .3) 0 2px, transparent 3px),
          radial-gradient(circle at 76% 44%, rgba(125, 151, 67, .32) 0 2px, transparent 3px)`};
    background-size: 48px 18px;
    opacity: ${({ season }) => (season === 'summer' ? 0.46 : 0.72)};
    mix-blend-mode: multiply;
  }
`

const CellSoil = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  left: 7px;
  right: 7px;
  bottom: 9px;
  height: ${({ season }) => (season === 'winter' ? '18px' : '20px')};
  border-radius: 48% 52% 30% 30%;
  background: ${({ season, day }) =>
    season === 'winter'
      ? 'linear-gradient(180deg, rgba(255,255,255,.95), rgba(232,240,245,.84) 45%, rgba(120,105,88,.3) 76%, rgba(255,255,255,.72))'
      : day.moisture === 'wet'
        ? 'linear-gradient(180deg, rgba(108, 89, 63, .3), rgba(72, 52, 36, .78) 54%, rgba(40, 53, 49, .66))'
        : day.moisture === 'dry'
          ? 'linear-gradient(180deg, rgba(196, 151, 91, .45), rgba(131, 84, 49, .72) 56%, rgba(86, 55, 37, .58))'
          : 'linear-gradient(180deg, rgba(154, 111, 69, .42), rgba(99, 67, 43, .78) 56%, rgba(70, 48, 35, .58))'};
  box-shadow:
    inset 0 4px 8px rgba(255, 255, 255, 0.18),
    0 5px 8px rgba(60, 45, 31, 0.13);

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 12% 58%, rgba(43, 31, 21, .28) 0 2px, transparent 3px),
      radial-gradient(circle at 27% 43%, rgba(236, 219, 186, .28) 0 2px, transparent 3px),
      radial-gradient(circle at 45% 64%, rgba(62, 42, 27, .22) 0 2px, transparent 3px),
      radial-gradient(circle at 66% 48%, rgba(226, 200, 158, .24) 0 2px, transparent 3px),
      radial-gradient(circle at 84% 62%, rgba(45, 32, 23, .2) 0 2px, transparent 3px);
    background-size: 54px 15px;
    opacity: ${({ season }) => (season === 'winter' ? 0.36 : 0.88)};
    mix-blend-mode: multiply;
  }

  &::after {
    top: -3px;
    height: 8px;
    background: ${({ season }) =>
      season === 'winter'
        ? 'linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)'
        : 'linear-gradient(90deg, transparent, rgba(255, 214, 182, .22), transparent)'};
    opacity: 0.84;
    mix-blend-mode: screen;
  }

  .soil-shine {
    position: absolute;
    left: 10%;
    right: 10%;
    top: 2px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.28);
    opacity: ${({ day }) => (day.moisture === 'dry' ? 0.18 : 0.4)};
  }

  .puddle {
    position: absolute;
    left: 33%;
    bottom: 3px;
    width: 30px;
    height: 7px;
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 50%, rgba(45, 91, 103, .58), rgba(37, 66, 65, .06) 72%);
    opacity: ${({ day, season }) => (day.moisture === 'wet' && season !== 'winter' ? 0.86 : 0)};
  }
`

const CellPlantNode = styled.span<{ plant: Plant; muted: boolean }>`
  position: absolute;
  left: var(--x);
  bottom: 18px;
  z-index: 2;
  width: 38px;
  height: 58px;
  transform: translateX(-50%) scale(var(--scale));
  transform-origin: 50% 100%;
  opacity: ${({ muted }) => (muted ? 0.5 : 1)};
  animation: breathe 6.8s ease-in-out infinite;
  animation-delay: var(--delay);

  .pot {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: ${({ plant }) => (plant.kind === 'monstera' ? '18px' : '16px')};
    height: 14px;
    border-radius: 4px 4px 8px 8px;
    background: ${({ plant }) =>
      plant.kind === 'peperomia'
        ? 'linear-gradient(135deg, #cf813e, #8b5330)'
        : plant.kind === 'sansevieria'
          ? 'linear-gradient(135deg, #efe8d7, #9c8f73)'
          : plant.kind === 'peace'
            ? 'linear-gradient(135deg, #f7f1e5, #b89668)'
            : 'linear-gradient(135deg, #fff4e5, #9b8064)'};
    box-shadow:
      inset 0 -5px 7px rgba(54, 35, 20, .16),
      0 4px 6px rgba(45, 33, 23, .12);
    transform: translateX(-50%);
  }

  .pot-lip {
    position: absolute;
    left: 50%;
    bottom: 12px;
    width: ${({ plant }) => (plant.kind === 'monstera' ? '21px' : '19px')};
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 248, 232, .72);
    box-shadow: inset 0 -2px 3px rgba(80, 55, 35, .13);
    transform: translateX(-50%);
  }

  .stem {
    position: absolute;
    left: 50%;
    bottom: 14px;
    width: 2px;
    height: 23px;
    border-radius: 999px;
    background: linear-gradient(180deg, #6f8f52, #4a6c36);
    transform-origin: bottom center;
  }

  .stem-a { transform: translateX(-50%) rotate(-11deg); }
  .stem-b { transform: translateX(-50%) rotate(10deg); opacity: .74; }
  .stem-c { transform: translateX(-50%) rotate(0deg); opacity: .58; }

  .leaf {
    position: absolute;
    background: ${({ plant }) =>
      plant.kind === 'sansevieria'
        ? 'linear-gradient(90deg, #315f34, #9eb660 48%, #315f34)'
        : plant.kind === 'peperomia'
          ? 'radial-gradient(circle at 42% 34%, #93bd6d, #4f813e 72%)'
          : plant.kind === 'peace'
            ? 'linear-gradient(135deg, #7fa35d, #3f6d38)'
            : 'linear-gradient(135deg, #77a95b, #2f6934)'};
    box-shadow:
      inset -2px -2px 4px rgba(28, 53, 27, .14),
      0 2px 4px rgba(40, 60, 35, .08);
  }

  ${({ plant }) =>
    plant.kind === 'sansevieria'
      ? `
    .stem { display: none; }
    .leaf {
      bottom: 14px;
      left: 50%;
      width: 6px;
      height: 36px;
      border-radius: 85% 85% 16% 16%;
      transform-origin: bottom center;
    }
    .leaf-1 { transform: translateX(-50%) rotate(-22deg); height: 29px; }
    .leaf-2 { transform: translateX(-50%) rotate(-10deg); height: 35px; }
    .leaf-3 { transform: translateX(-50%) rotate(3deg); height: 40px; }
    .leaf-4 { transform: translateX(-50%) rotate(16deg); height: 33px; }
    .leaf-5 { transform: translateX(-50%) rotate(27deg); height: 25px; }
    .leaf-6 { display: none; }
  `
      : plant.kind === 'peperomia'
        ? `
    .leaf {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .leaf-1 { left: 10px; bottom: 31px; transform: rotate(-24deg); }
    .leaf-2 { left: 21px; bottom: 35px; transform: rotate(18deg); }
    .leaf-3 { left: 25px; bottom: 26px; transform: rotate(35deg); }
    .leaf-4 { left: 13px; bottom: 23px; transform: rotate(-4deg); }
    .leaf-5 { left: 19px; bottom: 18px; transform: scale(.86); }
    .leaf-6 { left: 7px; bottom: 20px; transform: scale(.78); }
  `
        : `
    .leaf {
      width: ${plant.kind === 'monstera' ? '16px' : '13px'};
      height: ${plant.kind === 'monstera' ? '15px' : '12px'};
      border-radius: 82% 13% 80% 18%;
      transform-origin: 50% 100%;
    }
    .leaf-1 { left: 8px; bottom: 30px; transform: rotate(-36deg); }
    .leaf-2 { left: 18px; bottom: 36px; transform: rotate(15deg); }
    .leaf-3 { left: 23px; bottom: 26px; transform: rotate(42deg); }
    .leaf-4 { left: 12px; bottom: 21px; transform: rotate(-12deg); }
    .leaf-5 { left: 18px; bottom: 18px; transform: rotate(62deg) scale(.88); }
    .leaf-6 { left: 6px; bottom: 18px; transform: rotate(-58deg) scale(.82); }
  `}

  .bloom {
    position: absolute;
    display: ${({ plant }) => (plant.kind === 'peace' ? 'block' : 'none')};
    width: 9px;
    height: 15px;
    border-radius: 70% 30% 70% 30%;
    background: linear-gradient(135deg, #fffdf1, #e6dfc9);
    box-shadow: 0 2px 5px rgba(70, 64, 45, .08);
  }

  .bloom-a { left: 18px; bottom: 39px; transform: rotate(18deg); }
  .bloom-b { left: 30px; bottom: 31px; transform: rotate(-18deg) scale(.82); }
`

const TinySprout = styled.span<{ season: Season }>`
  position: absolute;
  left: 50%;
  bottom: 28px;
  z-index: 2;
  width: 20px;
  height: 24px;
  transform: translateX(-50%);

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    width: 11px;
    height: 9px;
    border-radius: 80% 10% 80% 18%;
    background: ${({ season }) => (season === 'winter' ? '#9eb39a' : '#83ad67')};
  }

  &::before {
    left: 2px;
    transform: rotate(-36deg);
  }

  &::after {
    right: 2px;
    transform: rotate(38deg) scaleX(-1);
  }
`

const SoilBand = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 8px;
  height: 22px;
  border-radius: 50% 50% 22% 22%;
  background:
    ${({ day, season }) =>
      day.moisture === 'wet' ? seasonTheme[season].wetSoil : day.moisture === 'dry' ? seasonTheme[season].drySoil : seasonTheme[season].soil};
  box-shadow:
    inset 0 4px 10px rgba(255, 255, 255, 0.2),
    0 5px 8px rgba(65, 48, 34, 0.12);
  opacity: ${({ day }) => (day.inMonth ? 1 : 0.34)};

  .texture,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 12% 58%, rgba(47, 33, 24, 0.24) 0 2px, transparent 3px),
      radial-gradient(circle at 28% 36%, rgba(219, 203, 174, 0.22) 0 2px, transparent 3px),
      radial-gradient(circle at 58% 45%, rgba(34, 24, 18, 0.18) 0 2px, transparent 3px),
      ${({ season }) => seasonTheme[season].particle};
    background-size:
      56px 15px,
      48px 17px,
      42px 14px,
      36px 14px;
    mix-blend-mode: multiply;
    opacity: ${({ season }) => (season === 'winter' ? 0.45 : 0.78)};
  }

  .puddle {
    position: absolute;
    left: 34%;
    bottom: 3px;
    width: 34px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 50%, rgba(40, 77, 83, 0.52), rgba(31, 55, 56, 0.05) 70%);
    opacity: ${({ day }) => (day.moisture === 'wet' ? 0.82 : 0)};
  }
`

const PlantNode = styled.span<{ plant: Plant; muted: boolean }>`
  position: absolute;
  left: var(--x);
  bottom: 4px;
  width: 44px;
  height: 58px;
  transform: translateX(-50%) scale(var(--scale));
  transform-origin: 50% 100%;
  opacity: ${({ muted }) => (muted ? 0.42 : 1)};
  animation: breathe 7s ease-in-out infinite;

  .pot {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: ${({ plant }) => (plant.kind === 'monstera' ? '19px' : '17px')};
    height: 14px;
    border-radius: 4px 4px 7px 7px;
    background: ${({ plant }) =>
      plant.kind === 'peperomia'
        ? 'linear-gradient(135deg, #b46d35, #7d4d30)'
        : plant.kind === 'sansevieria'
          ? 'linear-gradient(135deg, #d9d5c2, #8b8067)'
          : 'linear-gradient(135deg, #f1eadc, #9b8669)'};
    box-shadow:
      inset 0 -5px 8px rgba(47, 34, 24, 0.18),
      0 4px 5px rgba(43, 33, 23, 0.12);
    transform: translateX(-50%);
  }

  .stem {
    position: absolute;
    left: 50%;
    bottom: 12px;
    width: 2px;
    height: 24px;
    border-radius: ${radii.round};
    background: #58743e;
    transform-origin: bottom center;
  }

  .stem-a {
    transform: translateX(-50%) rotate(-8deg);
  }

  .stem-b {
    transform: translateX(-50%) rotate(10deg);
    opacity: 0.72;
  }

  .leaf {
    position: absolute;
    background: ${({ plant }) =>
      plant.kind === 'peace'
        ? 'linear-gradient(135deg, #6f8f52, #375f35)'
        : plant.kind === 'sansevieria'
          ? 'linear-gradient(90deg, #2e6032, #88a85c 48%, #315f33)'
          : 'linear-gradient(135deg, #6a9852, #2f6934)'};
    box-shadow: inset -2px -2px 4px rgba(28, 53, 27, 0.14);
  }

  ${({ plant }) =>
    plant.kind === 'sansevieria'
      ? `
    .leaf {
      bottom: 14px;
      left: 50%;
      width: 7px;
      height: 40px;
      border-radius: 80% 80% 15% 15%;
      transform-origin: bottom center;
    }
    .leaf-1 { transform: translateX(-50%) rotate(-18deg); height: 34px; }
    .leaf-2 { transform: translateX(-50%) rotate(-8deg); height: 42px; }
    .leaf-3 { transform: translateX(-50%) rotate(4deg); height: 47px; }
    .leaf-4 { transform: translateX(-50%) rotate(14deg); height: 39px; }
    .leaf-5 { transform: translateX(-50%) rotate(24deg); height: 31px; }
    .leaf-6 { display: none; }
    .stem { display: none; }
  `
      : `
    .leaf {
      width: ${plant.kind === 'monstera' ? '18px' : '14px'};
      height: ${plant.kind === 'monstera' ? '17px' : '13px'};
      border-radius: 80% 12% 80% 18%;
      transform-origin: 50% 100%;
    }
    .leaf-1 { left: 8px; bottom: 29px; transform: rotate(-34deg); }
    .leaf-2 { left: 20px; bottom: 35px; transform: rotate(15deg); }
    .leaf-3 { left: 25px; bottom: 25px; transform: rotate(42deg); }
    .leaf-4 { left: 12px; bottom: 20px; transform: rotate(-12deg); }
    .leaf-5 { left: 19px; bottom: 18px; transform: rotate(62deg) scale(.88); }
    .leaf-6 { left: 5px; bottom: 18px; transform: rotate(-58deg) scale(.82); }
  `}

  .flower {
    position: absolute;
    display: ${({ plant }) => (plant.kind === 'peace' ? 'block' : 'none')};
    width: 10px;
    height: 16px;
    border-radius: 70% 30% 70% 30%;
    background: linear-gradient(135deg, #fffdf0, #e5dfca);
    box-shadow: 0 2px 5px rgba(70, 64, 45, 0.08);
  }

  .flower-a {
    left: 18px;
    bottom: 39px;
    transform: rotate(18deg);
  }

  .flower-b {
    left: 30px;
    bottom: 31px;
    transform: rotate(-18deg) scale(0.86);
  }
`

const Avatar = styled.span<{ plant: Plant }>`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 72%, #efe5d3 0 32%, rgba(255, 255, 255, 0.6) 33% 100%);
  box-shadow: inset 0 0 0 1px rgba(75, 86, 65, 0.08);

  .pot {
    position: absolute;
    left: 50%;
    bottom: 4px;
    width: 10px;
    height: 8px;
    border-radius: 2px 2px 4px 4px;
    background: #9b7858;
    transform: translateX(-50%);
  }

  .leaf {
    position: absolute;
    width: ${({ plant }) => (plant.kind === 'sansevieria' ? '4px' : '10px')};
    height: ${({ plant }) => (plant.kind === 'sansevieria' ? '18px' : '9px')};
    border-radius: ${({ plant }) => (plant.kind === 'sansevieria' ? '80% 80% 12% 12%' : '80% 12% 80% 18%')};
    background: ${({ plant }) => (plant.kind === 'sansevieria' ? '#547b32' : '#4f7f3f')};
    transform-origin: bottom center;
  }

  .leaf-a {
    left: 7px;
    bottom: 12px;
    transform: rotate(-36deg);
  }

  .leaf-b {
    left: 14px;
    bottom: 13px;
    transform: rotate(8deg);
  }

  .leaf-c {
    left: 11px;
    bottom: 10px;
    transform: rotate(42deg);
  }
`

const PlantLine = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr 8px;
  align-items: center;
  gap: 11px;
  min-height: 43px;
  font-size: 13px;
  white-space: nowrap;

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--tone);
  }
`

const RightPanel = styled.aside`
  position: relative;
  z-index: 2;
  display: grid;
  align-content: start;
  gap: 18px;
  padding-top: 118px;

  @media (max-width: 1180px) {
    display: none;
  }
`

const RailCard = styled.section`
  overflow: hidden;
  padding: 18px 15px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.panel};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.52)),
    var(--control-surface);
  box-shadow:
    0 14px 32px color-mix(in srgb, var(--accent) 12%, rgba(58, 52, 42, 0.065)),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);

  h2 {
    margin: 0 0 13px;
    font-size: 15px;
  }
`

const AddMore = styled.div`
  margin-top: 6px;
  text-align: center;
  font-size: 13px;
`

const TipCard = styled(RailCard)<{ season: Season }>`
  min-height: 210px;
  background:
    linear-gradient(180deg, ${({ season }) => seasonTheme[season].railTint}, rgba(255, 255, 255, 0.68)),
    radial-gradient(ellipse at 70% 88%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 24%, transparent), transparent 42%);

  p {
    margin: 0;
    color: #394139;
    font-size: 13px;
    line-height: 1.78;
  }
`

const TipGarden = styled.div`
  position: relative;
  height: 74px;
  margin: 18px -8px -10px;
`

const DetailPanel = styled.aside<{ season: Season }>`
  position: fixed;
  z-index: 6;
  top: 94px;
  right: 26px;
  width: 358px;
  max-width: calc(100vw - 42px);
  max-height: calc(100vh - 122px);
  overflow: auto;
  padding: 24px 18px 18px;
  border: 1px solid ${({ season }) => seasonTheme[season].controlLine};
  border-radius: ${radii.panel};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.76)),
    ${({ season }) => seasonTheme[season].calendarSurface},
    ${({ season }) => seasonTheme[season].pageBackground};
  box-shadow: ${shadows.floating};
  backdrop-filter: blur(20px);

  h2 {
    margin: 0 34px 8px 0;
    font-size: 24px;
    line-height: 1.25;
  }
`

const DetailClose = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 28px;
  height: 28px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.control};
  background: var(--control-surface);
  color: #1b1e1a;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
`

const SeasonLine = styled.p<{ season: Season }>`
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: ${({ season }) => seasonTheme[season].accent};
  font-size: 13px;
  font-weight: 700;

  span {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${({ season }) => seasonTheme[season].accent};
  }
`

const DetailScene = styled.div`
  position: relative;
  height: 118px;
  margin: 14px 0 21px;
  overflow: hidden;
  border-radius: ${radii.panel};
  background:
    radial-gradient(ellipse at 50% 72%, rgba(122, 91, 58, 0.18), transparent 54%),
    var(--calendar-surface);
`

const DetailSection = styled.section`
  padding: 14px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.panel};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.56)),
    var(--control-surface);
  box-shadow: 0 10px 24px rgba(58, 52, 42, 0.055);

  & + & {
    margin-top: 12px;
  }

  h3 {
    margin: 0 0 12px;
    font-size: 16px;
  }
`

const DetailPlant = styled.div`
  display: grid;
  grid-template-columns: 28px 72px 8px 1fr;
  align-items: center;
  gap: 10px;
  min-height: 64px;
  font-size: 13px;

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--tone);
  }
`

const MiniScene = styled.div`
  position: relative;
  height: 58px;
  overflow: hidden;
`

const Memo = styled.p`
  margin: 0;
  color: #333b34;
  font-size: 13px;
  line-height: 1.75;
`
