import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { DayCellContentArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import {
  getCalendarDays,
  getPlantMoisture,
  getDefaultSelectedDateBySeason,
  getSeasonCalendarInfo,
  seasonMeta,
  seasonOrder,
  weekdays,
  type CalendarDay,
  type CalendarMoisture,
  type CalendarTask,
  type Season,
} from '../../store/calendarData'
import type { Plant, PlantId } from '../../store/plantData'
import { useCalendarStore } from '../../store/calendarStore'
import { usePlantStore } from '../../store/plantStore'
import { PageSidebar } from '../layout/PageSidebar'
import '../styles/shell.css'
import {
  Shell,
  PageHeroBranch,
  PageHeroShadow,
  PageSubBranch,
  PageMascot,
  PageFloater,
  Workspace,
  CalendarArea,
  SeasonChangeOverlay,
  TopBar,
  IconControls,
  IconButton,
  Toolbar,
  MonthControls,
  ArrowButton,
  MonthButton,
  SoftButton,
  SoftSelect,
  ToolbarSpacer,
  SeasonTabs,
  SeasonTab,
  CalendarFrame,
  CalendarFootGrass,
  CalendarFootGrassAlt,
  WeekHeader,
  Weekday,
  CalendarGrid,
  DayCell,
  DateText,
  TodayBadge,
  TaskChip,
  Landscape,
  CellGardenScene,
  CellSoil,
  CellPlantCluster,
  CellSoilPatch,
  CellPlantNode,
  TinySprout,
} from './calendarStyles'
import { CanopyAtmosphere } from './atmosphere/CanopyAtmosphere'
import { DayDetail, RightRail } from './CalendarDayDetail'
import {
  fullCalendarPlugins,
  getFullCalendarSeasonConfig,
  getBaseMoisture,
  getCellPlantSlot,
  getFullCalendarDay,
  leafNodes,
  taskTone,
  withMoisture,
} from './calendarConfig'

export function CalendarExperience() {
  const season = useCalendarStore((state) => state.season)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const completedTaskIds = useCalendarStore((state) => state.completedTaskIds)
  const userTasksByDate = useCalendarStore((state) => state.userTasksByDate)
  const plants = usePlantStore((state) => state.plants)
  const days = useMemo(() => getCalendarDays(season, selectedDate, completedTaskIds, userTasksByDate, plants), [completedTaskIds, plants, season, selectedDate, userTasksByDate])

  return (
    <Shell season={season}>
      <CanopyAtmosphere season={season} />
      <PageHeroShadow season={season} data-calendar-decor="page-hero-shadow" aria-hidden="true" />
      <PageHeroBranch season={season} data-calendar-decor="page-hero" aria-hidden="true" />
      <PageSubBranch season={season} data-calendar-decor="page-sub" aria-hidden="true" />
      <PageMascot season={season} data-calendar-decor="page-mascot" aria-hidden="true" />
      <PageFloater season={season} data-calendar-decor="page-floater" aria-hidden="true" />
      <PageSidebar season={season} activePath="/" />
      <Workspace>
        <CalendarMain season={season} days={days} plants={plants} />
        <MemoizedRightRail season={season} />
      </Workspace>
    </Shell>
  )
}


type PlantFilter = PlantId | 'all'
type CalendarViewMode = 'calendar' | 'list'

const CalendarMain = memo(function CalendarMain({ season, days, plants }: { season: Season; days: CalendarDay[]; plants: Plant[] }) {
  const setSeason = useCalendarStore((state) => state.setSeason)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const showDetail = useCalendarStore((state) => state.showDetail)
  const closeDetail = useCalendarStore((state) => state.closeDetail)
  const calendarRef = useRef<FullCalendar>(null)
  const seasonChangeTimerRef = useRef<number | null>(null)
  const seasonSettleTimerRef = useRef<number | null>(null)
  const [pendingSeason, setPendingSeason] = useState<Season | null>(null)
  const [plantFilter, setPlantFilter] = useState<PlantFilter>('all')
  const [viewMode, setViewMode] = useState<CalendarViewMode>('calendar')
  const calendarConfig = getFullCalendarSeasonConfig(season)
  const calendarInfo = getSeasonCalendarInfo(season)
  const visibleDays = useMemo(() => days.map((day) => filterCalendarDay(day, plantFilter)), [days, plantFilter])
  const selectedDay = useMemo(() => visibleDays.find((day) => day.inMonth && day.date === selectedDate), [selectedDate, visibleDays])

  const handleSeasonChange = useCallback(
    (nextSeason: Season) => {
      if (nextSeason === season) return
      if (seasonChangeTimerRef.current) window.clearTimeout(seasonChangeTimerRef.current)
      if (seasonSettleTimerRef.current) window.clearTimeout(seasonSettleTimerRef.current)

      setPendingSeason(nextSeason)
      seasonChangeTimerRef.current = window.setTimeout(() => {
        setSeason(nextSeason)
      }, 80)
    },
    [season, setSeason],
  )

  const jumpSeason = useCallback(
    (direction: -1 | 1) => {
      const currentIndex = seasonOrder.indexOf(season)
      const nextSeason = seasonOrder[(currentIndex + direction + seasonOrder.length) % seasonOrder.length]
      handleSeasonChange(nextSeason)
    },
    [handleSeasonChange, season],
  )

  const selectToday = useCallback(() => {
    selectDate(getDefaultSelectedDateBySeason(season))
  }, [season, selectDate])

  // Stable callbacks so FullCalendar doesn't remount its cell renderers on every
  // parent re-render (e.g. DayDetail open/close, selectedDate change, etc.)
  const renderDayCell = useCallback(
    (arg: DayCellContentArg) => {
      const day = getFullCalendarDay(season, visibleDays, arg.date)
      if (!day) return null
      return <MemoizedCalendarCell season={season} day={day} onSelectDate={selectDate} />
    },
    [season, selectDate, visibleDays],
  )

  const handleDateClick = useCallback(
    (arg: DateClickArg) => {
      const day = getFullCalendarDay(season, visibleDays, arg.date)
      if (day?.inMonth) selectDate(day.date)
    },
    [season, selectDate, visibleDays],
  )

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(calendarConfig.initialDate)
  }, [calendarConfig.initialDate])

  useEffect(() => {
    return () => {
      if (seasonChangeTimerRef.current) window.clearTimeout(seasonChangeTimerRef.current)
      if (seasonSettleTimerRef.current) window.clearTimeout(seasonSettleTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (pendingSeason !== season) return
    if (seasonSettleTimerRef.current) window.clearTimeout(seasonSettleTimerRef.current)
    seasonSettleTimerRef.current = window.setTimeout(() => setPendingSeason(null), 360)
  }, [pendingSeason, season])

  return (
    <>
      <CalendarArea>
        <TopBar>
          <h1>관리 캘린더</h1>
          <IconControls aria-label="View controls">
            <IconButton type="button" aria-label="Calendar view" aria-pressed={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}>
              ◴
            </IconButton>
            <IconButton type="button" aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>
              ☰
            </IconButton>
          </IconControls>
        </TopBar>
        <Toolbar>
          <MonthControls>
            <ArrowButton type="button" aria-label="Previous month" onClick={() => jumpSeason(-1)}>
              ‹
            </ArrowButton>
            <MonthButton type="button" onClick={selectToday}>
              <strong>{calendarInfo.monthLabel}</strong>
            </MonthButton>
            <ArrowButton type="button" aria-label="Next month" onClick={() => jumpSeason(1)}>
              ›
            </ArrowButton>
          </MonthControls>
          <SoftButton type="button" onClick={selectToday}>
            {calendarInfo.isCurrentSeason ? '오늘' : '대표일'}
          </SoftButton>
          <ToolbarSpacer />
          <SoftSelect
            aria-label="식물 필터"
            value={plantFilter}
            onChange={(event) => setPlantFilter(event.target.value as PlantFilter)}
          >
            <option value="all">모든 식물</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </SoftSelect>
          <SoftButton type="button" onClick={() => setViewMode((mode) => (mode === 'calendar' ? 'list' : 'calendar'))}>
            {viewMode === 'calendar' ? '월간 보기' : '목록 보기'}
          </SoftButton>
          <SeasonTabs>
            {seasonOrder.map((seasonKey) => (
              <SeasonTab
                key={seasonKey}
                type="button"
                active={season === seasonKey}
                seasonKey={seasonKey}
                data-season-tab={seasonKey}
                onClick={() => handleSeasonChange(seasonKey)}
              >
                <span aria-hidden="true" />
                {seasonMeta[seasonKey].label}
              </SeasonTab>
            ))}
          </SeasonTabs>
        </Toolbar>
        {viewMode === 'calendar' ? (
          <CalendarFrame>
            <CalendarFootGrass season={season} data-calendar-decor="calendar-foot" aria-hidden="true" />
            <CalendarFootGrassAlt season={season} data-calendar-decor="calendar-foot-alt" aria-hidden="true" />
            <WeekHeader>
              {weekdays.map((weekday, index) => (
                <Weekday key={weekday} sunday={index === 6}>
                  {weekday}
                </Weekday>
              ))}
            </WeekHeader>
            <CalendarGrid>
              <FullCalendar
                ref={calendarRef}
                plugins={fullCalendarPlugins}
                initialView="dayGridMonth"
                initialDate={calendarConfig.initialDate}
                firstDay={1}
                fixedWeekCount
                showNonCurrentDates
                dayHeaders={false}
                headerToolbar={false}
                height="auto"
                contentHeight="auto"
                dayCellContent={renderDayCell}
                dateClick={handleDateClick}
              />
            </CalendarGrid>
          </CalendarFrame>
        ) : (
          <CalendarListView days={visibleDays} onSelectDate={selectDate} />
        )}
        {pendingSeason ? (
          <SeasonChangeOverlay aria-live="polite" aria-label="계절 변경 중">
            <span />
            <strong>{seasonMeta[pendingSeason].label} 캘린더를 불러오는 중</strong>
          </SeasonChangeOverlay>
        ) : null}
      </CalendarArea>
      {showDetail && selectedDay ? <DayDetail season={season} day={selectedDay} onClose={closeDetail} /> : null}
    </>
  )
})

function filterCalendarDay(day: CalendarDay, plantFilter: PlantFilter): CalendarDay {
  if (plantFilter === 'all') {
    return day
  }

  return {
    ...day,
    plants: day.plants.filter((plant) => plant.id === plantFilter),
    tasks: day.tasks.filter((task) => task.plant.id === plantFilter),
  }
}

function CalendarListView({ days, onSelectDate }: { days: CalendarDay[]; onSelectDate: (date: number) => void }) {
  const scheduledDays = days.filter((day) => day.inMonth && day.tasks.length > 0)

  return (
    <CalendarFrame>
      <div style={{ display: 'grid', gap: 10, padding: 18, minHeight: 520 }}>
        {scheduledDays.length > 0 ? (
          scheduledDays.map((day) => (
            <button
              key={`list-${day.date}`}
              type="button"
              onClick={() => onSelectDate(day.date)}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                minHeight: 68,
                padding: '12px 14px',
                border: '1px solid var(--control-line)',
                borderRadius: 11,
                background: 'var(--control-surface)',
                color: 'inherit',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <strong style={{ color: 'var(--accent-deep)' }}>{day.date}일</strong>
              <span style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontWeight: 800 }}>{day.tasks[0].title}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                  {day.tasks[0].time} · {day.tasks[0].plant.name}
                </span>
              </span>
              <span style={{ fontSize: 13, color: 'var(--accent-deep)', fontWeight: 800 }}>
                {day.tasks.length > 1 ? `+${day.tasks.length - 1}` : '상세'}
              </span>
            </button>
          ))
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 360, color: 'var(--ink-soft)', fontWeight: 700 }}>
            선택한 식물의 일정이 없습니다.
          </div>
        )}
      </div>
    </CalendarFrame>
  )
}

