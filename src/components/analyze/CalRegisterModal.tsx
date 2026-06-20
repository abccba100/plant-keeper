import { useState } from 'react'
import { useCalendarStore } from '../../store/calendarStore'
import type { Plant, PlantId, PlantKind } from '../../store/plantData'
import { navigate } from '../../api/navigation'
import { Icon } from '../common/Icon'
import { SCHEDULE_PRESETS } from '../../store/schedulePresets'

const START_OPTIONS = [
  { label: '오늘부터', offset: 0 },
  { label: '내일부터', offset: 1 },
  { label: '이번 주말부터', offset: 5 },
]

function CalToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="track" />
      <span className="thumb" />
    </label>
  )
}

interface Props {
  open: boolean
  preset?: 'identify' | 'diagnose'
  plantId?: PlantId
  plantName?: string
  plantKind?: PlantKind
  title?: string
  onClose?: () => void
  onConfirm?: () => Plant | undefined | void
}

interface ModalContentProps {
  preset: 'identify' | 'diagnose'
  plantId?: PlantId
  plantName: string
  plantKind: PlantKind
  title: string
  onClose: () => void
  onConfirm: () => Plant | undefined | void
}

type ScheduleDate = {
  year: number
  monthIndex: number
  date: number
  label: string
}

function getScheduleDate(year: number, monthIndex: number, selectedDate: number, baseOffset: number, taskOffset: number): ScheduleDate {
  const scheduledDate = new Date(year, monthIndex, selectedDate + baseOffset + taskOffset)

  return {
    year: scheduledDate.getFullYear(),
    monthIndex: scheduledDate.getMonth(),
    date: scheduledDate.getDate(),
    label: `${scheduledDate.getMonth() + 1}월 ${scheduledDate.getDate()}일`,
  }
}

export function CalRegisterModal({
  open,
  preset = 'diagnose',
  plantId,
  plantName = '몬스테라',
  plantKind = 'monstera',
  title = '관리 일정을 캘린더에 등록할까요?',
  onClose = () => {},
  onConfirm = () => {},
}: Props) {
  if (!open) return null

  return (
    <CalRegisterModalContent
      key={preset}
      preset={preset}
      plantId={plantId}
      plantName={plantName}
      plantKind={plantKind}
      title={title}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

function CalRegisterModalContent({
  preset,
  plantId,
  plantName,
  plantKind,
  title,
  onClose,
  onConfirm,
}: ModalContentProps) {
  const visibleYear = useCalendarStore((state) => state.visibleYear)
  const visibleMonthIndex = useCalendarStore((state) => state.visibleMonthIndex)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const addTask = useCalendarStore((state) => state.addTask)
  const selectCalendarDate = useCalendarStore((state) => state.selectCalendarDate)
  const [scheduleTasks, setScheduleTasks] = useState(() => SCHEDULE_PRESETS[preset].map((task) => ({ ...task })))
  const [startOffset, setStartOffset] = useState(START_OPTIONS[0].offset)
  const [done, setDone] = useState(false)

  const taskRows = scheduleTasks.map((task) => ({
    task,
    scheduleDate: getScheduleDate(visibleYear, visibleMonthIndex, selectedDate, startOffset, task.dayOffset),
  }))
  const selectedScheduleRows = taskRows.filter((row) => row.task.on)
  const startLabel = START_OPTIONS.find((option) => option.offset === startOffset)?.label ?? START_OPTIONS[0].label
  const sub = `AI가 ${plantName}에게 추천한 관리 일정이에요. 등록할 항목만 선택하세요.`

  function handleTaskToggle(taskId: string, isSelected: boolean) {
    setScheduleTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        return { ...task, on: isSelected }
      })
    )
  }

  function handleConfirm() {
    if (selectedScheduleRows.length === 0) {
      return
    }

    const confirmedPlant = onConfirm()
    const confirmedPlantId = confirmedPlant?.id ?? plantId

    selectedScheduleRows.forEach(({ task, scheduleDate }) => {
      addTask({
        year: scheduleDate.year,
        monthIndex: scheduleDate.monthIndex,
        date: scheduleDate.date,
        type: task.calendarType,
        title: `${plantName} ${task.title}`,
        plantId: confirmedPlantId,
        plantKind,
        time: task.time,
      })
    })
    const firstDate = selectedScheduleRows[0].scheduleDate
    selectCalendarDate(firstDate.year, firstDate.monthIndex, firstDate.date)
    setDone(true)
  }

  return (
    <div className="cal-overlay" onClick={done ? undefined : onClose}>
      <div className="cal-modal" onClick={(event) => event.stopPropagation()}>
        {done ? (
          <div className="cal-success">
            <span className="badge-ok"><Icon name="check" /></span>
            <h2>캘린더에 등록되었어요</h2>
            <p>
              {selectedScheduleRows.length}개의 관리 일정이 <b>{startLabel}</b> 추가되었어요.<br />
              캘린더에서 물주기와 상태 확인 일정을 볼 수 있어요.
            </p>
            <div className="reg-actions">
              <button className="btn-ghost" type="button" onClick={onClose}><Icon name="x" />닫기</button>
              <button className="btn-primary" type="button" onClick={() => navigate('/calendar')}>
                <Icon name="calendar" />캘린더로 이동
              </button>
            </div>
          </div>
        ) : (
          <>
            <button className="cal-close" type="button" onClick={onClose} aria-label="닫기"><Icon name="x" /></button>
            <div className="cal-head">
              <span className="ic"><Icon name="calendar" /></span>
              <div>
                <h2>{title}</h2>
                <p>{sub}</p>
              </div>
            </div>

            <div className="cal-startrow">
              <span className="lbl"><Icon name="clock" />시작 시점</span>
              <select value={startOffset} onChange={(e) => setStartOffset(Number(e.target.value))}>
                {START_OPTIONS.map((option) => <option key={option.label} value={option.offset}>{option.label}</option>)}
              </select>
            </div>

            <div className="cal-list-label">추천 일정 {scheduleTasks.length}개</div>
            <div className="cal-list">
              {taskRows.map(({ task, scheduleDate }) => (
                <div className={`cal-item ${task.on ? '' : 'off'}`} key={task.id}>
                  <span className="ic"><Icon name={task.type} /></span>
                  <div className="copy">
                    <div className="t">{task.title}</div>
                    <div className="d">{task.detail} · {scheduleDate.label} {task.when}</div>
                  </div>
                  <CalToggle checked={task.on} onChange={(isSelected) => handleTaskToggle(task.id, isSelected)} />
                </div>
              ))}
            </div>

            <div className="cal-count">선택한 <b>{selectedScheduleRows.length}개</b> 일정을 캘린더에 등록합니다.</div>
            <div className="cal-foot">
              <button className="btn-ghost" type="button" onClick={onClose}>나중에 할게요</button>
              <button className="btn-primary" type="button" onClick={handleConfirm} disabled={selectedScheduleRows.length === 0}>
                <Icon name="calendar" />캘린더에 등록
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
