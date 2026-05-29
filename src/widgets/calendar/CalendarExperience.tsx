import { memo, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import styled from '@emotion/styled'
import type { DayCellContentArg } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
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
  type CalendarTaskType,
  type Season,
} from '../../entities/calendar/model/calendar'
import { plants, type Plant, type PlantKind } from '../../entities/plant/model/plant'
import { useCalendarStore } from '../../features/calendar/model/useCalendarStore'
import { radii, seasonTheme, shadows } from '../../shared/design-system/tokens'
import { CanopyAtmosphere } from './atmosphere/CanopyAtmosphere'
import { seasonDecor } from './decor/seasonDecorRegistry'

const navItems = [
  { icon: '↥', label: '식물 이미지 업로드' },
  { icon: '◎', label: 'AI 식물 인식' },
  { icon: '◷', label: '기본 관리 정보' },
  { icon: '✎', label: '식물 상태 입력' },
  { icon: '⌕', label: '상태 진단 결과' },
  { icon: '⌘', label: '내 식물 등록' },
]

const taskTone: Record<CalendarTask['type'], { icon: string; label: string }> = {
  watering: { icon: '◌', label: '물주기' },
  mist: { icon: '≋', label: '분무' },
  rotate: { icon: '⟳', label: '돌리기' },
  check: { icon: '✓', label: '확인' },
  repot: { icon: '▱', label: '분갈이' },
  fertilize: { icon: '✦', label: '영양제' },
  prune: { icon: '⌁', label: '가지치기' },
  custom: { icon: '+', label: '직접' },
}

const taskComposerOptions = [
  { value: 'watering', label: '물주기', title: '물주기', time: '오전 9:00' },
  { value: 'mist', label: '잎 분무', title: '잎 분무', time: '오후 4:00' },
  { value: 'rotate', label: '화분 돌리기', title: '화분 돌리기', time: '오후 1:00' },
  { value: 'check', label: '상태 확인', title: '상태 확인', time: '오후 6:00' },
  { value: 'repot', label: '분갈이', title: '분갈이', time: '오전 10:00' },
  { value: 'fertilize', label: '영양제 주기', title: '영양제 주기', time: '오전 10:30' },
  { value: 'prune', label: '가지치기', title: '가지치기', time: '오후 2:00' },
  { value: 'manual', label: '직접 입력', title: '', time: '오전 9:00' },
] as const

type TaskComposerValue = (typeof taskComposerOptions)[number]['value']

const leafNodes = Array.from({ length: 6 }, (_, index) => index + 1)

const fullCalendarSeasonConfig: Record<Season, { initialDate: string; gridStart: string }> = {
  spring: { initialDate: '2024-04-01', gridStart: '2024-04-01' },
  summer: { initialDate: '2024-07-01', gridStart: '2024-07-01' },
  autumn: { initialDate: '2024-10-01', gridStart: '2024-09-30' },
  winter: { initialDate: '2024-12-01', gridStart: '2024-11-25' },
}

function getCellPlantSlot(total: number, index: number) {
  return (total === 1 ? [50] : total === 2 ? [36, 64] : [27, 52, 73])[index] ?? 50
}

function getDetailPlantSlot(total: number, index: number) {
  return (total === 1 ? [50] : total === 2 ? [35, 65] : [24, 52, 78])[index] ?? 50
}

function getBaseMoisture(season: Season): CalendarMoisture {
  return season === 'winter' ? 'frost' : 'balanced'
}

function withMoisture(day: CalendarDay, moisture: CalendarMoisture): CalendarDay {
  return { ...day, moisture }
}

function getDayOffset(startDateKey: string, date: Date) {
  const [startYear, startMonth, startDay] = startDateKey.split('-').map(Number)
  const startUtc = Date.UTC(startYear, startMonth - 1, startDay)
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

  return Math.round((dateUtc - startUtc) / 86_400_000)
}