function CalendarCell({ season, day, onSelectDate }: { season: Season; day: CalendarDay; onSelectDate: (date: number) => void }) {
  return (
    <DayCell
      season={season}
      day={day}
      role="button"
      tabIndex={day.inMonth ? 0 : -1}
      aria-label={day.isToday ? `오늘, ${day.date}일` : `${day.date}일`}
      data-in-month={day.inMonth}
      data-plant-count={day.plants.length}
      data-fullcalendar-date={day.inMonth ? day.date : undefined}
      onKeyDown={(event) => {
        if (!day.inMonth) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelectDate(day.date)
        }
      }}
    >
      {day.isToday ? <TodayBadge>오늘</TodayBadge> : null}
      <DateText day={day} data-calendar-date-text>
        {day.date}
      </DateText>
      {day.tasks.length > 0 ? <TaskPreview tasks={day.tasks} /> : null}
      <Landscape season={season} day={day}>
        <CellGarden season={season} day={day} />
      </Landscape>
    </DayCell>
  )
}

function TaskPreview({ tasks }: { tasks: CalendarTask[] }) {
  const wateringTask = tasks.find((task) => task.type === 'watering')
  const primaryTask = wateringTask ?? tasks[0]

  return (
    <TaskChip completed={primaryTask.completed} data-calendar-task-chip>
      <span aria-hidden="true">{primaryTask.completed ? '✓' : taskTone[primaryTask.type].icon}</span>
      {primaryTask.completed ? '완료' : taskTone[primaryTask.type].label}
      {tasks.length > 1 ? <i>+{tasks.length - 1}</i> : null}
    </TaskChip>
  )
}

