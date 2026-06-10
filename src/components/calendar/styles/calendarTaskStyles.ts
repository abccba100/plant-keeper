import styled from '@emotion/styled'
import { radii, seasonTheme, shadows } from '../../styles/design-system/tokens'
import type { Season } from '../../../store/calendarData'

export const DetailPanel = styled.aside<{ season: Season }>`
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

  html[data-theme='night'] & {
    background:
      linear-gradient(180deg, rgba(24, 38, 63, 0.92), rgba(10, 18, 32, 0.9)),
      #0d1728;
    border-color: rgba(178, 207, 255, 0.18);
    box-shadow: 0 28px 60px rgba(0, 0, 0, 0.38);
    color: #edf6ff;
  }

  h2 {
    margin: 0 34px 8px 0;
    font-size: 24px;
    line-height: 1.25;
  }
`

export const DetailClose = styled.button`
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

  html[data-theme='night'] & {
    color: #edf6ff;
    background: rgba(18, 30, 51, 0.84);
  }
`

export const SeasonLine = styled.p<{ season: Season }>`
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

  html[data-theme='night'] & strong {
    color: #c9d9f2;
  }
`

export const DetailScene = styled.div`
  position: relative;
  height: 118px;
  margin: 14px 0 21px;
  overflow: hidden;
  border-radius: ${radii.panel};
  background:
    radial-gradient(ellipse at 50% 72%, rgba(122, 91, 58, 0.18), transparent 54%),
    var(--calendar-surface);
`

export const DetailSection = styled.section`
  padding: 14px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.panel};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.56)),
    var(--control-surface);
  box-shadow: 0 10px 24px rgba(58, 52, 42, 0.055);

  html[data-theme='night'] & {
    background:
      linear-gradient(180deg, rgba(20, 34, 57, 0.82), rgba(11, 20, 36, 0.78)),
      var(--control-surface);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.24);
  }

  & + & {
    margin-top: 12px;
  }

  h3 {
    margin: 0 0 12px;
    font-size: 16px;
  }
`

export const TaskList = styled.div`
  display: grid;
  gap: 9px;
`

export const TaskEmpty = styled.p`
  margin: 0;
  padding: 12px;
  border: 1px dashed rgba(92, 88, 72, 0.18);
  border-radius: ${radii.control};
  color: #596159;
  background: rgba(255, 255, 255, 0.38);
  font-size: 13px;

  html[data-theme='night'] & {
    color: #9fb2c8;
    background: rgba(18, 30, 51, 0.62);
    border-color: rgba(178, 207, 255, 0.16);
  }
`

export const TaskComposer = styled.form`
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

export const TaskSelect = styled.select`
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

  html[data-theme='night'] & {
    color: #edf6ff;
    background: rgba(18, 30, 51, 0.86);
    border-color: rgba(178, 207, 255, 0.18);
  }
`

export const TaskInput = styled.input`
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

  html[data-theme='night'] & {
    color: #edf6ff;
    background: rgba(18, 30, 51, 0.86);
    border-color: rgba(178, 207, 255, 0.18);
  }

  html[data-theme='night'] &::placeholder {
    color: #8293aa;
  }
`

export const AddTaskButton = styled.button`
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

  html[data-theme='night'] &:disabled {
    color: #8293aa;
    background: rgba(18, 30, 51, 0.64);
  }
`

export const TaskItem = styled.div<{ completed: boolean; highlight: boolean }>`
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

  html[data-theme='night'] & {
    background: ${({ completed }) =>
      completed
        ? 'linear-gradient(135deg, rgba(127, 168, 255, 0.2), rgba(18, 30, 51, 0.82))'
        : 'rgba(16, 28, 48, 0.72)'};
    border-color: rgba(178, 207, 255, 0.16);
  }
`

export const TaskIcon = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: ${radii.control};
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 13%, rgba(255, 255, 255, 0.72));
  font-size: 16px;
  font-weight: 900;

  html[data-theme='night'] & {
    color: #dbe7ff;
    background: rgba(127, 168, 255, 0.14);
  }
`

export const TaskCopy = styled.span`
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

  html[data-theme='night'] & strong {
    color: #edf6ff;
  }

  html[data-theme='night'] & span {
    color: #9fb2c8;
  }
`

export const TaskAction = styled.button<{ completed: boolean }>`
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

  html[data-theme='night'] & {
    color: ${({ completed }) => (completed ? '#07111f' : '#dbe7ff')};
    background: ${({ completed }) => (completed ? '#dbe7ff' : 'rgba(127, 168, 255, 0.14)')};
    border-color: rgba(178, 207, 255, 0.22);
  }
`

export const DetailPlant = styled.div`
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

export const MiniScene = styled.div`
  position: relative;
  height: 58px;
  overflow: hidden;
`

export const MemoField = styled.textarea`
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

  html[data-theme='night'] & {
    color: #edf6ff;
    background: rgba(18, 30, 51, 0.78);
    border-color: rgba(178, 207, 255, 0.18);
  }

  html[data-theme='night'] &::placeholder {
    color: #8293aa;
  }
`
