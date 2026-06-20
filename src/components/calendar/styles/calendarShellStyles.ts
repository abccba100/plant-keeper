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

const heroBranch = {
  width: { spring: '382px', summer: '438px', autumn: '470px', winter: '352px' },
  aspectRatio: { spring: '760 / 543', summer: '760 / 420', autumn: '1536 / 1024', winter: '760 / 483' },
  transform: { spring: 'rotate(3deg)', summer: 'rotate(1deg)', autumn: 'scaleX(-1) rotate(3deg)', winter: 'rotate(2deg)' },
  transformOrigin: { spring: 'right top', summer: 'right top', autumn: 'center top', winter: 'right top' },
  shadowOpacity: { spring: 0.16, summer: 0.17, autumn: 0.22, winter: 0.14 },
  shadowBlur: { spring: '10px', summer: '12px', autumn: '13px', winter: '10px' },
  shadowTransform: {
    spring: 'translate(-12px, 16px) scale(1.01)',
    summer: 'translate(-14px, 18px) scale(1.012)',
    autumn: 'translate(16px, 21px) scale(1.012)',
    winter: 'translate(-10px, 14px) scale(1.008)',
  },
  imageOpacity: { spring: 0.82, summer: 0.78, autumn: 0.86, winter: 0.76 },
  tabletWidth: { spring: '292px', summer: '332px', autumn: '360px', winter: '270px' },
  mobileWidth: { spring: '218px', summer: '248px', autumn: '280px', winter: '218px' },
}

const heroShadow = {
  top: { spring: '164px', summer: '130px', autumn: '224px', winter: '122px' },
  width: { spring: '326px', summer: '376px', autumn: '406px', winter: '300px' },
  height: { spring: '68px', summer: '76px', autumn: '90px', winter: '68px' },
  opacity: { spring: 0.13, summer: 0.16, autumn: 0.18, winter: 0.12 },
  transform: { spring: '2deg', summer: '-6deg', autumn: '-3deg', winter: '2deg' },
  tabletTop: { spring: '116px', summer: '104px', autumn: '178px', winter: '116px' },
  tabletWidth: { spring: '238px', summer: '280px', autumn: '318px', winter: '238px' },
  tabletOpacity: { spring: 0.1, summer: 0.1, autumn: 0.12, winter: 0.1 },
}

const subBranch = {
  left: { spring: '220px', summer: '236px', autumn: '220px', winter: '220px' },
  top: { spring: '4px', summer: '22px', autumn: '4px', winter: '4px' },
  width: { spring: '118px', summer: '74px', autumn: '86px', winter: '112px' },
  aspectRatio: { spring: '620 / 387', summer: '520 / 526', autumn: '540 / 529', winter: '620 / 419' },
  opacity: { spring: 0.3, summer: 0.38, autumn: 0.3, winter: 0.32 },
  rotate: { spring: '-6deg', summer: '-8deg', autumn: '-6deg', winter: '-6deg' },
  tabletWidth: { spring: '86px', summer: '64px', autumn: '86px', winter: '86px' },
}

const mascot = {
  right: { spring: '30px', summer: '42px', autumn: '34px', winter: '24px' },
  top: { spring: '94px', summer: '106px', autumn: '100px', winter: '92px' },
  width: { spring: '88px', summer: '60px', autumn: '50px', winter: '58px' },
  aspectRatio: { spring: '360 / 239', summer: '156 / 147', autumn: '99 / 108', winter: '280 / 320' },
  rotate: { spring: '3deg', summer: '-10deg', autumn: '-9deg', winter: '-4deg' },
  tabletRight: { spring: '22px', summer: '32px', autumn: '24px', winter: '18px' },
  tabletTop: { spring: '82px', summer: '84px', autumn: '80px', winter: '76px' },
  tabletWidth: { spring: '70px', summer: '52px', autumn: '42px', winter: '46px' },
}

