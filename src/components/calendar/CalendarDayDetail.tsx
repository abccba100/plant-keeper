import type { CSSProperties, FormEvent } from 'react'
import { getPlantMoisture, seasonMeta, type CalendarDay, type CalendarTask, type Season } from '../../store/calendarData'
import { plants as defaultPlants, type Plant } from '../../store/plantData'
import { useCalendarStore } from '../../store/calendarStore'
import { usePlantStore } from '../../store/plantStore'
import {
  AddTaskButton,
  Avatar,
  CellPlantNode,
  DetailClose,
  DetailPanel,
  DetailPlant,
  DetailPlantClusterFrame,
  DetailScene,
  DetailSection,
  DetailSoilPatch,
  MemoField,
  AddMore,
  RailCard,
  RightPanel,
  TipCard,
  TipGarden,
  TipRibbon,
  MiniScene,
  PlantLine,
  SeasonLine,
  SoilBand,
  TaskAction,
  TaskComposer,
  TaskEmpty,
  TaskIcon,
  TaskInput,
  TaskCopy,
  TaskItem,
  TaskList,
  TaskSelect,
} from './calendarStyles'
import {
  getBaseMoisture,
  getDetailPlantSlot,
  leafNodes,
  taskComposerOptions,
  taskTone,
  withMoisture,
  type TaskComposerValue,
} from './calendarConfig'
import { useTaskComposer } from '../../hooks/useTaskComposer'

type TaskComposerState = {
  taskValue: TaskComposerValue
  setTaskValue: (value: TaskComposerValue) => void
  customTaskTitle: string
  setCustomTaskTitle: (value: string) => void
  effectivePlantId: string | undefined
  setSelectedPlantId: (value: string) => void
  isManualTask: boolean
  canAddTask: boolean
  handleAddTask: (event: FormEvent<HTMLFormElement>) => void
}

export function RightRail({ season }: { season: Season }) {
  const plants = usePlantStore((state) => state.plants)
  const displayPlants = getDisplayPlants(plants)
  const visiblePlants = displayPlants.slice(0, 4)
  const hiddenPlantCount = Math.max(0, displayPlants.length - visiblePlants.length)

  return (
    <RightPanel>
      <RailCard>
        <h2>식물 목록</h2>
        {visiblePlants.map((plant) => (
          <PlantLine key={plant.id} style={{ '--tone': plant.tone } as CSSProperties}>
            <PlantAvatar plant={plant} />
            <span>{plant.name}</span>
            <i />
          </PlantLine>
        ))}
        {hiddenPlantCount > 0 ? <AddMore>+{hiddenPlantCount} 추가</AddMore> : null}
      </RailCard>
      <RailCard>
        <h2>이번 달 요약</h2>
        {visiblePlants.map((plant) => (
          <PlantLine key={`summary-${plant.id}`} style={{ '--tone': plant.tone } as CSSProperties}>
            <PlantAvatar plant={plant} />
            <span>{plant.name}</span>
            <span>-</span>
          </PlantLine>
        ))}
      </RailCard>
      <TipCard season={season}>
        <TipRibbon season={season} data-calendar-decor="tip-ribbon" aria-hidden="true" />
        <h2>{seasonMeta[season].tipTitle}</h2>
        <p>{seasonMeta[season].tip}</p>
        <TipGarden>
          <SoilBand season={season} day={{ inMonth: true, moisture: 'balanced' } as CalendarDay} />
          <PottedPlant plant={displayPlants[0]} index={0} total={2} growth={2} muted={false} />
          <PottedPlant plant={displayPlants[2] ?? displayPlants[0]} index={1} total={2} growth={3} muted={false} />
        </TipGarden>
      </TipCard>
    </RightPanel>
  )
}

function getDisplayPlants(plants: Plant[]) {
  if (plants.length > 0) {
    return plants
  }

  return defaultPlants
}

function getDayStatus(day: CalendarDay) {
  const completedWatering = day.tasks.some((task) => task.type === 'watering' && task.completed)

  if (completedWatering) {
    return '토양이 젖어 있어요'
  }

  if (day.tasks.length > 0) {
    return '수행할 일정이 있어요'
  }

  return '예정된 일정 없음'
}

