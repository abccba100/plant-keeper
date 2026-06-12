import styled from '@emotion/styled'
import { seasonTheme } from '../../styles/design-system/tokens'
import type { CalendarDay, CalendarMoisture, Season } from '../../../store/calendarData'
import type { Plant } from '../../../store/plantData'

const nightWetSoil =
  'linear-gradient(180deg, rgba(94, 135, 144, .3), rgba(32, 60, 65, .88) 54%, rgba(17, 42, 43, .78))'
const nightDrySoil =
  'linear-gradient(180deg, rgba(157, 116, 72, .3), rgba(91, 61, 42, .78) 58%, rgba(50, 37, 31, .72))'
const nightSoil =
  'linear-gradient(180deg, rgba(124, 94, 65, .28), rgba(72, 52, 38, .78) 58%, rgba(42, 35, 31, .7))'
const nightFrostSoil =
  'linear-gradient(180deg, rgba(219, 239, 249, .9), rgba(119, 151, 168, .62) 49%, rgba(42, 60, 68, .76))'
const nightWetPatch =
  'linear-gradient(180deg, rgba(124, 176, 189, .28), rgba(28, 67, 73, .88) 56%, rgba(15, 47, 48, .78))'
const nightFrostPatch =
  'linear-gradient(180deg, rgba(232, 246, 253, .9), rgba(126, 159, 177, .58) 55%, rgba(48, 68, 78, .74))'

export const Landscape = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  z-index: 1;
  height: 88px;
  opacity: ${({ day }) => (day.inMonth ? 1 : 0.36)};
  transform: translateZ(0);

  &::before {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 54px;
    background:
      radial-gradient(ellipse at 50% 94%, rgba(55, 42, 29, 0.13), transparent 58%),
      radial-gradient(ellipse at 52% 82%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 18%, transparent), transparent 68%),
      ${({ season }) => seasonTheme[season].particle};
    background-size:
      auto,
      54px 18px;
    mix-blend-mode: multiply;
    opacity: ${({ season }) => (season === 'winter' ? 0.34 : 0.52)};
  }

  html[data-theme='night'] &::before {
    background: ${({ season }) =>
      season === 'winter'
        ? `
      radial-gradient(ellipse at 50% 96%, rgba(124, 171, 188, 0.16), transparent 62%),
      linear-gradient(180deg, transparent 8%, rgba(141, 185, 204, 0.08) 68%, rgba(202, 232, 244, 0.1))`
        : `
      radial-gradient(ellipse at 50% 94%, rgba(55, 42, 29, 0.13), transparent 58%),
      radial-gradient(ellipse at 52% 82%, color-mix(in srgb, ${seasonTheme[season].accent} 18%, transparent), transparent 68%),
      ${seasonTheme[season].particle}`};
    mix-blend-mode: ${({ season }) => (season === 'winter' ? 'normal' : 'soft-light')};
    opacity: ${({ season }) => (season === 'winter' ? 0.36 : 0.34)};
    filter: none;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 22px;
    background:
      linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.3)),
      linear-gradient(90deg, transparent, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 14%, transparent), transparent);
    opacity: ${({ day }) => (day.inMonth ? 0.26 : 0.45)};
  }

  html[data-theme='night'] &::after {
    background:
      linear-gradient(180deg, transparent, ${({ season }) => (season === 'winter' ? 'rgba(170, 215, 235, 0.07)' : 'rgba(170, 215, 235, 0.12)')}),
      linear-gradient(90deg, transparent, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 22%, transparent), transparent);
    opacity: ${({ season, day }) => (season === 'winter' ? (day.inMonth ? 0.24 : 0.16) : day.inMonth ? 0.34 : 0.22)};
  }

  @media (max-width: 760px) {
    height: 70px;
  }
