import styled from '@emotion/styled'
import { useMemo, useState, type FormEvent } from 'react'
import { CanopyAtmosphere } from '../calendar/atmosphere/CanopyAtmosphere'
import { taskComposerOptions, taskTone, type TaskComposerValue } from '../calendar/calendarConfig'
import {
  AddTaskButton,
  ArrowButton,
  DetailSection,
  MemoField,
  MonthControls,
  PageFloater,
  PageHeroBranch,
  PageHeroShadow,
  PageMascot,
  PageSubBranch,
  SeasonLine,
  Shell,
  SoftButton,
  TaskAction,
  TaskComposer,
  TaskCopy,
  TaskEmpty,
  TaskIcon,
  TaskInput,
  TaskItem,
  TaskList,
  TaskSelect,
  Toolbar,
  ToolbarSpacer,
  TopBar,
  TopBarTitle,
} from '../calendar/calendarStyles'
import { Icon } from '../common/Icon'
import { PageSidebar } from '../layout/PageSidebar'
import { radii } from '../styles/design-system/tokens'
import '../styles/shell.css'
import {
  getCalendarDateKey,
  getCalendarDays,
  getCurrentSeason,
  seasonMeta,
  type Season,
} from '../../store/calendarData'
import { plants as defaultPlants, type PlantId } from '../../store/plantData'
import { useCalendarStore } from '../../store/calendarStore'
import { usePlantStore } from '../../store/plantStore'

const DailyWorkspace = styled.main`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 30px clamp(18px, 2vw, 28px) 40px;

  @keyframes scheduleComplete {
    0% { transform: scale(1); }
    20% { transform: scale(1.012); }
    100% { transform: scale(1); }
  }

  @media (max-width: 900px) {
    padding: 20px 12px 28px;
  }
`

const DateDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  height: 42px;
  padding: 0 16px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.control};
  background: var(--control-surface);
  box-shadow:
    0 8px 20px rgba(72, 67, 53, 0.055),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);

  strong {
    font-size: 16px;
    line-height: 1;
    white-space: nowrap;
    color: #141814;
  }

  .today-label {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    margin-left: 9px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
  }

  html[data-theme='night'] & {
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  html[data-theme='night'] & strong {
    color: #edf6ff;
  }
`

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 18px;
`

const StatCard = styled.div<{ variant?: 'done' | 'pending' }>`
  padding: 14px 16px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.panel};
  text-align: center;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.52)),
    var(--control-surface);
  box-shadow: 0 10px 24px rgba(58, 52, 42, 0.05);

  strong {
    display: block;
    font-size: 24px;
    line-height: 1;
    margin-bottom: 5px;
    color: ${({ variant }) =>
      variant === 'done' ? 'var(--accent)' : variant === 'pending' ? '#c9853a' : '#1d2620'};
  }

  span {
    font-size: 12px;
    color: #495149;
    font-weight: 600;
  }

  html[data-theme='night'] & {
    background:
      linear-gradient(180deg, rgba(20, 34, 57, 0.82), rgba(11, 20, 36, 0.78)),
      var(--control-surface);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.24);
  }

  html[data-theme='night'] & strong {
    color: ${({ variant }) =>
      variant === 'done' ? 'var(--accent)' : variant === 'pending' ? '#f0a86e' : '#edf6ff'};
  }

  html[data-theme='night'] & span {
    color: #9fb2c8;
  }
`

const weekDayLabels = ['일', '월', '화', '수', '목', '금', '토']

export function DailyView() {
  const [dayOffset, setDayOffset] = useState(0)

  const completedTaskIds = useCalendarStore((s) => s.completedTaskIds)
  const userTasksByDate = useCalendarStore((s) => s.userTasksByDate)
  const memosByDate = useCalendarStore((s) => s.memosByDate)
  const addTask = useCalendarStore((s) => s.addTask)
  const completeTask = useCalendarStore((s) => s.completeTask)
  const setMemo = useCalendarStore((s) => s.setMemo)
  const lastCompletedTaskId = useCalendarStore((s) => s.lastCompletedTaskId)
  const plants = usePlantStore((s) => s.plants)
  const availablePlants = plants.length > 0 ? plants : defaultPlants

  const todayRef = new Date()
  const displayDate = new Date(todayRef.getFullYear(), todayRef.getMonth(), todayRef.getDate() + dayOffset)
  const season: Season = getCurrentSeason(displayDate)
  const dateNum = displayDate.getDate()
  const displayYear = displayDate.getFullYear()
  const displayMonthIndex = displayDate.getMonth()
  const isToday = dayOffset === 0
  const dateLabel = `${displayDate.getMonth() + 1}월 ${dateNum}일 ${weekDayLabels[displayDate.getDay()]}요일`

  const days = useMemo(
    () => getCalendarDays({ year: displayYear, monthIndex: displayMonthIndex }, dateNum, completedTaskIds, userTasksByDate, availablePlants),
    [displayMonthIndex, displayYear, dateNum, completedTaskIds, userTasksByDate, availablePlants],
  )
  const day = useMemo(() => days.find((d) => d.inMonth && d.date === dateNum), [days, dateNum])

  const totalTasks = day?.tasks.length ?? 0
  const doneTasks = day?.tasks.filter((t) => t.completed).length ?? 0
  const pendingTasks = totalTasks - doneTasks

  const dateKey = getCalendarDateKey(displayYear, displayMonthIndex, dateNum)
  const savedMemo = memosByDate[dateKey] ?? ''

  const [taskValue, setTaskValue] = useState<TaskComposerValue>('watering')
  const [customTaskTitle, setCustomTaskTitle] = useState('')
  const [selectedPlantId, setSelectedPlantId] = useState<PlantId>(availablePlants[0]?.id)

  const isManualTask = taskValue === 'manual'
  const trimmedCustom = customTaskTitle.trim()
  const canAddTask = !isManualTask || trimmedCustom.length > 0
  const selectedOption = taskComposerOptions.find((o) => o.value === taskValue) ?? taskComposerOptions[0]
  const effectivePlantId = availablePlants.some((p) => p.id === selectedPlantId)
    ? selectedPlantId
    : availablePlants[0]?.id
  const selectedPlant = availablePlants.find((p) => p.id === effectivePlantId) ?? availablePlants[0]

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canAddTask) return
    addTask({
      year: displayYear,
      monthIndex: displayMonthIndex,
      date: dateNum,
      type: selectedOption.calendarType,
      title: isManualTask ? trimmedCustom : selectedOption.title,
      plantId: selectedPlant.id,
      plantKind: selectedPlant.kind,
      time: selectedOption.time,
    })
    if (isManualTask) setCustomTaskTitle('')
  }

  return (
    <Shell season={season}>
      <CanopyAtmosphere season={season} />
      <PageHeroShadow season={season} aria-hidden="true" />
      <PageHeroBranch season={season} aria-hidden="true" />
      <PageSubBranch season={season} aria-hidden="true" />
      <PageMascot season={season} aria-hidden="true" />
      <PageFloater season={season} aria-hidden="true" />
      <PageSidebar season={season} activePath="/" />
      <DailyWorkspace>
        <TopBar>
          <TopBarTitle>
            <h1>오늘의 관리</h1>
            <p>{seasonMeta[season].label} 정원 · 날짜를 넘겨 일정을 확인하세요</p>
          </TopBarTitle>
        </TopBar>

        <Toolbar>
          <MonthControls>
            <ArrowButton type="button" onClick={() => setDayOffset((o) => o - 1)} aria-label="이전 날">
              <Icon name="chevL" />
            </ArrowButton>
            <DateDisplay>
              <strong>{dateLabel}</strong>
              {isToday && <span className="today-label">오늘</span>}
            </DateDisplay>
            <ArrowButton type="button" onClick={() => setDayOffset((o) => o + 1)} aria-label="다음 날">
              <Icon name="chevR" />
            </ArrowButton>
          </MonthControls>
          {!isToday && (
            <SoftButton type="button" onClick={() => setDayOffset(0)}>
              오늘로
            </SoftButton>
          )}
          <ToolbarSpacer />
          <SeasonLine season={season}>
            <span />
            {seasonMeta[season].label}
          </SeasonLine>
        </Toolbar>

        <StatRow>
          <StatCard>
            <strong>{totalTasks}</strong>
            <span>총 일정</span>
          </StatCard>
          <StatCard variant="done">
            <strong>{doneTasks}</strong>
            <span>완료</span>
          </StatCard>
          <StatCard variant="pending">
            <strong>{pendingTasks}</strong>
            <span>남은 것</span>
          </StatCard>
        </StatRow>

        <DetailSection>
          <h3>오늘의 일정</h3>
          <TaskComposer onSubmit={handleAddTask}>
            <TaskSelect
              aria-label="추가할 일정 선택"
              value={taskValue}
              onChange={(e) => setTaskValue(e.target.value as TaskComposerValue)}
            >
              {taskComposerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TaskSelect>
            <TaskSelect
              aria-label="일정을 추가할 식물 선택"
              value={effectivePlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
            >
              {availablePlants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </TaskSelect>
            {isManualTask && (
              <TaskInput
                aria-label="직접 입력할 일정"
                placeholder="할일 입력"
                value={customTaskTitle}
                onChange={(e) => setCustomTaskTitle(e.target.value)}
              />
            )}
            <AddTaskButton type="submit" disabled={!canAddTask}>
              추가
            </AddTaskButton>
          </TaskComposer>
          {day && day.tasks.length > 0 ? (
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
                  <TaskAction
                    type="button"
                    completed={task.completed}
                    disabled={task.completed}
                    onClick={() => completeTask(task.id)}
                  >
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
          <h3>메모</h3>
          <MemoField
            aria-label="날짜 메모"
            value={savedMemo}
            placeholder="오늘 식물 상태나 관리 내용을 적어두세요."
            onChange={(e) => setMemo(displayYear, displayMonthIndex, dateNum, e.target.value)}
          />
        </DetailSection>
      </DailyWorkspace>
    </Shell>
  )
}