function getFullCalendarDay(season: Season, days: CalendarDay[], date: Date) {
  const offset = getDayOffset(fullCalendarSeasonConfig[season].gridStart, date)

  return offset >= 0 && offset < days.length ? days[offset] : undefined
}

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
      <PageHeroBranch season={season} aria-hidden="true" />
      <PageSubBranch season={season} aria-hidden="true" />
      <PageMascot season={season} aria-hidden="true" />
      <PageFloater season={season} aria-hidden="true" />
      <MemoizedSidebar />
      <Workspace>
        <CalendarMain season={season} days={days} />
        <MemoizedRightRail season={season} />
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
  const selectDate = useCalendarStore((state) => state.selectDate)
  const calendarConfig = fullCalendarSeasonConfig[season]

  function renderDayCell(arg: DayCellContentArg) {
    const day = getFullCalendarDay(season, days, arg.date)

    if (!day) {
      return null
    }

    return <MemoizedCalendarCell season={season} day={day} onSelectDate={selectDate} />
  }

  function handleDateClick(arg: DateClickArg) {
    const day = getFullCalendarDay(season, days, arg.date)

    if (day?.inMonth) {
      selectDate(day.date)
    }
  }

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
              onClick={() => setSeason(seasonKey)}
            >
              <span aria-hidden="true" />
              {seasonMeta[seasonKey].label}
            </SeasonTab>
          ))}
        </SeasonTabs>
      </Toolbar>
      <CalendarFrame>
        <CalendarFootGrass season={season} aria-hidden="true" />
        <WeekHeader>
          {weekdays.map((weekday, index) => (
            <Weekday key={weekday} sunday={index === 6}>
              {weekday}
            </Weekday>
          ))}
        </WeekHeader>
        <CalendarGrid>
          <FullCalendar
            key={season}
            plugins={[dayGridPlugin, interactionPlugin]}
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
    </CalendarArea>
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
      <DateText day={day}>{day.date}</DateText>
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
    <TaskChip completed={primaryTask.completed}>
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
        <TipRibbon season={season} aria-hidden="true" />
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
  const addTask = useCalendarStore((state) => state.addTask)
  const completeTask = useCalendarStore((state) => state.completeTask)
  const savedMemo = useCalendarStore((state) => state.memosByDate[`${season}-${day.date}`])
  const setMemo = useCalendarStore((state) => state.setMemo)
  const lastCompletedTaskId = useCalendarStore((state) => state.lastCompletedTaskId)
  const [taskValue, setTaskValue] = useState<TaskComposerValue>('watering')
  const [customTaskTitle, setCustomTaskTitle] = useState('')
  const [selectedPlantKind, setSelectedPlantKind] = useState<PlantKind>(day.plants[0]?.kind ?? plants[0].kind)
  const completedWatering = day.tasks.some((task) => task.type === 'watering' && task.completed)
  const selectedTaskOption = taskComposerOptions.find((option) => option.value === taskValue) ?? taskComposerOptions[0]
  const isManualTask = taskValue === 'manual'
  const trimmedCustomTaskTitle = customTaskTitle.trim()
  const canAddTask = isManualTask ? trimmedCustomTaskTitle.length > 0 : true
  const memo = savedMemo ?? '새 잎이 많이 올라오고 있어요. 창가 쪽으로 위치를 옮겨줬어요.'

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canAddTask) {
      return
    }

    addTask({
      season,
      date: day.date,
      type: isManualTask ? 'custom' : (taskValue as CalendarTaskType),
      title: isManualTask ? trimmedCustomTaskTitle : selectedTaskOption.title,
      plantKind: selectedPlantKind,
      time: selectedTaskOption.time,
    })

    if (isManualTask) {
      setCustomTaskTitle('')
    }
  }

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
        <strong>{completedWatering ? '토양이 젖어 있어요' : day.tasks.length > 0 ? '수행할 일정이 있어요' : '예정된 일정 없음'}</strong>
      </SeasonLine>
      <DetailScene>
        <SoilBand season={season} day={withMoisture({ ...day, inMonth: true }, getBaseMoisture(season))} />
        {day.plants.map((plant, index) => (
          <PottedPlantCluster key={`detail-${plant.name}-${index}`} season={season} day={day} plant={plant} index={index} total={day.plants.length} growth={3} />
        ))}
      </DetailScene>
      <DetailSection>
        <h3>오늘의 일정</h3>
        <TaskComposer onSubmit={handleAddTask}>
          <TaskSelect
            aria-label="추가할 일정 선택"
            value={taskValue}
            onChange={(event) => setTaskValue(event.target.value as TaskComposerValue)}
          >
            {taskComposerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TaskSelect>
          <TaskSelect
            aria-label="일정을 추가할 식물 선택"
            value={selectedPlantKind}
            onChange={(event) => setSelectedPlantKind(event.target.value as PlantKind)}
          >
            {plants.map((plant) => (
              <option key={plant.kind} value={plant.kind}>
                {plant.name}
              </option>
            ))}
          </TaskSelect>
          {isManualTask ? (
            <TaskInput
              aria-label="직접 입력할 일정"
              placeholder="할일 입력"
              value={customTaskTitle}
              onChange={(event) => setCustomTaskTitle(event.target.value)}
            />
          ) : null}
          <AddTaskButton type="submit" disabled={!canAddTask}>
            추가
          </AddTaskButton>
        </TaskComposer>
        {day.tasks.length > 0 ? (
          <TaskList>
            {day.tasks.map((task) => (
              <TaskItem key={task.id} completed={task.completed} highlight={lastCompletedTaskId === task.id}>
                <TaskIcon>{task.completed ? '✓' : taskTone[task.type].icon}</TaskIcon>
                <TaskCopy>
                  <strong>{task.title}</strong>
                  <span>
                    {task.time} · {task.plant.name}
                  </span>
                </TaskCopy>
                <TaskAction type="button" completed={task.completed} disabled={task.completed} onClick={() => completeTask(task.id)}>
                  {task.completed ? '완료됨' : '수행'}
                </TaskAction>
              </TaskItem>
            ))}
          </TaskList>
        ) : (
          <TaskEmpty>등록된 일정이 없습니다.</TaskEmpty>
        )}
      </DetailSection>
      <DetailSection>
        <h3>이 날의 식물 상태</h3>
        {day.plants.map((plant) => (
          <DetailPlant key={`detail-line-${plant.name}`} data-detail-plant-row={plant.kind} style={{ '--tone': plant.tone } as CSSProperties}>
            <PlantAvatar plant={plant} />
            <span>{plant.name}</span>
            <i />
            <MiniScene>
              <SoilBand season={season} day={withMoisture({ ...day, inMonth: true }, getBaseMoisture(season))} />
              <PottedPlantCluster compact season={season} day={day} plant={plant} index={0} total={1} growth={2} />
            </MiniScene>
          </DetailPlant>
        ))}
      </DetailSection>
      <DetailSection>
        <h3>메모</h3>
        <MemoField
          aria-label="날짜 메모"
          value={memo}
          placeholder="오늘 식물 상태나 관리 내용을 적어두세요."
          onChange={(event) => setMemo(season, day.date, event.target.value)}
        />
      </DetailSection>
    </DetailPanel>
  )
}