`

export const CellGardenScene = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  inset: 0;
  opacity: ${({ day }) => (day.inMonth ? 1 : 0.42)};

  .scene-glow {
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: 5px;
    height: 54px;
    background:
      radial-gradient(ellipse at 50% 92%, rgba(92, 66, 39, 0.14), transparent 54%),
      radial-gradient(ellipse at 54% 54%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 24%, transparent), transparent 64%);
    mix-blend-mode: screen;
    opacity: ${({ season }) => (season === 'winter' ? 0.56 : 0.84)};
  }

  html[data-theme='night'] & .scene-glow {
    background:
      radial-gradient(ellipse at 50% 92%, rgba(76, 116, 126, 0.18), transparent 54%),
      radial-gradient(ellipse at 54% 54%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 28%, transparent), transparent 64%);
    opacity: ${({ season }) => (season === 'winter' ? 0.48 : 0.58)};
  }

  .season-sprinkles {
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 9px;
    height: 19px;
    border-radius: 50%;
    background: ${({ season }) =>
      season === 'spring'
        ? `
          radial-gradient(circle at 12% 62%, rgba(245, 151, 165, .7) 0 2px, transparent 3px),
          radial-gradient(circle at 76% 42%, rgba(255, 201, 209, .72) 0 2px, transparent 3px),
          radial-gradient(circle at 88% 68%, rgba(235, 162, 173, .52) 0 2px, transparent 3px)`
        : season === 'autumn'
          ? `
          radial-gradient(ellipse at 14% 62%, rgba(205, 103, 32, .72) 0 5px, transparent 6px),
          radial-gradient(ellipse at 70% 44%, rgba(230, 148, 43, .68) 0 5px, transparent 6px),
          radial-gradient(ellipse at 92% 68%, rgba(136, 77, 32, .48) 0 4px, transparent 5px)`
          : season === 'winter'
            ? `
          radial-gradient(circle at 14% 55%, rgba(255,255,255,.95) 0 4px, transparent 5px),
          radial-gradient(circle at 74% 44%, rgba(235,244,249,.9) 0 5px, transparent 6px),
          radial-gradient(circle at 90% 65%, rgba(255,255,255,.78) 0 4px, transparent 5px)`
            : `
          radial-gradient(circle at 18% 58%, rgba(70, 112, 47, .3) 0 2px, transparent 3px),
          radial-gradient(circle at 76% 44%, rgba(125, 151, 67, .32) 0 2px, transparent 3px)`};
    background-size: 48px 18px;
    opacity: ${({ season }) => (season === 'summer' ? 0.46 : 0.72)};
    mix-blend-mode: multiply;
  }

  html[data-theme='night'] & .season-sprinkles {
    opacity: ${({ season }) => (season === 'winter' ? 0.64 : season === 'summer' ? 0.36 : 0.56)};
    mix-blend-mode: ${({ season }) => (season === 'winter' ? 'screen' : 'soft-light')};
    filter: ${({ season }) => (season === 'winter' ? 'drop-shadow(0 0 5px rgba(210, 239, 255, 0.22))' : 'none')};
  }

  .cell-decor {
    position: absolute;
    right: 8px;
    bottom: 8px;
    z-index: 1;
    width: 22px;
    height: 17px;
    border-radius: 50%;
    background: ${({ season }) =>
      season === 'spring'
        ? `
          radial-gradient(circle at 28% 42%, rgba(245, 153, 169, .58) 0 3px, transparent 4px),
          radial-gradient(circle at 54% 30%, rgba(255, 208, 214, .72) 0 3px, transparent 4px),
          radial-gradient(circle at 72% 56%, rgba(245, 153, 169, .52) 0 3px, transparent 4px)`
        : season === 'summer'
          ? `
          linear-gradient(128deg, transparent 30%, rgba(92, 139, 55, .46) 31% 43%, transparent 44%),
          radial-gradient(ellipse at 36% 56%, rgba(74, 128, 55, .52) 0 7px, transparent 8px),
          radial-gradient(ellipse at 70% 44%, rgba(124, 164, 74, .46) 0 6px, transparent 7px)`
          : season === 'autumn'
            ? `
          radial-gradient(ellipse at 30% 56%, rgba(212, 112, 28, .62) 0 7px, transparent 8px),
          radial-gradient(ellipse at 70% 44%, rgba(230, 156, 44, .54) 0 6px, transparent 7px),
          radial-gradient(circle at 50% 70%, rgba(126, 72, 30, .36) 0 3px, transparent 4px)`
            : `
          radial-gradient(circle at 30% 44%, rgba(255,255,255,.88) 0 4px, transparent 5px),
          radial-gradient(circle at 62% 58%, rgba(213,231,241,.78) 0 4px, transparent 5px),
          radial-gradient(circle at 78% 32%, rgba(255,255,255,.72) 0 3px, transparent 4px)`};
    opacity: ${({ day }) => (day.isSelected ? 0.5 : 0.32)};
    mix-blend-mode: multiply;
  }

  html[data-theme='night'] & .cell-decor {
    opacity: ${({ season, day }) => (season === 'winter' ? (day.isSelected ? 0.5 : 0.34) : day.isSelected ? 0.42 : 0.27)};
    mix-blend-mode: ${({ season }) => (season === 'winter' ? 'screen' : 'soft-light')};
    filter: ${({ season }) => (season === 'winter' ? 'drop-shadow(0 0 5px rgba(218, 241, 255, 0.18))' : 'none')};
  }

  .cell-decor-alt {
    right: auto;
    left: 9px;
    bottom: 28px;
    width: 18px;
    height: 15px;
    opacity: ${({ day }) => (day.isSelected ? 0.4 : 0.24)};
    transform: rotate(-10deg) scale(0.78);
  }

  .water-drop {
    position: absolute;
    z-index: 3;
    top: 20px;
    width: 5px;
    height: 10px;
    border-radius: 999px 999px 999px 2px;
    background: linear-gradient(180deg, rgba(174, 221, 232, 0.9), rgba(56, 116, 132, 0.28));
    box-shadow: 0 3px 7px rgba(59, 118, 130, 0.12);
    transform: rotate(22deg);
    animation: waterDrop 1.9s ease-in-out infinite;
  }

  html[data-theme='night'] & .water-drop {
    background: linear-gradient(180deg, rgba(210, 247, 255, 0.96), rgba(84, 181, 202, 0.6));
    box-shadow:
      0 0 10px rgba(97, 206, 226, 0.32),
      0 4px 9px rgba(11, 38, 48, 0.32);
  }

  .drop-a {
    left: 38%;
    animation-delay: -0.2s;
  }

  .drop-b {
    left: 52%;
    top: 16px;
    animation-delay: -0.7s;
  }

  .water-ripple {
    position: absolute;
    left: 28%;
    right: 24%;
    bottom: 9px;
    z-index: 2;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 50%, rgba(91, 154, 165, 0.3), rgba(60, 104, 107, 0.08) 46%, transparent 70%);
    animation: waterRipple 2.2s ease-out infinite;
  }

  html[data-theme='night'] & .water-ripple {
    background: radial-gradient(ellipse at 50% 50%, rgba(117, 218, 232, 0.42), rgba(44, 136, 150, 0.18) 48%, transparent 72%);
    filter: drop-shadow(0 0 8px rgba(91, 206, 226, 0.22));
  }
`

