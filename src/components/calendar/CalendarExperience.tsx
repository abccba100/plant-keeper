import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { DayCellContentArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import {
  getCalendarDays,
  getPlantMoisture,
  seasonMeta,
  seasonOrder,
  weekdays,
  type CalendarDay,
  type CalendarMoisture,
  type CalendarTask,
  type Season,
} from '../../store/calendarData'
import type { Plant } from '../../store/plantData'
import { useCalendarStore } from '../../store/calendarStore'
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
  fullCalendarSeasonConfig,
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
  const showDetail = useCalendarStore((state) => state.showDetail)
  const completedTaskIds = useCalendarStore((state) => state.completedTaskIds)
  const userTasksByDate = useCalendarStore((state) => state.userTasksByDate)
  const closeDetail = useCalendarStore((state) => state.closeDetail)
  const days = useMemo(() => getCalendarDays(season, selectedDate, completedTaskIds, userTasksByDate), [completedTaskIds, season, selectedDate, userTasksByDate])
  const selectedDay = useMemo(() => days.find((day) => day.inMonth && day.date === selectedDate), [days, selectedDate])

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
        <CalendarMain season={season} days={days} />
        <MemoizedRightRail season={season} />
      </Workspace>
      {showDetail && selectedDay ? <DayDetail season={season} day={selectedDay} onClose={closeDetail} /> : null}
    </Shell>
  )
}


const CalendarMain = memo(function CalendarMain({ season, days }: { season: Season; days: CalendarDay[] }) {
  const setSeason = useCalendarStore((state) => state.setSeason)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const calendarRef = useRef<FullCalendar>(null)
  const seasonChangeTimerRef = useRef<number | null>(null)
  const seasonSettleTimerRef = useRef<number | null>(null)
  const [pendingSeason, setPendingSeason] = useState<Season | null>(null)
  const calendarConfig = fullCalendarSeasonConfig[season]

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

  // Stable callbacks so FullCalendar doesn't remount its cell renderers on every
  // parent re-render (e.g. DayDetail open/close, selectedDate change, etc.)
  const renderDayCell = useCallback(
    (arg: DayCellContentArg) => {
      const day = getFullCalendarDay(season, days, arg.date)
      if (!day) return null
      return <MemoizedCalendarCell season={season} day={day} onSelectDate={selectDate} />
    },
    [days, season, selectDate],
  )

  const handleDateClick = useCallback(
    (arg: DateClickArg) => {
      const day = getFullCalendarDay(season, days, arg.date)
      if (day?.inMonth) selectDate(day.date)
    },
    [days, season, selectDate],
  )

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
      {pendingSeason ? (
        <SeasonChangeOverlay aria-live="polite" aria-label="계절 변경 중">
          <span />
          <strong>{seasonMeta[pendingSeason].label} 캘린더를 불러오는 중</strong>
        </SeasonChangeOverlay>
      ) : null}
    </CalendarArea>
  )
})

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
    if (previous[index].kind !== next[index].kind) return false
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
