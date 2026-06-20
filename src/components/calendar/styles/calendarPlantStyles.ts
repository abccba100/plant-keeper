import styled from '@emotion/styled'
import { seasonTheme } from '../../styles/design-system/tokens'
import type { CalendarDay, CalendarMoisture, Season } from '../../../store/calendarData'
import type { Plant } from '../../../store/plantData'

const nightWetSoil =
  'linear-gradient(180deg, rgba(120, 176, 190, .28), rgba(29, 67, 75, .88) 58%, rgba(14, 43, 46, .78))'
const nightDrySoil =
  'linear-gradient(180deg, rgba(153, 113, 72, .28), rgba(87, 59, 42, .78) 60%, rgba(47, 37, 32, .72))'
const nightSoil =
  'linear-gradient(180deg, rgba(122, 93, 66, .26), rgba(68, 51, 39, .76) 60%, rgba(41, 35, 32, .7))'
const nightFrostSoil =
  'linear-gradient(180deg, rgba(229, 246, 253, .9), rgba(123, 158, 177, .6) 56%, rgba(45, 65, 76, .76))'

function getDaySoilBackground(season: Season, moisture: CalendarMoisture) {
  if (moisture === 'wet') return seasonTheme[season].wetSoil
  if (moisture === 'dry') return seasonTheme[season].drySoil
  return seasonTheme[season].soil
}

function getNightSoilBackground(season: Season, moisture: CalendarMoisture) {
  if (moisture === 'wet') return nightWetSoil
  if (season === 'winter' || moisture === 'frost') return nightFrostSoil
  if (moisture === 'dry') return nightDrySoil
  return nightSoil
}

function getTextureOpacity(season: Season, moisture: CalendarMoisture) {
  if (moisture === 'wet') return 0.5
  if (season === 'winter') return 0.3
  return 0.42
}

function getShineOpacity(moisture: CalendarMoisture) {
  if (moisture === 'wet') return 0.68
  if (moisture === 'dry') return 0.16
  return 0.36
}

export const SoilBand = styled.div<{ season: Season; day: CalendarDay }>`
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 8px;
  height: 22px;
  border-radius: 50% 50% 22% 22%;
  background: ${({ day, season }) => getDaySoilBackground(season, day.moisture)};
  box-shadow:
    inset 0 4px 10px rgba(255, 255, 255, 0.2),
    0 5px 8px rgba(65, 48, 34, 0.12);
  opacity: ${({ day }) => (day.inMonth ? 1 : 0.34)};
  transition:
    background 220ms ease,
    box-shadow 220ms ease;
  animation: ${({ day }) => (day.moisture === 'wet' ? 'soilSoak 780ms ease-out' : 'none')};

  html[data-theme='night'] & {
    background: ${({ day, season }) => getNightSoilBackground(season, day.moisture)};
    box-shadow:
      inset 0 4px 10px rgba(207, 240, 255, 0.15),
      0 6px 10px rgba(0, 0, 0, 0.25);
  }

  .texture,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 12% 58%, rgba(47, 33, 24, 0.24) 0 2px, transparent 3px),
      radial-gradient(circle at 28% 36%, rgba(219, 203, 174, 0.22) 0 2px, transparent 3px),
      radial-gradient(circle at 58% 45%, rgba(34, 24, 18, 0.18) 0 2px, transparent 3px),
      ${({ season }) => seasonTheme[season].particle};
    background-size:
      56px 15px,
      48px 17px,
      42px 14px,
      36px 14px;
    mix-blend-mode: multiply;
    opacity: ${({ season }) => (season === 'winter' ? 0.45 : 0.78)};
  }

  html[data-theme='night'] & .texture,
  html[data-theme='night'] &::after {
    background:
      radial-gradient(circle at 12% 58%, rgba(4, 19, 21, 0.24) 0 2px, transparent 3px),
      radial-gradient(circle at 28% 36%, rgba(183, 224, 232, 0.16) 0 2px, transparent 3px),
      radial-gradient(circle at 58% 45%, rgba(5, 20, 22, 0.18) 0 2px, transparent 3px);
    mix-blend-mode: normal;
    opacity: ${({ season, day }) => getTextureOpacity(season, day.moisture)};
  }

`

export const DetailPlantClusterFrame = styled.span<{ compact: boolean }>`
  position: absolute;
  left: var(--x);
  bottom: 0;
  z-index: 2;
  width: ${({ compact }) => (compact ? '64px' : '90px')};
  height: ${({ compact }) => (compact ? '62px' : '94px')};
  transform: translateX(-50%);
`