function PottedPlantCluster({
  compact = false,
  season,
  day,
  plant,
  index,
  total,
  growth,
}: {
  compact?: boolean
  season: Season
  day: CalendarDay
  plant: Plant
  index: number
  total: number
  growth: CalendarDay['growth']
}) {
  const moisture = getPlantMoisture(day, plant)

  return (
    <DetailPlantClusterFrame
      compact={compact}
      data-detail-scene-plant={compact ? undefined : plant.kind}
      style={{ '--x': `${getDetailPlantSlot(total, index)}%` } as CSSProperties}
    >
      <DetailSoilPatch compact={compact} moisture={moisture} season={season}>
        <span className="soil-shine" />
        {moisture === 'wet' ? <span className="puddle" /> : null}
      </DetailSoilPatch>
      <PottedPlant plant={plant} index={0} total={1} growth={growth} muted={false} />
    </DetailPlantClusterFrame>
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
  const scale = 0.72 + growth * 0.055 + (plant.kind === 'monstera' ? 0.08 : 0)

  return (
    <CellPlantNode
      active={false}
      plant={plant}
      muted={muted}
      style={
        {
          '--x': `${getDetailPlantSlot(total, index)}%`,
          '--scale': scale,
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

const MemoizedSidebar = memo(Sidebar)
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

const PageHeroBranch = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 1;
  top: -6px;
  right: clamp(136px, 12vw, 178px);
  width: ${({ season }) => (season === 'spring' ? '132px' : season === 'autumn' ? '152px' : season === 'summer' ? '148px' : '140px')};
  aspect-ratio: ${({ season }) => (season === 'spring' ? '89 / 103' : season === 'summer' ? '106 / 108' : season === 'autumn' ? '111 / 87' : '93 / 80')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].hero});
  background-repeat: no-repeat;
  background-position: right top;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => (season === 'winter' ? 0.8 : 0.88)};
  transform: rotate(${({ season }) => (season === 'autumn' ? '-2deg' : '4deg')});
  transform-origin: right top;

  @media (max-width: 1180px) {
    right: -8px;
    width: ${({ season }) => (season === 'autumn' ? '140px' : '128px')};
  }

  @media (max-width: 900px) {
    width: 116px;
    opacity: 0.72;
  }

  @media (max-width: 640px) {
    display: none;
  }
`

const PageSubBranch = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 1;
  left: 232px;
  top: -8px;
  width: 110px;
  aspect-ratio: ${({ season }) => (season === 'spring' ? '103 / 93' : season === 'summer' ? '109 / 104' : season === 'autumn' ? '95 / 89' : '97 / 83')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].sub});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => (season === 'winter' ? 0.52 : 0.62)};
  transform: rotate(-6deg) scaleX(-1);
  transform-origin: center;

  @media (max-width: 1180px) {
    left: 202px;
    width: 96px;
    opacity: 0.5;
  }

  @media (max-width: 900px) {
    display: none;
  }
`

const PageMascot = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 4;
  right: 24px;
  top: 76px;
  width: ${({ season }) => (season === 'winter' ? '52px' : season === 'summer' ? '48px' : season === 'autumn' ? '46px' : '44px')};
  aspect-ratio: ${({ season }) => (season === 'winter' ? '49 / 73' : season === 'summer' ? '52 / 49' : season === 'autumn' ? '81 / 91' : '46 / 43')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].mascot});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: 0.95;
  transform: rotate(${({ season }) => (season === 'summer' ? '-8deg' : season === 'autumn' ? '6deg' : '-4deg')});

  @media (max-width: 1180px) {
    right: 14px;
    top: 64px;
    width: ${({ season }) => (season === 'winter' ? '46px' : '40px')};
    opacity: 0.9;
  }

  @media (max-width: 760px) {
    display: none;
  }