function CellGarden({ season, day }: { season: Season; day: CalendarDay }) {
  const displayPlants = day.plants
  const neutralDay = withMoisture(day, getBaseMoisture(season))

  return (
    <CellGardenScene season={season} day={day}>
      <span className="scene-glow" />
      <span className="season-sprinkles" />
      {day.inMonth ? <span className="cell-decor" /> : null}
      {day.inMonth && day.date % 4 === 0 ? <span className="cell-decor cell-decor-alt" /> : null}
      <CellSoil season={season} day={neutralDay}>
        <span className="soil-shine" />
      </CellSoil>
      {displayPlants.map((plant, index) => (
        <CellPlant
          key={`${plant.name}-${index}`}
          active={day.isSelected === true}
          moisture={getPlantMoisture(day, plant)}
          plant={plant}
          season={season}
          index={index}
          total={displayPlants.length}
          growth={day.growth}
          muted={!day.inMonth}
        />
      ))}
      {displayPlants.length === 0 ? <TinySprout season={season} /> : null}
    </CellGardenScene>
  )
}

function CellPlant({
  active,
  moisture,
  plant,
  season,
  index,
  total,
  growth,
  muted,
}: {
  active: boolean
  moisture: CalendarMoisture
  plant: Plant
  season: Season
  index: number
  total: number
  growth: CalendarDay['growth']
  muted: boolean
}) {
  const scale = 0.56 + growth * 0.058 + (plant.kind === 'monstera' ? 0.09 : plant.kind === 'sansevieria' ? 0.03 : 0)

  return (
    <CellPlantCluster
      data-cell-plant={plant.kind}
      style={
        {
          '--x': `${getCellPlantSlot(total, index)}%`,
        } as CSSProperties
      }
    >
      <CellSoilPatch moisture={moisture} season={season}>
        <span className="soil-shine" />
        {moisture === 'wet' ? (
          <>
            <span className="water-drop drop-a" />
            <span className="water-drop drop-b" />
            <span className="water-ripple" />
          </>
        ) : null}
      </CellSoilPatch>
      <CellPlantNode
        active={active}
        plant={plant}
        muted={muted}
        style={
          {
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
        {leafNodes.map((leafIndex) => (
          <span key={leafIndex} className={`leaf leaf-${leafIndex}`} />
        ))}
        <span className="bloom bloom-a" />
        <span className="bloom bloom-b" />
      </CellPlantNode>
    </CellPlantCluster>
  )
}

const MemoizedRightRail = memo(RightRail)
const MemoizedCalendarCell = memo(CalendarCell, areCalendarCellPropsEqual)

type CalendarCellProps = {
  season: Season
  day: CalendarDay
  onSelectDate: (date: number) => void
}

function areCalendarCellPropsEqual(previous: CalendarCellProps, next: CalendarCellProps) {
  return (
    previous.season === next.season &&
    previous.onSelectDate === next.onSelectDate &&
    previous.day.date === next.day.date &&
    previous.day.inMonth === next.day.inMonth &&
    previous.day.isToday === next.day.isToday &&
    previous.day.isSelected === next.day.isSelected &&
    previous.day.moisture === next.day.moisture &&
    previous.day.growth === next.day.growth &&
    previous.day.density === next.day.density &&
    arePlantsEqual(previous.day.plants, next.day.plants) &&
    areTasksEqual(previous.day.tasks, next.day.tasks)
  )
}

function arePlantsEqual(previous: Plant[], next: Plant[]) {
  if (previous.length !== next.length) return false

  for (let index = 0; index < previous.length; index += 1) {
    if (previous[index].id !== next[index].id) return false
  }

  return true
}

function areTasksEqual(previous: CalendarTask[], next: CalendarTask[]) {
  if (previous.length !== next.length) return false

  for (let index = 0; index < previous.length; index += 1) {
    if (previous[index].id !== next[index].id || previous[index].completed !== next[index].completed) return false
  }

  return true
}