export const CellSoil = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  left: 7px;
  right: 7px;
  bottom: 9px;
  z-index: 0;
  height: ${({ season }) => (season === 'winter' ? '18px' : '20px')};
  border-radius: 48% 52% 30% 30%;
  background: ${({ season, day }) =>
    season === 'winter' && day.moisture !== 'wet'
      ? 'linear-gradient(180deg, rgba(255,255,255,.95), rgba(232,240,245,.84) 45%, rgba(120,105,88,.3) 76%, rgba(255,255,255,.72))'
      : day.moisture === 'wet'
        ? 'linear-gradient(180deg, rgba(108, 89, 63, .3), rgba(72, 52, 36, .78) 54%, rgba(40, 53, 49, .66))'
        : day.moisture === 'dry'
          ? 'linear-gradient(180deg, rgba(196, 151, 91, .45), rgba(131, 84, 49, .72) 56%, rgba(86, 55, 37, .58))'
          : 'linear-gradient(180deg, rgba(154, 111, 69, .42), rgba(99, 67, 43, .78) 56%, rgba(70, 48, 35, .58))'};
  box-shadow:
    inset 0 4px 8px rgba(255, 255, 255, 0.18),
    0 5px 8px rgba(60, 45, 31, 0.13);
  transition:
    background 220ms ease,
    box-shadow 220ms ease,
    filter 220ms ease;
  animation: ${({ day }) => (day.moisture === 'wet' ? 'soilSoak 780ms ease-out' : 'none')};

  html[data-theme='night'] & {
    background: ${({ season, day }) =>
      day.moisture === 'wet' ? nightWetSoil : season === 'winter' ? nightFrostSoil : day.moisture === 'dry' ? nightDrySoil : nightSoil};
    box-shadow:
      inset 0 4px 9px rgba(206, 238, 255, 0.14),
      0 5px 10px rgba(0, 0, 0, 0.24);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 12% 58%, rgba(43, 31, 21, .28) 0 2px, transparent 3px),
      radial-gradient(circle at 27% 43%, rgba(236, 219, 186, .28) 0 2px, transparent 3px),
      radial-gradient(circle at 45% 64%, rgba(62, 42, 27, .22) 0 2px, transparent 3px),
      radial-gradient(circle at 66% 48%, rgba(226, 200, 158, .24) 0 2px, transparent 3px),
      radial-gradient(circle at 84% 62%, rgba(45, 32, 23, .2) 0 2px, transparent 3px);
    background-size: 54px 15px;
    opacity: ${({ season }) => (season === 'winter' ? 0.36 : 0.88)};
    mix-blend-mode: multiply;
  }

  html[data-theme='night'] &::before {
    background:
      radial-gradient(circle at 12% 58%, rgba(4, 19, 20, .24) 0 2px, transparent 3px),
      radial-gradient(circle at 27% 43%, rgba(189, 224, 231, .18) 0 2px, transparent 3px),
      radial-gradient(circle at 45% 64%, rgba(5, 22, 22, .2) 0 2px, transparent 3px),
      radial-gradient(circle at 66% 48%, rgba(154, 195, 205, .16) 0 2px, transparent 3px),
      radial-gradient(circle at 84% 62%, rgba(6, 18, 21, .2) 0 2px, transparent 3px);
    opacity: ${({ season, day }) => (day.moisture === 'wet' ? 0.48 : season === 'winter' ? 0.28 : 0.42)};
    mix-blend-mode: normal;
  }

  &::after {
    top: -3px;
    height: 8px;
    background: ${({ season }) =>
      season === 'winter'
        ? 'linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)'
        : 'linear-gradient(90deg, transparent, rgba(255, 214, 182, .22), transparent)'};
    opacity: 0.84;
    mix-blend-mode: screen;
  }

  html[data-theme='night'] &::after {
    background: ${({ season, day }) =>
      day.moisture === 'wet' || season === 'winter'
        ? 'linear-gradient(90deg, transparent, rgba(202, 241, 255, .44), transparent)'
        : 'linear-gradient(90deg, transparent, rgba(224, 191, 151, .2), transparent)'};
    opacity: ${({ day }) => (day.moisture === 'wet' ? 0.9 : 0.64)};
  }

  .soil-shine {
    position: absolute;
    left: 10%;
    right: 10%;
    top: 2px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.28);
    opacity: ${({ day }) => (day.moisture === 'dry' ? 0.18 : 0.4)};
  }

  html[data-theme='night'] & .soil-shine {
    background: rgba(213, 243, 255, 0.38);
    opacity: ${({ day }) => (day.moisture === 'wet' ? 0.66 : day.moisture === 'dry' ? 0.16 : 0.34)};
  }