`

const PageFloater = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 3;
  left: clamp(420px, 36vw, 520px);
  top: 2px;
  width: ${({ season }) => (season === 'winter' ? '30px' : '32px')};
  height: ${({ season }) => (season === 'winter' ? '30px' : '32px')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].floater});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => (season === 'winter' ? 0.74 : 0.82)};
  transform: rotate(${({ season }) => (season === 'winter' ? '12deg' : '18deg')});

  @media (max-width: 1280px) {
    left: clamp(360px, 34vw, 460px);
    width: ${({ season }) => (season === 'winter' ? '28px' : '30px')};
    opacity: 0.7;
  }

  @media (max-width: 900px) {
    display: none;
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
  position: relative;
  overflow: hidden;
  border: 1px solid var(--grid-line);
  border-radius: ${radii.panel};
  background: var(--calendar-surface);
  box-shadow:
    0 18px 44px color-mix(in srgb, var(--accent) 14%, rgba(58, 52, 42, 0.07)),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
`

const CalendarFootGrass = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 2;
  left: 14px;
  bottom: -5px;
  width: ${({ season }) => (season === 'spring' ? '108px' : season === 'summer' ? '88px' : season === 'autumn' ? '72px' : '70px')};
  aspect-ratio: ${({ season }) => (season === 'spring' ? '75 / 16' : season === 'summer' ? '56 / 14' : season === 'autumn' ? '68 / 28' : '67 / 27')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].ground});
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => (season === 'spring' ? 0.48 : season === 'autumn' ? 0.4 : 0.36)};
  mix-blend-mode: multiply;

  @media (max-width: 900px) {
    width: ${({ season }) => (season === 'spring' ? '92px' : '68px')};
    opacity: 0.3;
  }

  @media (max-width: 560px) {
    display: none;
  }
`

const WeekHeader = styled.div`
  position: relative;
  z-index: 1;
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
  position: relative;
  z-index: 1;
  background: var(--grid-line);

  .fc {
    font-family: inherit;
  }

  .fc .fc-scrollgrid {
    border: 0;
  }

  .fc .fc-scrollgrid-section > td {
    border: 0;
  }

  .fc .fc-daygrid-body,
  .fc .fc-scrollgrid-sync-table {
    width: 100% !important;
  }

  .fc .fc-scrollgrid-sync-table {
    border-collapse: collapse;
    border-spacing: 0;
    background: var(--grid-line);
  }

  .fc-theme-standard td,
  .fc-theme-standard th {
    border: 0;
  }

  .fc .fc-daygrid-day {
    padding: 0;
    background: transparent;
    border-right: 1px solid var(--grid-line);
    border-bottom: 1px solid var(--grid-line);
  }

  .fc .fc-daygrid-day:last-child {
    border-right: 0;
  }

  .fc .fc-scrollgrid-sync-table tbody tr:last-child .fc-daygrid-day {
    border-bottom: 0;
  }

  .fc .fc-daygrid-day-frame {
    min-height: clamp(111px, 12.55vh, 132px);
    padding: 0;
  }

  .fc .fc-daygrid-day-top,
  .fc .fc-daygrid-day-number {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    color: inherit;
    text-decoration: none;
  }

  .fc .fc-daygrid-day-events,
  .fc .fc-daygrid-day-bg {
    display: none;
  }

  .fc .fc-daygrid-day.fc-day-today {
    background: transparent;
  }

  @media (max-width: 760px) {
    .fc .fc-daygrid-day-frame {
      min-height: 92px;
    }
  }
