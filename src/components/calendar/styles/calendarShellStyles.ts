import styled from '@emotion/styled'
import { radii, seasonTheme } from '../../styles/design-system/tokens'
import type { Season } from '../../../store/calendarData'
import { seasonDecor } from '../decor/seasonDecorRegistry'

// Derived darker tone used by PageSidebar (.brand strong)
const accentDeep: Record<Season, string> = {
  spring: '#46703f',
  summer: '#4f7236',
  autumn: '#95591f',
  winter: '#4f7693',
}

export const Shell = styled.div<{ season: Season }>`
  --accent: ${({ season }) => seasonTheme[season].accent};
  /* --accent-deep: used by PageSidebar */
  --accent-deep: ${({ season }) => accentDeep[season]};
  --accent-soft: ${({ season }) => seasonTheme[season].accentSoft};
  /* --ink-soft: used by PageSidebar (.brand small, .settings) */
  --ink-soft: #495149;
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

export const PageHeroBranch = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  width: ${({ season }) => (season === 'spring' ? '382px' : season === 'autumn' ? '470px' : season === 'summer' ? '438px' : '352px')};
  aspect-ratio: ${({ season }) => (season === 'spring' ? '760 / 543' : season === 'summer' ? '760 / 420' : season === 'autumn' ? '1536 / 1024' : '760 / 483')};
  pointer-events: none;
  display: block;
  overflow: visible;
  isolation: isolate;
  backface-visibility: hidden;
  transform: ${({ season }) => (season === 'autumn' ? 'scaleX(-1) rotate(3deg)' : `rotate(${season === 'summer' ? '1deg' : season === 'winter' ? '2deg' : '3deg'})`)};
  transform-origin: ${({ season }) => (season === 'autumn' ? 'center top' : 'right top')};

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: block;
    background-image: url(${({ season }) => seasonDecor[season].hero});
    background-repeat: no-repeat;
    background-position: right top;
    background-size: contain;
    backface-visibility: hidden;
  }

  &::before {
    z-index: 0;
    opacity: ${({ season }) => (season === 'autumn' ? 0.22 : season === 'summer' ? 0.17 : season === 'winter' ? 0.14 : 0.16)};
    filter: blur(${({ season }) => (season === 'autumn' ? '13px' : season === 'summer' ? '12px' : '10px')}) brightness(0) saturate(0);
    mix-blend-mode: multiply;
    transform: ${({ season }) =>
      season === 'autumn'
        ? 'translate(16px, 21px) scale(1.012)'
        : season === 'summer'
          ? 'translate(-14px, 18px) scale(1.012)'
          : season === 'winter'
            ? 'translate(-10px, 14px) scale(1.008)'
            : 'translate(-12px, 16px) scale(1.01)'};
    transform-origin: right top;
  }

  &::after {
    z-index: 1;
    opacity: ${({ season }) => (season === 'winter' ? 0.76 : season === 'spring' ? 0.82 : season === 'summer' ? 0.78 : 0.86)};
    filter:
      drop-shadow(0 12px 16px color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 10%, rgba(70, 56, 42, 0.16)))
      drop-shadow(0 4px 7px rgba(69, 55, 39, 0.08));
  }

  @media (max-width: 1180px) {
    right: 0;
    width: ${({ season }) => (season === 'spring' ? '292px' : season === 'summer' ? '332px' : season === 'autumn' ? '360px' : '270px')};
  }

  @media (max-width: 900px) {
    right: 0;
    width: ${({ season }) => (season === 'summer' ? '248px' : season === 'autumn' ? '280px' : '218px')};
    opacity: 0.62;
  }

  @media (max-width: 640px) {
    display: none;
  }
`

export const PageHeroShadow = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 0;
  top: ${({ season }) => (season === 'spring' ? '164px' : season === 'summer' ? '130px' : season === 'autumn' ? '224px' : '122px')};
  right: 0;
  width: ${({ season }) => (season === 'spring' ? '326px' : season === 'autumn' ? '406px' : season === 'summer' ? '376px' : '300px')};
  height: ${({ season }) => (season === 'autumn' ? '90px' : season === 'summer' ? '76px' : '68px')};
  pointer-events: none;
  display: block;
  border-radius: 50%;
  background:
    radial-gradient(
      ellipse at 66% 45%,
      color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 22%, rgba(66, 54, 42, 0.28)),
      rgba(88, 72, 48, 0.1) 42%,
      transparent 72%
    );
  filter: blur(18px);
  mix-blend-mode: multiply;
  opacity: ${({ season }) => (season === 'winter' ? 0.12 : season === 'spring' ? 0.13 : season === 'summer' ? 0.16 : 0.18)};
  transform: rotate(${({ season }) => (season === 'summer' ? '-6deg' : season === 'autumn' ? '-3deg' : '2deg')});
  transform-origin: center;

  @media (max-width: 1180px) {
    right: 0;
    top: ${({ season }) => (season === 'summer' ? '104px' : season === 'autumn' ? '178px' : '116px')};
    width: ${({ season }) => (season === 'summer' ? '280px' : season === 'autumn' ? '318px' : '238px')};
    opacity: ${({ season }) => (season === 'autumn' ? 0.12 : 0.1)};
  }

  @media (max-width: 900px) {
    display: none;
  }
