import styled from '@emotion/styled'
import { radii, seasonTheme } from '../../styles/design-system/tokens'
import type { Season } from '../../../store/calendarData'
import { seasonDecor } from '../decor/seasonDecorRegistry'

const tipRibbon = {
  top: { spring: '-18px', summer: '-14px', autumn: '-16px', winter: '-18px' },
  right: { spring: '12px', summer: '12px', autumn: '14px', winter: '12px' },
  width: { spring: '64px', summer: '56px', autumn: '56px', winter: '48px' },
  aspectRatio: { spring: '314 / 215', summer: '309 / 264', autumn: '390 / 372', winter: '230 / 226' },
  opacity: { spring: 0.9, summer: 0.82, autumn: 0.9, winter: 0.74 },
  rotate: { spring: '-8deg', summer: '8deg', autumn: '10deg', winter: '-8deg' },
}

export const RightPanel = styled.aside`
  position: relative;
  z-index: 2;
  display: grid;
  align-content: start;
  gap: 18px;
  padding-top: 118px;
  min-width: 0;

  @media (max-width: 1180px) {
    display: none;
  }
`

export const RailCard = styled.section`
  overflow: hidden;
  min-width: 0;
  padding: 18px 16px;
  border: 1px solid var(--control-line);
  border-radius: ${radii.panel};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.52)),
    var(--control-surface);
  box-shadow:
    0 14px 32px color-mix(in srgb, var(--accent) 12%, rgba(58, 52, 42, 0.065)),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);

  html[data-theme='night'] & {
    background:
      linear-gradient(180deg, rgba(24, 38, 63, 0.78), rgba(12, 21, 38, 0.72)),
      var(--control-surface);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
    color: #edf6ff;
  }

  h2 {
    margin: 0 0 13px;
    font-size: 15px;
    line-height: 1.25;
  }
`

export const AddMore = styled.div`
  margin-top: 6px;
  text-align: center;
  font-size: 13px;
`

export const TipCard = styled(RailCard)<{ season: Season }>`
  position: relative;
  overflow: visible;
  min-height: 210px;
  background:
    linear-gradient(180deg, ${({ season }) => seasonTheme[season].railTint}, rgba(255, 255, 255, 0.68)),
    radial-gradient(ellipse at 70% 88%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 24%, transparent), transparent 42%);

  p {
    margin: 0;
    color: #394139;
    font-size: 13px;
    line-height: 1.78;
  }

  html[data-theme='night'] & {
    background:
      linear-gradient(180deg, rgba(24, 38, 63, 0.78), rgba(12, 21, 38, 0.72)),
      radial-gradient(ellipse at 70% 88%, rgba(127, 168, 255, 0.16), transparent 42%);
  }

  html[data-theme='night'] & p {
    color: #d8e5f7;
  }
`

export const TipRibbon = styled.span<{ season: Season }>`
  position: absolute;
  z-index: 1;
  top: ${({ season }) => tipRibbon.top[season]};
  right: ${({ season }) => tipRibbon.right[season]};
  width: ${({ season }) => tipRibbon.width[season]};
  aspect-ratio: ${({ season }) => tipRibbon.aspectRatio[season]};
  pointer-events: none;
  display: block;
  background-image: url(${({ season }) => seasonDecor[season].ribbon});
  background-repeat: no-repeat;
  background-position: right top;
  background-size: contain;
  backface-visibility: hidden;
  opacity: ${({ season }) => tipRibbon.opacity[season]};
  transform: rotate(${({ season }) => tipRibbon.rotate[season]});
`

export const TipGarden = styled.div`
  position: relative;
  height: 74px;
  margin: 18px -8px -10px;
`