`

const DayCell = styled.div<{ season: Season; day: CalendarDay }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-height: clamp(111px, 12.55vh, 132px);
  padding: 13px 12px 0;
  border: 0;
  background: ${({ day, season }) => (day.isSelected ? seasonTheme[season].selectedCell : seasonTheme[season].cellLight)};
  text-align: left;
  overflow: hidden;
  contain: layout paint;
  cursor: ${({ day }) => (day.inMonth ? 'pointer' : 'default')};
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
  position: absolute;
  top: 13px;
  left: 12px;
  z-index: 3;
  display: inline-grid;
  place-items: center;
  min-width: ${({ day }) => (day.isToday ? '30px' : 'auto')};
  height: ${({ day }) => (day.isToday ? '30px' : 'auto')};
  border-radius: 50%;
  color: ${({ day }) => (day.isToday ? '#ffffff' : day.isSunday ? '#ff2323' : day.inMonth ? '#111711' : '#aaa9a1')};
  background: ${({ day }) => (day.isToday ? 'var(--accent)' : 'transparent')};
  box-shadow: ${({ day }) => (day.isToday ? '0 7px 14px color-mix(in srgb, var(--accent) 28%, transparent)' : 'none')};
  font-size: ${({ day }) => (day.isToday ? '16px' : '17px')};
  font-weight: 700;

  @media (max-width: 760px) {
    top: 9px;
    left: 7px;
    min-width: ${({ day }) => (day.isToday ? '26px' : 'auto')};
    height: ${({ day }) => (day.isToday ? '26px' : 'auto')};
    font-size: 14px;
  }
`

const TodayBadge = styled.span`
  position: absolute;
  z-index: 4;
  top: 48px;
  left: 13px;
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 7px;
  border: 1px solid color-mix(in srgb, var(--accent) 26%, transparent);
  border-radius: ${radii.round};
  color: var(--accent);
  background: rgba(255, 255, 255, 0.68);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;

  @media (max-width: 760px) {
    display: none;
  }
`

const TaskChip = styled.span<{ completed: boolean }>`
  position: absolute;
  top: 13px;
  right: 10px;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  max-width: calc(100% - 54px);
  height: 25px;
  gap: 5px;
  padding: 0 8px;
  border: 1px solid ${({ completed }) => (completed ? 'color-mix(in srgb, var(--accent) 42%, transparent)' : 'rgba(88, 85, 71, 0.14)')};
  border-radius: ${radii.round};
  color: ${({ completed }) => (completed ? 'var(--accent)' : '#323b33')};
  background: ${({ completed }) =>
    completed
      ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.8), color-mix(in srgb, var(--accent) 10%, rgba(255, 255, 255, 0.66)))'
      : 'rgba(255, 255, 255, 0.64)'};
  box-shadow: ${({ completed }) => (completed ? '0 8px 18px color-mix(in srgb, var(--accent) 16%, transparent)' : 'none')};
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;

  span {
    display: grid;
    place-items: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ completed }) => (completed ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 16%, transparent)')};
    color: ${({ completed }) => (completed ? '#ffffff' : 'var(--accent)')};
    font-size: 10px;
  }

  i {
    font-style: normal;
    opacity: 0.72;
  }

  @media (max-width: 760px) {
    top: 42px;
    right: 6px;
    max-width: calc(100% - 12px);
    height: 22px;
    padding: 0 6px;
    font-size: 11px;
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

  .cell-decor {
    position: absolute;
    right: 7px;
    bottom: 15px;
    z-index: 1;
    width: 28px;
    height: 22px;
    border-radius: 50%;
    background: ${({ season }) =>
      season === 'spring'
        ? `
          radial-gradient(circle at 28% 42%, rgba(245, 153, 169, .58) 0 3px, transparent 4px),
          radial-gradient(circle at 54% 30%, rgba(255, 208, 214, .72) 0 3px, transparent 4px),
          radial-gradient(circle at 72% 56%, rgba(245, 153, 169, .52) 0 3px, transparent 4px)`
        : season === 'summer'
          ? `
          linear-gradient(128deg, transparent 30%, rgba(92, 139, 55, .46) 31% 43%, transparent 44%),
          radial-gradient(ellipse at 36% 56%, rgba(74, 128, 55, .52) 0 7px, transparent 8px),
          radial-gradient(ellipse at 70% 44%, rgba(124, 164, 74, .46) 0 6px, transparent 7px)`
          : season === 'autumn'
            ? `
          radial-gradient(ellipse at 30% 56%, rgba(212, 112, 28, .62) 0 7px, transparent 8px),
          radial-gradient(ellipse at 70% 44%, rgba(230, 156, 44, .54) 0 6px, transparent 7px),
          radial-gradient(circle at 50% 70%, rgba(126, 72, 30, .36) 0 3px, transparent 4px)`
            : `
          radial-gradient(circle at 30% 44%, rgba(255,255,255,.88) 0 4px, transparent 5px),
          radial-gradient(circle at 62% 58%, rgba(213,231,241,.78) 0 4px, transparent 5px),
          radial-gradient(circle at 78% 32%, rgba(255,255,255,.72) 0 3px, transparent 4px)`};
    opacity: ${({ day }) => (day.isSelected ? 0.72 : 0.48)};
    mix-blend-mode: multiply;
  }

  .cell-decor-alt {
    right: auto;
    left: 10px;
    bottom: 35px;
    width: 22px;
    height: 19px;
    opacity: ${({ day }) => (day.isSelected ? 0.56 : 0.34)};
    transform: rotate(-10deg) scale(0.82);
  }

  .water-drop {
    position: absolute;
    z-index: 3;
    top: 20px;
    width: 5px;
    height: 10px;
    border-radius: 999px 999px 999px 2px;
    background: linear-gradient(180deg, rgba(174, 221, 232, 0.9), rgba(56, 116, 132, 0.28));
    box-shadow: 0 3px 7px rgba(59, 118, 130, 0.12);
    transform: rotate(22deg);
    animation: waterDrop 1.9s ease-in-out infinite;
  }

  .drop-a {
    left: 38%;
    animation-delay: -0.2s;
  }

  .drop-b {
    left: 52%;
    top: 16px;
    animation-delay: -0.7s;
  }

  .water-ripple {
    position: absolute;
    left: 28%;
    right: 24%;
    bottom: 9px;
    z-index: 2;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 50%, rgba(91, 154, 165, 0.3), rgba(60, 104, 107, 0.08) 46%, transparent 70%);
    animation: waterRipple 2.2s ease-out infinite;
  }
`

