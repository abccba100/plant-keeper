import type { CalendarTaskType } from './calendarData'

type ScheduleIcon = 'drop' | 'leaf' | 'refresh' | 'sprout' | 'search' | 'sun'

export interface ScheduleTask {
  id: string
  type: ScheduleIcon
  calendarType: CalendarTaskType
  title: string
  detail: string
  when: string
  time: string
  dayOffset: number
  on: boolean
}

export const SCHEDULE_PRESETS: Record<'identify' | 'diagnose', ScheduleTask[]> = {
  identify: [
    { id: 'water', type: 'drop', calendarType: 'watering', title: '물주기', detail: '겉흙이 마르면 충분히', when: '7일 간격', time: '오전 9:00', dayOffset: 0, on: true },
    { id: 'mist', type: 'leaf', calendarType: 'mist', title: '잎 분무', detail: '습도 유지', when: '주 2회', time: '오후 4:00', dayOffset: 2, on: true },
    { id: 'rotate', type: 'refresh', calendarType: 'rotate', title: '화분 돌리기', detail: '고른 성장', when: '2주 간격', time: '오후 1:00', dayOffset: 7, on: false },
    { id: 'fertilize', type: 'sprout', calendarType: 'fertilize', title: '영양제', detail: '성장기 보충', when: '월 1회', time: '오전 10:00', dayOffset: 14, on: false },
  ],
  diagnose: [
    { id: 'water', type: 'drop', calendarType: 'watering', title: '물주기 조정', detail: '겉흙 마른 뒤 급수', when: '10일 간격', time: '오전 9:00', dayOffset: 0, on: true },
    { id: 'recheck', type: 'search', calendarType: 'check', title: '상태 재확인', detail: '갈변 진행 관찰', when: '2주 후', time: '오후 6:00', dayOffset: 14, on: true },
    { id: 'mist', type: 'leaf', calendarType: 'mist', title: '잎 분무', detail: '건조 완화', when: '주 2회', time: '오후 4:00', dayOffset: 2, on: true },
    { id: 'move', type: 'sun', calendarType: 'check', title: '자리 옮기기 확인', detail: '간접광 위치 점검', when: '3일 후', time: '오전 11:00', dayOffset: 3, on: false },
  ],
}