`

export const CellPlantCluster = styled.span`
  position: absolute;
  left: var(--x);
  bottom: 0;
  z-index: 2;
  width: 64px;
  height: 82px;
  transform: translateX(-50%);
`

export const CellSoilPatch = styled.span<{ season: Season; moisture: CalendarMoisture }>`
  position: absolute;
  left: 50%;
  bottom: 8px;
  z-index: 0;
  width: ${({ moisture }) => (moisture === 'wet' ? '46px' : '40px')};
  height: ${({ season }) => (season === 'winter' ? '17px' : '19px')};
  border-radius: 50% 50% 34% 34%;
  background: ${({ season, moisture }) =>
    moisture === 'wet'
      ? 'linear-gradient(180deg, rgba(103, 91, 66, .2), rgba(63, 48, 35, .82) 55%, rgba(37, 57, 53, .62))'
      : season === 'winter' || moisture === 'frost'
        ? 'linear-gradient(180deg, rgba(255,255,255,.92), rgba(228,240,246,.8) 54%, rgba(132,116,94,.32))'
        : moisture === 'dry'
          ? 'linear-gradient(180deg, rgba(206, 160, 96, .34), rgba(137, 88, 51, .68) 58%, rgba(91, 58, 39, .5))'
          : 'linear-gradient(180deg, rgba(160, 116, 72, .3), rgba(101, 69, 45, .7) 58%, rgba(71, 49, 36, .5))'};
  box-shadow:
    inset 0 3px 7px rgba(255, 255, 255, 0.17),
    0 4px 7px rgba(59, 43, 30, 0.14);
  transform: translateX(-50%);
  animation: ${({ moisture }) => (moisture === 'wet' ? 'anchoredSoilSoak 780ms ease-out' : 'none')};

  html[data-theme='night'] & {
    background: ${({ season, moisture }) =>
      moisture === 'wet'
        ? nightWetPatch
        : season === 'winter' || moisture === 'frost'
          ? nightFrostPatch
          : moisture === 'dry'
            ? nightDrySoil
            : nightSoil};
    box-shadow:
      inset 0 3px 8px rgba(202, 239, 255, 0.15),
      0 5px 9px rgba(0, 0, 0, 0.26);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 18% 55%, rgba(44, 31, 22, .24) 0 2px, transparent 3px),
      radial-gradient(circle at 48% 45%, rgba(231, 210, 172, .22) 0 2px, transparent 3px),
      radial-gradient(circle at 77% 58%, rgba(42, 30, 23, .2) 0 2px, transparent 3px);
    opacity: ${({ season }) => (season === 'winter' ? 0.32 : 0.74)};
    mix-blend-mode: multiply;
  }

  html[data-theme='night'] &::after {
    background:
      radial-gradient(circle at 18% 55%, rgba(3, 18, 20, .22) 0 2px, transparent 3px),
      radial-gradient(circle at 48% 45%, rgba(178, 221, 230, .17) 0 2px, transparent 3px),
      radial-gradient(circle at 77% 58%, rgba(5, 19, 21, .2) 0 2px, transparent 3px);
    opacity: ${({ season, moisture }) => (moisture === 'wet' ? 0.5 : season === 'winter' ? 0.3 : 0.42)};
    mix-blend-mode: normal;
  }

  .soil-shine {
    position: absolute;
    left: 15%;
    right: 15%;
    top: 2px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.26);
    opacity: ${({ moisture }) => (moisture === 'dry' ? 0.16 : 0.4)};
  }

  html[data-theme='night'] & .soil-shine {
    background: rgba(213, 243, 255, 0.38);
    opacity: ${({ moisture }) => (moisture === 'wet' ? 0.68 : moisture === 'dry' ? 0.16 : 0.36)};
  }

  .water-drop {
    top: -24px;
  }

  .drop-a {
    left: 34%;
  }

  .drop-b {
    top: -29px;
    left: 62%;
  }

  .water-ripple {
    left: 5%;
    right: 5%;
    bottom: -1px;
    height: 16px;
  }