const CellSoil = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  left: 7px;
  right: 7px;
  bottom: 9px;
  z-index: 0;
  height: ${({ season }) => (season === 'winter' ? '18px' : '20px')};
  border-radius: 48% 52% 30% 30%;
  background: ${({ season, day }) =>
    season === 'winter' && day.moisture !== 'wet'
      ? 'linear-gradient(180deg, rgba(255,255,255,.95), rgba(232,240,245,.84) 45%, rgba(120,105,88,.3) 76%, rgba(255,255,255,.72))'
      : day.moisture === 'wet'
        ? 'linear-gradient(180deg, rgba(108, 89, 63, .3), rgba(72, 52, 36, .78) 54%, rgba(40, 53, 49, .66))'
        : day.moisture === 'dry'
          ? 'linear-gradient(180deg, rgba(196, 151, 91, .45), rgba(131, 84, 49, .72) 56%, rgba(86, 55, 37, .58))'
          : 'linear-gradient(180deg, rgba(154, 111, 69, .42), rgba(99, 67, 43, .78) 56%, rgba(70, 48, 35, .58))'};
  box-shadow:
    inset 0 4px 8px rgba(255, 255, 255, 0.18),
    0 5px 8px rgba(60, 45, 31, 0.13);
  transition:
    background 220ms ease,
    box-shadow 220ms ease,
    filter 220ms ease;
  animation: ${({ day }) => (day.moisture === 'wet' ? 'soilSoak 780ms ease-out' : 'none')};

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

`

const CellPlantCluster = styled.span`
  position: absolute;
  left: var(--x);
  bottom: 0;
  z-index: 2;
  width: 64px;
  height: 82px;
  transform: translateX(-50%);
