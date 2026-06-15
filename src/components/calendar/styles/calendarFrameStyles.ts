import styled from '@emotion/styled'
import { radii, seasonTheme } from '../../styles/design-system/tokens'
import type { CalendarDay, Season } from '../../../store/calendarData'
import { seasonDecor } from '../decor/seasonDecorRegistry'

export const CalendarFrame = styled.div`
  position: relative;
  overflow: hidden;
  border: 1px solid var(--grid-line);
  border-radius: ${radii.panel};
  background: var(--calendar-surface);
  box-shadow:
    0 18px 44px color-mix(in srgb, var(--accent) 14%, rgba(58, 52, 42, 0.07)),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);

  html[data-theme='night'] & {
    box-shadow:
      0 22px 52px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(213, 227, 255, 0.12);
  }
`

export const CalendarFootGrass = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 2;
  left: ${({ season }) => (season === 'autumn' || season === 'winter' ? '18px' : '10px')};
  bottom: ${({ season }) => (season === 'spring' ? '8px' : season === 'summer' ? '9px' : season === 'autumn' ? '10px' : '8px')};
  width: ${({ season }) => (season === 'spring' ? '118px' : season === 'summer' ? '116px' : season === 'autumn' ? '88px' : '72px')};
  aspect-ratio: ${({ season }) => (season === 'spring' ? '900 / 285' : season === 'summer' ? '900 / 171' : season === 'autumn' ? '204 / 84' : '360 / 253')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].ground});
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => (season === 'spring' ? 0.34 : season === 'summer' ? 0.32 : season === 'autumn' ? 0.28 : 0.3)};

  @media (max-width: 900px) {
    bottom: 7px;
    width: ${({ season }) => (season === 'spring' ? '94px' : season === 'summer' ? '92px' : season === 'autumn' ? '70px' : '62px')};
    opacity: 0.24;
  }

  @media (max-width: 560px) {
    display: none;
  }
`

export const CalendarFootGrassAlt = styled(CalendarFootGrass)<{ season: Season }>`
  left: auto;
  right: 22px;
  bottom: ${({ season }) => (season === 'spring' ? '8px' : '9px')};
  width: ${({ season }) => (season === 'spring' ? '106px' : season === 'summer' ? '118px' : '0')};
  display: ${({ season }) => (season === 'spring' || season === 'summer' ? 'block' : 'none')};
  transform: scaleX(-1);
  opacity: ${({ season }) => (season === 'spring' ? 0.28 : 0.26)};

  @media (max-width: 900px) {
    right: 12px;
    width: ${({ season }) => (season === 'spring' ? '78px' : '86px')};
  }
`

export const WeekHeader = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  height: 44px;
  border-bottom: 1px solid var(--grid-line);
  background: var(--grid-line);
`

export const Weekday = styled.div<{ sunday?: boolean }>`
  display: grid;
  place-items: center;
  color: ${({ sunday }) => (sunday ? '#e12b2b' : '#151815')};
  background: color-mix(in srgb, var(--surface) 74%, rgba(255, 255, 255, 0.68));
  font-weight: 700;
  font-size: 14px;

  html[data-theme='night'] & {
    color: ${({ sunday }) => (sunday ? '#ff9b9b' : '#dbe8fb')};
    background: rgba(18, 30, 51, 0.92);
  }
`

export const CalendarGrid = styled.div`
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
    min-height: clamp(98px, 11.4vh, 122px);
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
      min-height: 88px;
    }
  }
`