const floater = {
  left: {
    spring: 'clamp(390px, 34vw, 520px)',
    summer: 'clamp(420px, 36vw, 520px)',
    autumn: 'clamp(420px, 36vw, 520px)',
    winter: 'clamp(420px, 36vw, 520px)',
  },
  top: { spring: '8px', summer: '172px', autumn: '12px', winter: '12px' },
  width: { spring: '104px', summer: '42px', autumn: '42px', winter: '40px' },
  aspectRatio: { spring: '700 / 470', summer: '120 / 126', autumn: '260 / 247', winter: '260 / 228' },
  opacity: { spring: 0.46, summer: 0.72, autumn: 0.82, winter: 0.74 },
  rotate: { spring: '-6deg', summer: '-8deg', autumn: '18deg', winter: '12deg' },
  tabletWidth: { spring: '88px', summer: '36px', autumn: '36px', winter: '34px' },
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
  grid-template-columns: 232px minmax(0, 1fr);
  background: ${({ season }) => seasonTheme[season].pageBackground};
  color: #151815;
  isolation: isolate;
  overflow-x: clip;

  html[data-theme='night'] & {
    --accent: #7fa8ff;
    --accent-deep: #d5e3ff;
    --accent-soft: rgba(127, 168, 255, 0.17);
    --ink-soft: #9fb2c8;
    --surface: #101a2d;
    --line: rgba(182, 209, 255, 0.14);
    --muted-line: rgba(178, 207, 255, 0.1);
    --control-surface: linear-gradient(180deg, rgba(25, 38, 63, 0.88), rgba(12, 20, 35, 0.84));
    --control-line: rgba(178, 207, 255, 0.18);
    --calendar-surface: rgba(13, 23, 40, 0.88);
    --grid-line: rgba(178, 207, 255, 0.11);
    --selected-cell: rgba(127, 168, 255, 0.2);
    background:
      radial-gradient(circle at 82% 6%, rgba(213, 227, 255, 0.38), transparent 9%),
      radial-gradient(circle at 17% 13%, rgba(127, 168, 255, 0.16), transparent 28%),
      radial-gradient(circle at 76% 76%, rgba(83, 197, 185, 0.09), transparent 34%),
      linear-gradient(118deg, #07111f 0%, #0e1829 48%, #050b16 100%);
    color: #edf6ff;
  }

  html[data-theme='night'] &::before,
  html[data-theme='night'] &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  html[data-theme='night'] &::before {
    background:
      radial-gradient(circle at 12% 18%, rgba(255,255,255,0.72) 0 1px, transparent 1.4px),
      radial-gradient(circle at 31% 9%, rgba(209,225,255,0.58) 0 1px, transparent 1.4px),
      radial-gradient(circle at 64% 16%, rgba(255,255,255,0.62) 0 1px, transparent 1.4px),
      radial-gradient(circle at 87% 26%, rgba(199,220,255,0.5) 0 1px, transparent 1.4px),
      radial-gradient(circle at 54% 70%, rgba(255,255,255,0.38) 0 1px, transparent 1.4px);
    opacity: 0.58;
  }

  html[data-theme='night'] &::after {
    background:
      radial-gradient(ellipse at 82% 5%, rgba(214, 229, 255, 0.22), transparent 24%),
      linear-gradient(180deg, rgba(4, 9, 20, 0.18), rgba(3, 7, 15, 0.52));
  }

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
  width: ${({ season }) => heroBranch.width[season]};
  aspect-ratio: ${({ season }) => heroBranch.aspectRatio[season]};
  pointer-events: none;
  display: block;
  overflow: visible;
  isolation: isolate;
  backface-visibility: hidden;
  transform: ${({ season }) => heroBranch.transform[season]};
  transform-origin: ${({ season }) => heroBranch.transformOrigin[season]};

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
    opacity: ${({ season }) => heroBranch.shadowOpacity[season]};
    filter: blur(${({ season }) => heroBranch.shadowBlur[season]}) brightness(0) saturate(0);
    mix-blend-mode: multiply;
    transform: ${({ season }) => heroBranch.shadowTransform[season]};
    transform-origin: right top;
  }

  &::after {
    z-index: 1;
    opacity: ${({ season }) => heroBranch.imageOpacity[season]};
    filter:
      drop-shadow(0 12px 16px color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 10%, rgba(70, 56, 42, 0.16)))
      drop-shadow(0 4px 7px rgba(69, 55, 39, 0.08));
  }

  @media (max-width: 1180px) {
    right: 0;
    width: ${({ season }) => heroBranch.tabletWidth[season]};
  }

  @media (max-width: 900px) {
    right: 0;
    width: ${({ season }) => heroBranch.mobileWidth[season]};
    opacity: 0.62;
  }

  @media (max-width: 640px) {
    display: none;
  }
`

export const PageHeroShadow = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 0;
  top: ${({ season }) => heroShadow.top[season]};
  right: 0;
  width: ${({ season }) => heroShadow.width[season]};
  height: ${({ season }) => heroShadow.height[season]};
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
  opacity: ${({ season }) => heroShadow.opacity[season]};
  transform: rotate(${({ season }) => heroShadow.transform[season]});
  transform-origin: center;

  @media (max-width: 1180px) {
    right: 0;
    top: ${({ season }) => heroShadow.tabletTop[season]};
    width: ${({ season }) => heroShadow.tabletWidth[season]};
    opacity: ${({ season }) => heroShadow.tabletOpacity[season]};
  }

  @media (max-width: 900px) {
    display: none;
  }
`