export const DetailSoilPatch = styled.span<{ season: Season; moisture: CalendarMoisture; compact: boolean }>`
  position: absolute;
  left: 50%;
  bottom: ${({ compact }) => (compact ? '7px' : '8px')};
  z-index: 0;
  width: ${({ compact }) => (compact ? '42px' : '66px')};
  height: ${({ compact }) => (compact ? '18px' : '24px')};
  border-radius: 50% 50% 30% 30%;
  background: ${({ season, moisture }) => getDaySoilBackground(season, moisture)};
  box-shadow:
    inset 0 4px 9px rgba(255, 255, 255, 0.18),
    0 5px 8px rgba(65, 48, 34, 0.12);
  transform: translateX(-50%);
  animation: ${({ moisture }) => (moisture === 'wet' ? 'anchoredSoilSoak 780ms ease-out' : 'none')};

  html[data-theme='night'] & {
    background: ${({ season, moisture }) => getNightSoilBackground(season, moisture)};
    box-shadow:
      inset 0 4px 10px rgba(207, 240, 255, 0.15),
      0 6px 10px rgba(0, 0, 0, 0.25);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 18% 56%, rgba(47, 33, 24, 0.24) 0 2px, transparent 3px),
      radial-gradient(circle at 54% 42%, rgba(219, 203, 174, 0.2) 0 2px, transparent 3px),
      ${({ season }) => seasonTheme[season].particle};
    background-size:
      48px 15px,
      40px 14px,
      34px 12px;
    mix-blend-mode: multiply;
    opacity: ${({ season }) => (season === 'winter' ? 0.42 : 0.72)};
  }

  html[data-theme='night'] &::after {
    background:
      radial-gradient(circle at 18% 56%, rgba(4, 19, 21, 0.23) 0 2px, transparent 3px),
      radial-gradient(circle at 54% 42%, rgba(183, 224, 232, 0.16) 0 2px, transparent 3px);
    mix-blend-mode: normal;
    opacity: ${({ season, moisture }) => getTextureOpacity(season, moisture)};
  }

  .soil-shine {
    position: absolute;
    left: 14%;
    right: 14%;
    top: 3px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.28);
    opacity: ${({ moisture }) => (moisture === 'dry' ? 0.18 : 0.4)};
  }

  html[data-theme='night'] & .soil-shine {
    background: rgba(213, 243, 255, 0.38);
    opacity: ${({ moisture }) => getShineOpacity(moisture)};
  }

  .puddle {
    position: absolute;
    left: 22%;
    right: 18%;
    bottom: 4px;
    z-index: 1;
    height: ${({ compact }) => (compact ? '6px' : '8px')};
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 50%, rgba(40, 77, 83, 0.52), rgba(31, 55, 56, 0.05) 70%);
  }

  html[data-theme='night'] & .puddle {
    background: radial-gradient(ellipse at 50% 50%, rgba(117, 218, 232, 0.5), rgba(41, 128, 143, 0.18) 58%, transparent 76%);
    filter: drop-shadow(0 0 8px rgba(91, 206, 226, 0.24));
  }
`

export const Avatar = styled.span<{ plant: Plant }>`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 72%, #efe5d3 0 32%, rgba(255, 255, 255, 0.6) 33% 100%);
  box-shadow: inset 0 0 0 1px rgba(75, 86, 65, 0.08);

  .pot {
    position: absolute;
    left: 50%;
    bottom: 4px;
    width: 10px;
    height: 8px;
    border-radius: 2px 2px 4px 4px;
    background: #9b7858;
    transform: translateX(-50%);
  }

  .leaf {
    position: absolute;
    width: ${({ plant }) => (plant.kind === 'sansevieria' ? '4px' : '10px')};
    height: ${({ plant }) => (plant.kind === 'sansevieria' ? '18px' : '9px')};
    border-radius: ${({ plant }) => (plant.kind === 'sansevieria' ? '80% 80% 12% 12%' : '80% 12% 80% 18%')};
    background: ${({ plant }) => (plant.kind === 'sansevieria' ? '#547b32' : '#4f7f3f')};
    transform-origin: bottom center;
  }

  .leaf-a {
    left: 7px;
    bottom: 12px;
    transform: rotate(-36deg);
  }

  .leaf-b {
    left: 14px;
    bottom: 13px;
    transform: rotate(8deg);
  }

  .leaf-c {
    left: 11px;
    bottom: 10px;
    transform: rotate(42deg);
  }
`

export const PlantLine = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr 8px;
  align-items: center;
  gap: 11px;
  min-width: 0;
  min-height: 43px;
  font-size: 13.5px;
  white-space: nowrap;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--tone);
  }
`