`

const CellSoilPatch = styled.span<{ season: Season; moisture: CalendarMoisture }>`
  position: absolute;
  left: 50%;
  bottom: 8px;
  z-index: 0;
  width: ${({ moisture }) => (moisture === 'wet' ? '46px' : '40px')};
  height: ${({ season }) => (season === 'winter' ? '17px' : '19px')};
  border-radius: 50% 50% 34% 34%;
  background: ${({ season, moisture }) =>
    moisture === 'wet'
      ? 'linear-gradient(180deg, rgba(103, 91, 66, .2), rgba(63, 48, 35, .82) 55%, rgba(37, 57, 53, .62))'
      : season === 'winter' || moisture === 'frost'
        ? 'linear-gradient(180deg, rgba(255,255,255,.92), rgba(228,240,246,.8) 54%, rgba(132,116,94,.32))'
        : moisture === 'dry'
          ? 'linear-gradient(180deg, rgba(206, 160, 96, .34), rgba(137, 88, 51, .68) 58%, rgba(91, 58, 39, .5))'
          : 'linear-gradient(180deg, rgba(160, 116, 72, .3), rgba(101, 69, 45, .7) 58%, rgba(71, 49, 36, .5))'};
  box-shadow:
    inset 0 3px 7px rgba(255, 255, 255, 0.17),
    0 4px 7px rgba(59, 43, 30, 0.14);
  transform: translateX(-50%);
  animation: ${({ moisture }) => (moisture === 'wet' ? 'anchoredSoilSoak 780ms ease-out' : 'none')};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 18% 55%, rgba(44, 31, 22, .24) 0 2px, transparent 3px),
      radial-gradient(circle at 48% 45%, rgba(231, 210, 172, .22) 0 2px, transparent 3px),
      radial-gradient(circle at 77% 58%, rgba(42, 30, 23, .2) 0 2px, transparent 3px);
    opacity: ${({ season }) => (season === 'winter' ? 0.32 : 0.74)};
    mix-blend-mode: multiply;
  }

  .soil-shine {
    position: absolute;
    left: 15%;
    right: 15%;
    top: 2px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.26);
    opacity: ${({ moisture }) => (moisture === 'dry' ? 0.16 : 0.4)};
  }

  .water-drop {
    top: -24px;
  }

  .drop-a {
    left: 34%;
  }

  .drop-b {
    top: -29px;
    left: 62%;
  }

  .water-ripple {
    left: 5%;
    right: 5%;
    bottom: -1px;
    height: 16px;
  }
`

const CellPlantNode = styled.span<{ active: boolean; plant: Plant; muted: boolean }>`
  position: absolute;
  left: var(--x, 50%);
  bottom: 18px;
  z-index: 1;
  width: 38px;
  height: 58px;
  transform: translateX(-50%) scale(var(--scale));
  transform-origin: 50% 100%;
  opacity: ${({ muted }) => (muted ? 0.5 : 1)};
  animation: ${({ active, muted }) => (active && !muted ? 'anchoredBreathe 6.8s ease-in-out infinite' : 'none')};
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
  transition:
    background 220ms ease,
    box-shadow 220ms ease;
  animation: ${({ day }) => (day.moisture === 'wet' ? 'soilSoak 780ms ease-out' : 'none')};

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

`

const DetailPlantClusterFrame = styled.span<{ compact: boolean }>`
  position: absolute;
  left: var(--x);
  bottom: 0;
  z-index: 2;
  width: ${({ compact }) => (compact ? '64px' : '90px')};
  height: ${({ compact }) => (compact ? '62px' : '94px')};
  transform: translateX(-50%);
`

const DetailSoilPatch = styled.span<{ season: Season; moisture: CalendarMoisture; compact: boolean }>`
  position: absolute;
  left: 50%;
  bottom: ${({ compact }) => (compact ? '7px' : '8px')};
  z-index: 0;
  width: ${({ compact }) => (compact ? '42px' : '66px')};
  height: ${({ compact }) => (compact ? '18px' : '24px')};
  border-radius: 50% 50% 30% 30%;
  background: ${({ season, moisture }) =>
    moisture === 'wet'
      ? seasonTheme[season].wetSoil
      : moisture === 'dry'
        ? seasonTheme[season].drySoil
        : seasonTheme[season].soil};
  box-shadow:
    inset 0 4px 9px rgba(255, 255, 255, 0.18),
    0 5px 8px rgba(65, 48, 34, 0.12);
  transform: translateX(-50%);
  animation: ${({ moisture }) => (moisture === 'wet' ? 'anchoredSoilSoak 780ms ease-out' : 'none')};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 18% 56%, rgba(47, 33, 24, 0.24) 0 2px, transparent 3px),
      radial-gradient(circle at 54% 42%, rgba(219, 203, 174, 0.2) 0 2px, transparent 3px),
      ${({ season }) => seasonTheme[season].particle};
    background-size:
      48px 15px,
      40px 14px,
      34px 12px;
    mix-blend-mode: multiply;
    opacity: ${({ season }) => (season === 'winter' ? 0.42 : 0.72)};
  }

  .soil-shine {
    position: absolute;
    left: 14%;
    right: 14%;
    top: 3px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.28);
    opacity: ${({ moisture }) => (moisture === 'dry' ? 0.18 : 0.4)};
  }

  .puddle {
    position: absolute;
    left: 22%;
    right: 18%;
    bottom: 4px;
    z-index: 1;
    height: ${({ compact }) => (compact ? '6px' : '8px')};
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 50%, rgba(40, 77, 83, 0.52), rgba(31, 55, 56, 0.05) 70%);
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
  position: relative;
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