export function DayDetail({ season, day, onClose }: { season: Season; day: CalendarDay; onClose: () => void }) {
  const completeTask = useCalendarStore((state) => state.completeTask)
  const savedMemo = useCalendarStore((state) => state.memosByDate[day.dateKey])
  const setMemo = useCalendarStore((state) => state.setMemo)
  const lastCompletedTaskId = useCalendarStore((state) => state.lastCompletedTaskId)
  const plants = usePlantStore((state) => state.plants)
  const availablePlants = getDisplayPlants(plants)
  const dayStatus = getDayStatus(day)
  const taskComposer = useTaskComposer({
    date: {
      year: day.year,
      monthIndex: day.monthIndex,
      date: day.date,
    },
    plants: availablePlants,
    initialPlantId: day.plants[0]?.id,
  })
  const memo = savedMemo ?? '새 잎이 많이 올라오고 있어요. 창가 쪽으로 위치를 옮겨줬어요.'
  const monthLabel = `${day.year}년 ${day.monthIndex + 1}월`

  return (
    <DetailPanel season={season}>
      <DetailClose type="button" onClick={onClose} aria-label="상세 닫기">
        ×
      </DetailClose>
      <h2>
        {monthLabel} {day.date}일
      </h2>
      <SeasonLine season={season}>
        <span />
        {seasonMeta[season].label}
        <strong>{dayStatus}</strong>
      </SeasonLine>
      <DetailScene>
        <SoilBand season={season} day={withMoisture({ ...day, inMonth: true }, getBaseMoisture(season))} />
        {day.plants.map((plant, index) => (
          <PottedPlantCluster key={`detail-${plant.name}-${index}`} season={season} day={day} plant={plant} index={index} total={day.plants.length} growth={3} />
        ))}
      </DetailScene>
      <DetailSection>
        <h3>오늘의 일정</h3>
        <TaskComposerForm taskComposer={taskComposer} plants={availablePlants} />
        <DayTaskList
          tasks={day.tasks}
          lastCompletedTaskId={lastCompletedTaskId}
          onCompleteTask={completeTask}
        />
      </DetailSection>
      <DetailPlantsSection season={season} day={day} />
      <DetailSection>
        <h3>메모</h3>
        <MemoField
          aria-label="날짜 메모"
          value={memo}
          placeholder="오늘 식물 상태나 관리 내용을 적어두세요."
          onChange={(event) => setMemo(day.year, day.monthIndex, day.date, event.target.value)}
        />
      </DetailSection>
    </DetailPanel>
  )
}

function TaskComposerForm({ taskComposer, plants }: { taskComposer: TaskComposerState; plants: Plant[] }) {
  return (
    <TaskComposer onSubmit={taskComposer.handleAddTask}>
      <TaskSelect
        aria-label="추가할 일정 선택"
        value={taskComposer.taskValue}
        onChange={(event) => taskComposer.setTaskValue(event.target.value as TaskComposerValue)}
      >
        {taskComposerOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TaskSelect>
      <TaskSelect
        aria-label="일정을 추가할 식물 선택"
        value={taskComposer.effectivePlantId}
        onChange={(event) => taskComposer.setSelectedPlantId(event.target.value)}
      >
        {plants.map((plant) => (
          <option key={plant.id} value={plant.id}>
            {plant.name}
          </option>
        ))}
      </TaskSelect>
      {taskComposer.isManualTask ? (
        <TaskInput
          aria-label="직접 입력할 일정"
          placeholder="할일 입력"
          value={taskComposer.customTaskTitle}
          onChange={(event) => taskComposer.setCustomTaskTitle(event.target.value)}
        />
      ) : null}
      <AddTaskButton type="submit" disabled={!taskComposer.canAddTask}>
        추가
      </AddTaskButton>
    </TaskComposer>
  )
}

function DayTaskList({
  tasks,
  lastCompletedTaskId,
  onCompleteTask,
}: {
  tasks: CalendarTask[]
  lastCompletedTaskId: string | undefined
  onCompleteTask: (taskId: string) => void
}) {
  if (tasks.length === 0) {
    return <TaskEmpty>등록된 일정이 없습니다.</TaskEmpty>
  }

  return (
    <TaskList>
      {tasks.map((task) => (
        <TaskItem key={task.id} completed={task.completed} highlight={lastCompletedTaskId === task.id}>
          <TaskIcon>{task.completed ? '✓' : taskTone[task.type].icon}</TaskIcon>
          <TaskCopy>
            <strong>{task.title}</strong>
            <span>
              {task.time} · {task.plant.name}
            </span>
          </TaskCopy>
          <TaskAction type="button" completed={task.completed} disabled={task.completed} onClick={() => onCompleteTask(task.id)}>
            {task.completed ? '완료됨' : '수행'}
          </TaskAction>
        </TaskItem>
      ))}
    </TaskList>
  )
}

function DetailPlantsSection({ season, day }: { season: Season; day: CalendarDay }) {
  return (
    <DetailSection>
      <h3>이 날의 식물 상태</h3>
      {day.plants.map((plant) => (
        <DetailPlantRow key={`detail-line-${plant.id}`} season={season} day={day} plant={plant} />
      ))}
    </DetailSection>
  )
}

function DetailPlantRow({ season, day, plant }: { season: Season; day: CalendarDay; plant: Plant }) {
  return (
    <DetailPlant data-detail-plant-row={plant.kind} style={{ '--tone': plant.tone } as CSSProperties}>
      <PlantAvatar plant={plant} />
      <span>{plant.name}</span>
      <i />
      <MiniScene>
        <SoilBand season={season} day={withMoisture({ ...day, inMonth: true }, getBaseMoisture(season))} />
        <PottedPlantCluster compact season={season} day={day} plant={plant} index={0} total={1} growth={2} />
      </MiniScene>
    </DetailPlant>
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
  const scale = getPottedPlantScale(plant, growth)

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

function getPottedPlantScale(plant: Plant, growth: CalendarDay['growth']) {
  const baseScale = 0.72 + growth * 0.055

  if (plant.kind === 'monstera') {
    return baseScale + 0.08
  }

  return baseScale
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