export const DayCell = styled.div<{ season: Season; day: CalendarDay }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-height: clamp(98px, 11.4vh, 122px);
  padding: 12px 11px 0;
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

  html[data-theme='night'] & {
    background: ${({ day, season }) =>
      season === 'winter'
        ? day.isSelected
          ? 'linear-gradient(180deg, rgba(34, 54, 79, 0.88), rgba(18, 34, 53, 0.9) 50%, rgba(17, 37, 48, 0.88))'
          : 'linear-gradient(180deg, rgba(13, 24, 42, 0.9), rgba(12, 24, 39, 0.91) 52%, rgba(14, 31, 42, 0.88))'
        : day.isSelected
          ? 'rgba(127, 168, 255, 0.22)'
          : 'rgba(13, 24, 42, 0.82)'};
    box-shadow:
      inset 0 1px 0 rgba(213, 227, 255, 0.08),
      inset 0 -28px 36px ${({ season }) => (season === 'winter' ? 'rgba(157, 212, 232, 0.045)' : 'rgba(0, 0, 0, 0.1)')};
  }

  html[data-theme='night'] &:hover {
    background: ${({ season }) =>
      season === 'winter'
        ? 'linear-gradient(180deg, rgba(36, 58, 85, 0.92), rgba(18, 36, 55, 0.92) 50%, rgba(18, 41, 53, 0.9))'
        : `
      linear-gradient(135deg, rgba(127, 168, 255, 0.18), rgba(12, 22, 40, 0.9)),
      rgba(13, 24, 42, 0.88)`};
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
    min-height: 88px;
    padding: 9px 7px 0;
  }
`

export const DateText = styled.span<{ day: CalendarDay }>`
  position: absolute;
  top: 13px;
  left: 12px;
  z-index: 3;
  display: inline-grid;
  place-items: center;
  min-width: ${({ day }) => (day.isToday ? '29px' : 'auto')};
  height: ${({ day }) => (day.isToday ? '29px' : 'auto')};
  border-radius: 50%;
  color: ${({ day }) => (day.isToday ? '#ffffff' : day.isSunday ? '#ff2323' : day.inMonth ? '#111711' : '#aaa9a1')};
  background: ${({ day }) => (day.isToday ? 'var(--accent)' : 'transparent')};
  box-shadow: ${({ day }) => (day.isToday ? '0 7px 14px color-mix(in srgb, var(--accent) 28%, transparent)' : 'none')};
  font-size: ${({ day }) => (day.isToday ? '15px' : '16px')};
  font-weight: 700;

  html[data-theme='night'] & {
    color: ${({ day }) => (day.isToday ? '#07111f' : day.isSunday ? '#ff9b9b' : day.inMonth ? '#e7f0ff' : '#697b95')};
    background: ${({ day }) => (day.isToday ? '#dbe7ff' : 'transparent')};
  }

  @media (max-width: 760px) {
    top: 9px;
    left: 7px;
    min-width: ${({ day }) => (day.isToday ? '26px' : 'auto')};
    height: ${({ day }) => (day.isToday ? '26px' : 'auto')};
    font-size: 14px;
  }
`

export const TodayBadge = styled.span`
  position: absolute;
  z-index: 4;
  top: 46px;
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

  html[data-theme='night'] & {
    color: #dbe7ff;
    background: rgba(127, 168, 255, 0.14);
    border-color: rgba(213, 227, 255, 0.24);
  }

  @media (max-width: 760px) {
    display: none;
  }
`

export const TaskChip = styled.span<{ completed: boolean }>`
  position: absolute;
  top: 12px;
  right: 10px;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  max-width: calc(100% - 54px);
  height: 24px;
  gap: 5px;
  padding: 0 7px;
  border: 1px solid ${({ completed }) => (completed ? 'color-mix(in srgb, var(--accent) 42%, transparent)' : 'rgba(88, 85, 71, 0.14)')};
  border-radius: ${radii.round};
  color: ${({ completed }) => (completed ? 'var(--accent)' : '#323b33')};
  background: ${({ completed }) =>
    completed
      ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.8), color-mix(in srgb, var(--accent) 10%, rgba(255, 255, 255, 0.66)))'
      : 'rgba(255, 255, 255, 0.64)'};
  box-shadow: ${({ completed }) => (completed ? '0 8px 18px color-mix(in srgb, var(--accent) 16%, transparent)' : 'none')};
  font-size: 11.5px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;

  html[data-theme='night'] & {
    color: ${({ completed }) => (completed ? '#dbe7ff' : '#edf6ff')};
    border-color: rgba(178, 207, 255, 0.18);
    background: ${({ completed }) =>
      completed
        ? 'linear-gradient(180deg, rgba(127, 168, 255, 0.22), rgba(20, 35, 60, 0.82))'
        : 'rgba(11, 20, 36, 0.72)'};
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
  }

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