const TipRibbon = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 1;
  top: -14px;
  right: 12px;
  width: ${({ season }) => (season === 'spring' ? '58px' : '70px')};
  height: ${({ season }) => (season === 'spring' ? '18px' : '24px')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].ribbon});
  background-repeat: no-repeat;
  background-position: right top;
  background-size: contain;
  backface-visibility: hidden;
  opacity: 0.92;
  transform: rotate(${({ season }) => (season === 'spring' ? '-10deg' : '-6deg')});
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

  strong {
    color: #3b433c;
    font-size: 12px;
    font-weight: 700;
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

const TaskList = styled.div`
  display: grid;
  gap: 9px;
`

const TaskEmpty = styled.p`
  margin: 0;
  padding: 12px;
  border: 1px dashed rgba(92, 88, 72, 0.18);
  border-radius: ${radii.control};
  color: #596159;
  background: rgba(255, 255, 255, 0.38);
  font-size: 13px;
`

const TaskComposer = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) 54px;
  gap: 8px;
  margin-bottom: 12px;

  &:has(input) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.15fr) 54px;
  }

  @media (max-width: 430px) {
    grid-template-columns: minmax(0, 1fr);

    &:has(input) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`

const TaskSelect = styled.select`
  min-width: 0;
  width: 100%;
  height: 36px;
  padding: 0 28px 0 10px;
  border: 1px solid rgba(92, 88, 72, 0.15);
  border-radius: ${radii.control};
  color: #202820;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.56)),
    var(--control-surface);
  font-size: 12px;
  line-height: 1;
`

const TaskInput = styled.input`
  min-width: 0;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid rgba(92, 88, 72, 0.15);
  border-radius: ${radii.control};
  color: #202820;
  background: rgba(255, 255, 255, 0.66);
  font-size: 12px;

  &::placeholder {
    color: #7a8178;
  }
`

const AddTaskButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 36px;
  border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent);
  border-radius: ${radii.control};
  color: #ffffff;
  background: var(--accent);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--accent) 17%, transparent);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;

  @media (max-width: 430px) {
    width: 100%;
  }

  &:disabled {
    color: #7a8178;
    background: rgba(255, 255, 255, 0.52);
    box-shadow: none;
    cursor: not-allowed;
  }
`

const TaskItem = styled.div<{ completed: boolean; highlight: boolean }>`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 64px;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 9px 9px 9px 10px;
  border: 1px solid ${({ completed }) => (completed ? 'color-mix(in srgb, var(--accent) 34%, transparent)' : 'rgba(92, 88, 72, 0.13)')};
  border-radius: ${radii.control};
  background: ${({ completed }) =>
    completed
      ? 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, rgba(255,255,255,.76)), rgba(255,255,255,.54))'
      : 'rgba(255, 255, 255, 0.42)'};
  box-shadow: ${({ completed }) => (completed ? '0 10px 22px color-mix(in srgb, var(--accent) 13%, transparent)' : 'none')};
  animation: ${({ highlight }) => (highlight ? 'scheduleComplete 720ms ease-out' : 'none')};
`

const TaskIcon = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: ${radii.control};
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 13%, rgba(255, 255, 255, 0.72));
  font-size: 16px;
  font-weight: 900;
`

const TaskCopy = styled.span`
  min-width: 0;

  strong,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #1c241d;
    font-size: 14px;
  }

  span {
    margin-top: 4px;
    color: #555d54;
    font-size: 12px;
  }
`

const TaskAction = styled.button<{ completed: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 34px;
  border: 1px solid ${({ completed }) => (completed ? 'transparent' : 'color-mix(in srgb, var(--accent) 34%, transparent)')};
  border-radius: ${radii.control};
  color: ${({ completed }) => (completed ? '#ffffff' : 'var(--accent)')};
  background: ${({ completed }) =>
    completed ? 'var(--accent)' : 'linear-gradient(180deg, rgba(255,255,255,.82), color-mix(in srgb, var(--accent) 9%, rgba(255,255,255,.58)))'};
  box-shadow: ${({ completed }) => (completed ? '0 8px 18px color-mix(in srgb, var(--accent) 18%, transparent)' : 'none')};
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  cursor: ${({ completed }) => (completed ? 'default' : 'pointer')};

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
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

const MemoField = styled.textarea`
  display: block;
  width: 100%;
  min-height: 96px;
  resize: vertical;
  margin: 0;
  padding: 12px;
  border: 1px solid rgba(92, 88, 72, 0.15);
  border-radius: ${radii.control};
  color: #333b34;
  background: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  line-height: 1.75;

  &:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  &::placeholder {
    color: #727970;
  }
`
