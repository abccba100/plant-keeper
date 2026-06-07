import { useState } from 'react'
import { Icon } from '../../shared/ui/Icon'

type IconName = Parameters<typeof Icon>[0]['name']

interface ScheduleTask {
  id: string
  type: IconName
  title: string
  detail: string
  when: string
  on: boolean
}

const SCHEDULE_PRESETS: Record<string, ScheduleTask[]> = {
  identify: [
    { id: 'water', type: 'drop', title: '물주기', detail: '겉흙이 마르면 충분히', when: '7일 간격', on: true },
    { id: 'mist', type: 'leaf', title: '잎 분무', detail: '습도 유지', when: '주 2회', on: true },
    { id: 'rotate', type: 'refresh', title: '화분 돌리기', detail: '고른 생장', when: '2주 간격', on: false },
    { id: 'fertilize', type: 'sprout', title: '영양제', detail: '생장기 보충', when: '월 1회', on: false },
  ],
  diagnose: [
    { id: 'water', type: 'drop', title: '물주기 (조정)', detail: '과습 회복 · 겉흙 마른 뒤', when: '10일 간격', on: true },
    { id: 'recheck', type: 'search', title: '상태 재확인', detail: '갈변 잎 진행 관찰', when: '2주 후', on: true },
    { id: 'mist', type: 'leaf', title: '잎 분무', detail: '건조 완화', when: '주 2회', on: true },
    { id: 'move', type: 'sun', title: '자리 옮기기 확인', detail: '간접광 위치 점검', when: '3일 후', on: false },
  ],
}

const START_OPTIONS = ['오늘부터', '내일부터', '이번 주말부터']

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
  title?: string
  onClose?: () => void
  onConfirm?: () => void
}

export function CalRegisterModal({
  open,
  preset = 'diagnose',
  plantName = '몬스테라',
  title = '관리 일정을 캘린더에 등록할까요?',
  onClose = () => {},
  onConfirm = () => {},
}: Props) {
  const initial = (SCHEDULE_PRESETS[preset] ?? SCHEDULE_PRESETS.diagnose).map((t) => ({ ...t }))
  const [tasks, setTasks] = useState(initial)
  const [start, setStart] = useState(START_OPTIONS[0])
  const [done, setDone] = useState(false)

  if (!open) return null

  const selected = tasks.filter((t) => t.on)
  const toggle = (id: string, val: boolean) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, on: val } : t)))

  const confirm = () => {
    setDone(true)
    onConfirm()
  }

  const sub = `AI가 ${plantName}에게 추천한 관리 일정이에요. 등록할 항목만 선택하세요.`

  return (
    <div className="cal-overlay" onClick={done ? undefined : onClose}>
      <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="cal-success">
            <span className="badge-ok"><Icon name="check" /></span>
            <h2>캘린더에 등록했어요!</h2>
            <p>
              {selected.length}개의 관리 일정이 <b>{start.replace('부터', '')}</b> 추가됐어요.<br />
              물주기·분무 알림을 캘린더에서 확인할 수 있어요.
            </p>
            <div className="reg-actions">
              <button className="btn-ghost" onClick={onClose}><Icon name="x" />닫기</button>
              <button
                className="btn-primary"
                onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}
              >
                <Icon name="calendar" />캘린더로 이동
              </button>
            </div>
          </div>
        ) : (
          <>
            <button className="cal-close" onClick={onClose} aria-label="닫기"><Icon name="x" /></button>
            <div className="cal-head">
              <span className="ic"><Icon name="calendar" /></span>
              <div>
                <h2>{title}</h2>
                <p>{sub}</p>
              </div>
            </div>

            <div className="cal-startrow">
              <span className="lbl"><Icon name="clock" />시작 시점</span>
              <select value={start} onChange={(e) => setStart(e.target.value)}>
                {START_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
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

            <div className="cal-count">선택한 <b>{selected.length}개</b> 일정이 캘린더에 반복 등록됩니다</div>
            <div className="cal-foot">
              <button className="btn-ghost" onClick={onClose}>나중에 할게요</button>
              <button className="btn-primary" onClick={confirm} disabled={selected.length === 0}>
                <Icon name="calendar" />캘린더에 등록
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export { SCHEDULE_PRESETS }
