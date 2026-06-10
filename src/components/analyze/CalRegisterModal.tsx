import { useState } from 'react'
import { useCalendarStore } from '../../store/calendarStore'
import { defaultSelectedDateBySeason, type Season } from '../../store/calendarData'
import type { PlantKind } from '../../store/plantData'
import { navigate } from '../../api/navigation'
import { Icon } from '../common/Icon'
import { SCHEDULE_PRESETS } from '../../store/schedulePresets'

const START_OPTIONS = [
  { label: '오늘부터', offset: 0 },
  { label: '내일부터', offset: 1 },
  { label: '이번 주말부터', offset: 5 },
]

function CalToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      <span className="thumb" />
    </label>
  )
}

interface Props {
  open: boolean
  preset?: 'identify' | 'diagnose'
  plantName?: string
  plantKind?: PlantKind
  title?: string
  onClose?: () => void
  onConfirm?: () => void
}

interface ModalContentProps {
  preset: 'identify' | 'diagnose'
  plantName: string
  plantKind: PlantKind
  title: string
  onClose: () => void
  onConfirm: () => void
}

function getScheduleDate(season: Season, baseOffset: number, taskOffset: number) {
  const maxDate = season === 'spring' ? 30 : 31
  return Math.min(maxDate, defaultSelectedDateBySeason[season] + baseOffset + taskOffset)
}

export function CalRegisterModal({
  open,
  preset = 'diagnose',
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
  plantName,
  plantKind,
  title,
  onClose,
  onConfirm,
}: ModalContentProps) {
  const season = useCalendarStore((state) => state.season)
  const addTask = useCalendarStore((state) => state.addTask)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const [tasks, setTasks] = useState(() => SCHEDULE_PRESETS[preset].map((t) => ({ ...t })))
  const [startOffset, setStartOffset] = useState(START_OPTIONS[0].offset)
  const [done, setDone] = useState(false)

  const selected = tasks.filter((t) => t.on)
  const toggle = (id: string, val: boolean) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, on: val } : t)))

  const confirm = () => {
    selected.forEach((task) => {
      addTask({
        season,
        date: getScheduleDate(season, startOffset, task.dayOffset),
        type: task.calendarType,
        title: `${plantName} ${task.title}`,
        plantKind,
        time: task.time,
      })
    })
    selectDate(getScheduleDate(season, startOffset, selected[0].dayOffset))
    setDone(true)
    onConfirm()
  }

  const startLabel = START_OPTIONS.find((option) => option.offset === startOffset)?.label ?? START_OPTIONS[0].label
  const sub = `AI가 ${plantName}에게 추천한 관리 일정이에요. 등록할 항목만 선택하세요.`

  return (
    <div className="cal-overlay" onClick={done ? undefined : onClose}>
      <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="cal-success">
            <span className="badge-ok"><Icon name="check" /></span>
            <h2>캘린더에 등록되었어요</h2>
            <p>
              {selected.length}개의 관리 일정이 <b>{startLabel}</b> 추가되었어요.<br />
              캘린더에서 물주기와 상태 확인 일정을 볼 수 있어요.
            </p>
            <div className="reg-actions">
              <button className="btn-ghost" type="button" onClick={onClose}><Icon name="x" />닫기</button>
              <button className="btn-primary" type="button" onClick={() => navigate('/')}>
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

            <div className="cal-list-label">추천 일정 {tasks.length}개</div>
            <div className="cal-list">
              {tasks.map((t) => (
                <div className={`cal-item ${t.on ? '' : 'off'}`} key={t.id}>
                  <span className="ic"><Icon name={t.type} /></span>
                  <div className="copy">
                    <div className="t">{t.title}</div>
                    <div className="d">{t.detail} · {t.when}</div>
                  </div>
                  <CalToggle checked={t.on} onChange={(v) => toggle(t.id, v)} />
                </div>
              ))}
            </div>

            <div className="cal-count">선택한 <b>{selected.length}개</b> 일정을 캘린더에 등록합니다.</div>
            <div className="cal-foot">
              <button className="btn-ghost" type="button" onClick={onClose}>나중에 할게요</button>
              <button className="btn-primary" type="button" onClick={confirm} disabled={selected.length === 0}>
                <Icon name="calendar" />캘린더에 등록
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