`

export const PageSubBranch = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 0;
  left: ${({ season }) => (season === 'summer' ? '236px' : '220px')};
  top: ${({ season }) => (season === 'summer' ? '22px' : '4px')};
  width: ${({ season }) => (season === 'spring' ? '118px' : season === 'summer' ? '74px' : season === 'autumn' ? '86px' : '112px')};
  aspect-ratio: ${({ season }) => (season === 'spring' ? '620 / 387' : season === 'summer' ? '520 / 526' : season === 'autumn' ? '540 / 529' : '620 / 419')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].sub});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => (season === 'winter' ? 0.32 : season === 'summer' ? 0.38 : 0.3)};
  transform: rotate(${({ season }) => (season === 'summer' ? '-8deg' : '-6deg')}) scaleX(-1);
  transform-origin: center;

  @media (max-width: 1180px) {
    left: 192px;
    width: ${({ season }) => (season === 'summer' ? '64px' : '86px')};
    opacity: 0.26;
  }

  @media (max-width: 900px) {
    display: none;
  }
`

export const PageMascot = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 4;
  right: ${({ season }) => (season === 'spring' ? '30px' : season === 'summer' ? '42px' : season === 'autumn' ? '34px' : '24px')};
  top: ${({ season }) => (season === 'spring' ? '94px' : season === 'summer' ? '106px' : season === 'autumn' ? '100px' : '92px')};
  width: ${({ season }) => (season === 'winter' ? '58px' : season === 'summer' ? '60px' : season === 'autumn' ? '50px' : '88px')};
  aspect-ratio: ${({ season }) => (season === 'winter' ? '280 / 320' : season === 'summer' ? '156 / 147' : season === 'autumn' ? '99 / 108' : '360 / 239')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].mascot});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: 0.95;
  transform: rotate(${({ season }) => (season === 'summer' ? '-10deg' : season === 'autumn' ? '-9deg' : season === 'spring' ? '3deg' : '-4deg')});

  @media (max-width: 1180px) {
    right: ${({ season }) => (season === 'spring' ? '22px' : season === 'summer' ? '32px' : season === 'autumn' ? '24px' : '18px')};
    top: ${({ season }) => (season === 'spring' ? '82px' : season === 'summer' ? '84px' : season === 'autumn' ? '80px' : '76px')};
    width: ${({ season }) => (season === 'spring' ? '70px' : season === 'summer' ? '52px' : season === 'winter' ? '46px' : '42px')};
    opacity: 0.82;
  }

  @media (max-width: 760px) {
    display: none;
  }
`

export const PageFloater = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 3;
  left: ${({ season }) => (season === 'spring' ? 'clamp(390px, 34vw, 520px)' : 'clamp(420px, 36vw, 520px)')};
  top: ${({ season }) => (season === 'spring' ? '8px' : season === 'summer' ? '116px' : '12px')};
  width: ${({ season }) => (season === 'spring' ? '104px' : season === 'summer' ? '42px' : season === 'autumn' ? '42px' : '40px')};
  aspect-ratio: ${({ season }) => (season === 'spring' ? '700 / 470' : season === 'summer' ? '120 / 126' : season === 'autumn' ? '260 / 247' : '260 / 228')};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].floater});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => (season === 'spring' ? 0.46 : season === 'summer' ? 0.72 : season === 'winter' ? 0.74 : 0.82)};
  transform: rotate(${({ season }) => (season === 'spring' ? '-6deg' : season === 'summer' ? '-8deg' : season === 'winter' ? '12deg' : '18deg')});

  @media (max-width: 1280px) {
    left: clamp(360px, 34vw, 460px);
    width: ${({ season }) => (season === 'spring' ? '88px' : season === 'winter' ? '34px' : '36px')};
    opacity: 0.7;
  }

  @media (max-width: 900px) {
    display: none;
  }
`


export const Workspace = styled.main`
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

export const CalendarArea = styled.section`
  position: relative;
  min-width: 0;
`

export const SeasonChangeOverlay = styled.div`
  position: absolute;
  inset: 106px 0 0;
  z-index: 8;
  display: grid;
  place-items: center;
  border-radius: ${radii.panel};
  background:
    radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.38) 44%, transparent 72%),
    rgba(245, 243, 238, 0.46);
  backdrop-filter: blur(3px);
  pointer-events: none;
  animation: seasonOverlayIn 140ms ease-out;

  > span {
    width: 44px;
    height: 44px;
    border: 3px solid color-mix(in srgb, var(--accent) 18%, transparent);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: seasonSpin 780ms linear infinite;
  }

  strong {
    position: absolute;
    top: calc(50% + 38px);
    color: var(--accent);
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0;
  }

  @media (max-width: 760px) {
    inset: 154px 0 0;

    strong {
      font-size: 12px;
    }
  }

  @keyframes seasonSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes seasonOverlayIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const TopBar = styled.div`
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

export const IconControls = styled.div`
  display: flex;
  gap: 8px;
`

export const IconButton = styled.button`
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

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  min-width: 0;

  @media (max-width: 1120px) {
    flex-wrap: wrap;
  }
`

export const MonthControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
`

export const ArrowButton = styled.button`
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

export const MonthButton = styled.button`
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

export const SoftButton = styled.button`
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

export const ToolbarSpacer = styled.span`
  flex: 1;

  @media (max-width: 1120px) {
    display: none;
  }
`

export const SeasonTabs = styled.div`
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

export const SeasonTab = styled.button<{ active?: boolean; seasonKey: Season }>`
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