`

export const CellPlantNode = styled.span<{ active: boolean; plant: Plant; muted: boolean }>`
  position: absolute;
  left: var(--x, 50%);
  bottom: 18px;
  z-index: 1;
  width: 38px;
  height: 58px;
  transform: translateX(-50%) scale(var(--scale));
  transform-origin: 50% 100%;
  opacity: ${({ muted }) => (muted ? 0.5 : 1)};
  animation: ${({ active, muted }) => (active && !muted ? 'anchoredBreathe 6.8s ease-in-out infinite' : 'none')};
  animation-delay: var(--delay);

  .pot {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: ${({ plant }) => (plant.kind === 'monstera' ? '18px' : '16px')};
    height: 14px;
    border-radius: 4px 4px 8px 8px;
    background: ${({ plant }) =>
      plant.kind === 'peperomia'
        ? 'linear-gradient(135deg, #cf813e, #8b5330)'
        : plant.kind === 'sansevieria'
          ? 'linear-gradient(135deg, #efe8d7, #9c8f73)'
          : plant.kind === 'peace'
            ? 'linear-gradient(135deg, #f7f1e5, #b89668)'
            : 'linear-gradient(135deg, #fff4e5, #9b8064)'};
    box-shadow:
      inset 0 -5px 7px rgba(54, 35, 20, .16),
      0 4px 6px rgba(45, 33, 23, .12);
    transform: translateX(-50%);
  }

  .pot-lip {
    position: absolute;
    left: 50%;
    bottom: 12px;
    width: ${({ plant }) => (plant.kind === 'monstera' ? '21px' : '19px')};
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 248, 232, .72);
    box-shadow: inset 0 -2px 3px rgba(80, 55, 35, .13);
    transform: translateX(-50%);
  }

  .stem {
    position: absolute;
    left: 50%;
    bottom: 14px;
    width: 2px;
    height: 23px;
    border-radius: 999px;
    background: linear-gradient(180deg, #6f8f52, #4a6c36);
    transform-origin: bottom center;
  }

  .stem-a { transform: translateX(-50%) rotate(-11deg); }
  .stem-b { transform: translateX(-50%) rotate(10deg); opacity: .74; }
  .stem-c { transform: translateX(-50%) rotate(0deg); opacity: .58; }

  .leaf {
    position: absolute;
    background: ${({ plant }) =>
      plant.kind === 'sansevieria'
        ? 'linear-gradient(90deg, #315f34, #9eb660 48%, #315f34)'
        : plant.kind === 'peperomia'
          ? 'radial-gradient(circle at 42% 34%, #93bd6d, #4f813e 72%)'
          : plant.kind === 'peace'
            ? 'linear-gradient(135deg, #7fa35d, #3f6d38)'
            : 'linear-gradient(135deg, #77a95b, #2f6934)'};
    box-shadow:
      inset -2px -2px 4px rgba(28, 53, 27, .14),
      0 2px 4px rgba(40, 60, 35, .08);
  }

  ${({ plant }) =>
    plant.kind === 'sansevieria'
      ? `
    .stem { display: none; }
    .leaf {
      bottom: 14px;
      left: 50%;
      width: 6px;
      height: 36px;
      border-radius: 85% 85% 16% 16%;
      transform-origin: bottom center;
    }
    .leaf-1 { transform: translateX(-50%) rotate(-22deg); height: 29px; }
    .leaf-2 { transform: translateX(-50%) rotate(-10deg); height: 35px; }
    .leaf-3 { transform: translateX(-50%) rotate(3deg); height: 40px; }
    .leaf-4 { transform: translateX(-50%) rotate(16deg); height: 33px; }
    .leaf-5 { transform: translateX(-50%) rotate(27deg); height: 25px; }
    .leaf-6 { display: none; }
  `
      : plant.kind === 'peperomia'
        ? `
    .leaf {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .leaf-1 { left: 10px; bottom: 31px; transform: rotate(-24deg); }
    .leaf-2 { left: 21px; bottom: 35px; transform: rotate(18deg); }
    .leaf-3 { left: 25px; bottom: 26px; transform: rotate(35deg); }
    .leaf-4 { left: 13px; bottom: 23px; transform: rotate(-4deg); }
    .leaf-5 { left: 19px; bottom: 18px; transform: scale(.86); }
    .leaf-6 { left: 7px; bottom: 20px; transform: scale(.78); }
  `
        : `
    .leaf {
      width: ${plant.kind === 'monstera' ? '16px' : '13px'};
      height: ${plant.kind === 'monstera' ? '15px' : '12px'};
      border-radius: 82% 13% 80% 18%;
      transform-origin: 50% 100%;
    }
    .leaf-1 { left: 8px; bottom: 30px; transform: rotate(-36deg); }
    .leaf-2 { left: 18px; bottom: 36px; transform: rotate(15deg); }
    .leaf-3 { left: 23px; bottom: 26px; transform: rotate(42deg); }
    .leaf-4 { left: 12px; bottom: 21px; transform: rotate(-12deg); }
    .leaf-5 { left: 18px; bottom: 18px; transform: rotate(62deg) scale(.88); }
    .leaf-6 { left: 6px; bottom: 18px; transform: rotate(-58deg) scale(.82); }
  `}

  .bloom {
    position: absolute;
    display: ${({ plant }) => (plant.kind === 'peace' ? 'block' : 'none')};
    width: 9px;
    height: 15px;
    border-radius: 70% 30% 70% 30%;
    background: linear-gradient(135deg, #fffdf1, #e6dfc9);
    box-shadow: 0 2px 5px rgba(70, 64, 45, .08);
  }

  .bloom-a { left: 18px; bottom: 39px; transform: rotate(18deg); }
  .bloom-b { left: 30px; bottom: 31px; transform: rotate(-18deg) scale(.82); }
`

export const TinySprout = styled.span<{ season: Season }>`
  position: absolute;
  left: 50%;
  bottom: 28px;
  z-index: 2;
  width: 20px;
  height: 24px;
  transform: translateX(-50%);

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    width: 11px;
    height: 9px;
    border-radius: 80% 10% 80% 18%;
    background: ${({ season }) => (season === 'winter' ? '#9eb39a' : '#83ad67')};
  }

  &::before {
    left: 2px;
    transform: rotate(-36deg);
  }

  &::after {
    right: 2px;
    transform: rotate(38deg) scaleX(-1);
  }
`