export const PageSubBranch = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 0;
  left: ${({ season }) => subBranch.left[season]};
  top: ${({ season }) => subBranch.top[season]};
  width: ${({ season }) => subBranch.width[season]};
  aspect-ratio: ${({ season }) => subBranch.aspectRatio[season]};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].sub});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => subBranch.opacity[season]};
  transform: rotate(${({ season }) => subBranch.rotate[season]}) scaleX(-1);
  transform-origin: center;

  @media (max-width: 1180px) {
    left: 192px;
    width: ${({ season }) => subBranch.tabletWidth[season]};
    opacity: 0.26;
  }

  @media (max-width: 900px) {
    display: none;
  }
`

export const PageMascot = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 4;
  right: ${({ season }) => mascot.right[season]};
  top: ${({ season }) => mascot.top[season]};
  width: ${({ season }) => mascot.width[season]};
  aspect-ratio: ${({ season }) => mascot.aspectRatio[season]};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].mascot});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: 0.95;
  transform: rotate(${({ season }) => mascot.rotate[season]});

  @media (max-width: 1180px) {
    right: ${({ season }) => mascot.tabletRight[season]};
    top: ${({ season }) => mascot.tabletTop[season]};
    width: ${({ season }) => mascot.tabletWidth[season]};
    opacity: 0.82;
  }

  @media (max-width: 760px) {
    display: none;
  }
`

export const PageFloater = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 3;
  left: ${({ season }) => floater.left[season]};
  top: ${({ season }) => floater.top[season]};
  width: ${({ season }) => floater.width[season]};
  aspect-ratio: ${({ season }) => floater.aspectRatio[season]};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].floater});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => floater.opacity[season]};
  transform: rotate(${({ season }) => floater.rotate[season]});

  @media (max-width: 1280px) {
    left: clamp(360px, 34vw, 460px);
    width: ${({ season }) => floater.tabletWidth[season]};
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
  grid-template-columns: minmax(0, 1fr) minmax(156px, 176px);
  gap: 20px;
  min-width: 0;
  padding: 30px clamp(18px, 2vw, 28px) 28px;
  overflow: hidden;

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

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 36px;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 28px;
    line-height: 1;
    letter-spacing: 0;
    text-shadow: 0 12px 28px color-mix(in srgb, var(--accent) 18%, transparent);
  }

  @media (max-width: 760px) {
    align-items: flex-start;
  }
`

export const TopBarTitle = styled.div`
  display: grid;
  gap: 7px;
  min-width: 0;

  p {
    margin: 0;
    color: var(--ink-soft);
    font-size: 13.5px;
    font-weight: 700;
    line-height: 1.45;
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

  &[aria-pressed='true'] {
    color: #ffffff;
    background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 88%, #ffffff 12%), var(--accent));
    border-color: color-mix(in srgb, var(--accent) 42%, transparent);
    box-shadow:
      0 12px 24px color-mix(in srgb, var(--accent) 22%, transparent),
      inset 0 1px 0 rgba(255, 255, 255, 0.24);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  html[data-theme='night'] & {
    color: #edf6ff;
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  html[data-theme='night'] &[aria-pressed='true'] {
    color: #07111f;
    background: #dbe7ff;
    border-color: rgba(213, 227, 255, 0.34);
  }
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.panel};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.34)),
    var(--control-surface);
  box-shadow:
    0 16px 34px color-mix(in srgb, var(--accent) 10%, rgba(58, 52, 42, 0.06)),
    inset 0 1px 0 rgba(255, 255, 255, 0.68);

  html[data-theme='night'] & {
    background:
      linear-gradient(180deg, rgba(24, 38, 63, 0.72), rgba(12, 21, 38, 0.62)),
      var(--control-surface);
    box-shadow:
      0 18px 42px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

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

  html[data-theme='night'] & {
    color: #edf6ff;
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
`

export const MonthButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 156px;
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
    font-size: 18px;
    line-height: 1;
    white-space: nowrap;
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  html[data-theme='night'] & {
    color: #edf6ff;
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
`

export const SoftButton = styled.button`
  min-width: 60px;
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

  html[data-theme='night'] & {
    color: #edf6ff;
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
`

export const SoftSelect = styled.select`
  min-width: 112px;
  max-width: 150px;
  height: 42px;
  padding: 0 34px 0 14px;
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

  html[data-theme='night'] & {
    color: #edf6ff;
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
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

  html[data-theme='night'] & {
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
`

export const SeasonTab = styled.button<{ active?: boolean; seasonKey: Season }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 68px;
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

  html[data-theme='night'] & {
    color: ${({ active }) => (active ? '#ffffff' : '#d8e5f7')};
  }
`
