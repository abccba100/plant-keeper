import { useState, type CSSProperties, type FormEvent } from 'react'
import { getPlantMoisture, seasonMeta, type CalendarDay, type Season } from '../../store/calendarData'
import { plants as defaultPlants, type Plant, type PlantId } from '../../store/plantData'
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

export function RightRail({ season }: { season: Season }) {
  const plants = usePlantStore((state) => state.plants)
  const displayPlants = plants.length > 0 ? plants : defaultPlants
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

export function DayDetail({ season, day, onClose }: { season: Season; day: CalendarDay; onClose: () => void }) {
  const addTask = useCalendarStore((state) => state.addTask)
  const completeTask = useCalendarStore((state) => state.completeTask)
  const savedMemo = useCalendarStore((state) => state.memosByDate[day.dateKey])
  const setMemo = useCalendarStore((state) => state.setMemo)
  const lastCompletedTaskId = useCalendarStore((state) => state.lastCompletedTaskId)
  const plants = usePlantStore((state) => state.plants)
  const availablePlants = plants.length > 0 ? plants : defaultPlants
  const [taskValue, setTaskValue] = useState<TaskComposerValue>('watering')
  const [customTaskTitle, setCustomTaskTitle] = useState('')
  const [selectedPlantId, setSelectedPlantId] = useState<PlantId>(day.plants[0]?.id ?? availablePlants[0].id)
  const completedWatering = day.tasks.some((task) => task.type === 'watering' && task.completed)
  const selectedTaskOption = taskComposerOptions.find((option) => option.value === taskValue) ?? taskComposerOptions[0]
  const effectiveSelectedPlantId = availablePlants.some((plant) => plant.id === selectedPlantId)
    ? selectedPlantId
    : day.plants[0]?.id ?? availablePlants[0].id
  const selectedPlant = availablePlants.find((plant) => plant.id === effectiveSelectedPlantId) ?? availablePlants[0]
  const isManualTask = taskValue === 'manual'
  const trimmedCustomTaskTitle = customTaskTitle.trim()
  const canAddTask = !isManualTask || trimmedCustomTaskTitle.length > 0
  const memo = savedMemo ?? '새 잎이 많이 올라오고 있어요. 창가 쪽으로 위치를 옮겨줬어요.'
  const monthLabel = `${day.year}년 ${day.monthIndex + 1}월`

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canAddTask) {
      return
    }

    addTask({
      year: day.year,
      monthIndex: day.monthIndex,
      date: day.date,
      type: selectedTaskOption.calendarType,
      title: isManualTask ? trimmedCustomTaskTitle : selectedTaskOption.title,
      plantId: selectedPlant.id,
      plantKind: selectedPlant.kind,
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
        {monthLabel} {day.date}일
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
            value={effectiveSelectedPlantId}
            onChange={(event) => setSelectedPlantId(event.target.value)}
          >
            {availablePlants.map((plant) => (
              <option key={plant.id} value={plant.id}>
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
          <DetailPlant key={`detail-line-${plant.id}`} data-detail-plant-row={plant.kind} style={{ '--tone': plant.tone } as CSSProperties}>
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
          onChange={(event) => setMemo(day.year, day.monthIndex, day.date, event.target.value)}
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
