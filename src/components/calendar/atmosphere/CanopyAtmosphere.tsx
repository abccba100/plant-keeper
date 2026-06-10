import styled from '@emotion/styled'
import { memo, type CSSProperties } from 'react'
import type { Season } from '../../../store/calendarData'
import { seasonTheme } from '../../styles/design-system/tokens'

const particles: [number, number, number, number][] = [
  [47, 12, 3, 0.24],
  [61, 19, 4, 0.2],
  [73, 8, 3, 0.22],
  [84, 30, 5, 0.16],
  [92, 18, 3, 0.2],
  [69, 46, 4, 0.12],
]

export const CanopyAtmosphere = memo(function CanopyAtmosphere({ season }: { season: Season }) {
  return (
    <>
      <BackgroundAir season={season}>
        <span className="base-light" />
        <span className="directional-light" />
        <span className="room-haze" />
      </BackgroundAir>
      <ShadowWash season={season}>
        <span className="window-shadow" />
        <span className="diffused-shadow" />
      </ShadowWash>
      <AtmosphericParticles season={season}>
        {particles.map(([x, y, size, opacity], index) => (
          <Particle
            key={`${x}-${y}-${index}`}
            style={
              {
                '--x': `${x}%`,
                '--y': `${y}%`,
                '--s': `${size}px`,
                '--o': opacity,
              } as CSSProperties
            }
          />
        ))}
      </AtmosphericParticles>
      <GlassDiffusion season={season} />
      <TextureVeil season={season} />
    </>
  )
})

const seasonalShadow = (season: Season) => {
  if (season === 'winter') return 'rgba(54, 76, 92, 0.18)'
  if (season === 'autumn') return 'rgba(122, 72, 32, 0.18)'
  if (season === 'summer') return 'rgba(38, 86, 37, 0.2)'
  return 'rgba(136, 82, 86, 0.14)'
}

const seasonalParticle = (season: Season) => {
  if (season === 'winter') return 'rgba(187, 213, 230, 0.68)'
  if (season === 'autumn') return 'rgba(210, 133, 52, 0.52)'
  if (season === 'summer') return 'rgba(113, 150, 83, 0.42)'
  return 'rgba(239, 166, 177, 0.5)'
}

const BackgroundAir = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  .base-light {
    position: absolute;
    inset: 0;
    background:
      ${({ season }) => seasonTheme[season].canopyGlow},
      radial-gradient(circle at 83% 4%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 20%, transparent), transparent 28%),
      linear-gradient(112deg, rgba(255, 255, 255, 0.78) 0%, transparent 36%, rgba(70, 70, 54, 0.04) 100%);
    mix-blend-mode: soft-light;
    animation: shimmer 8s ease-in-out infinite;
  }

  .directional-light {
    position: absolute;
    top: -18vh;
    right: -10vw;
    width: 62vw;
    height: 46vh;
    background:
      radial-gradient(ellipse at 76% 16%, rgba(255, 255, 255, 0.78), transparent 34%),
      radial-gradient(ellipse at 56% 38%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 18%, transparent), transparent 52%);
    opacity: ${({ season }) => (season === 'winter' ? 0.54 : 0.68)};
    mix-blend-mode: screen;
  }

  .room-haze {
    position: absolute;
    inset: -5% -8% auto 12%;
    height: 280px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent 76%),
      radial-gradient(ellipse at 70% 32%, rgba(255, 255, 255, 0.34), transparent 58%);
    opacity: 0.62;
  }
`

const ShadowWash = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  mix-blend-mode: multiply;

  .window-shadow {
    position: absolute;
    top: -68px;
    right: -60px;
    width: min(50vw, 620px);
    height: 260px;
    background:
      radial-gradient(ellipse at 80% 15%, ${({ season }) => seasonalShadow(season)}, transparent 32%),
      radial-gradient(ellipse at 62% 42%, ${({ season }) => seasonalShadow(season)}, transparent 42%),
      linear-gradient(112deg, transparent 38%, ${({ season }) => seasonalShadow(season)} 74%, transparent 100%);
    opacity: ${({ season }) => (season === 'summer' ? 0.74 : season === 'winter' ? 0.42 : 0.6)};
    mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.7) 44%, transparent 100%);
  }

  .diffused-shadow {
    position: absolute;
    top: 46px;
    right: 88px;
    width: min(40vw, 520px);
    height: 160px;
    background:
      radial-gradient(ellipse at 78% 30%, ${({ season }) => seasonalShadow(season)}, transparent 28%),
      radial-gradient(ellipse at 44% 58%, ${({ season }) => seasonalShadow(season)}, transparent 36%);
    opacity: ${({ season }) => (season === 'summer' ? 0.42 : 0.28)};
  }
`

const AtmosphericParticles = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  mix-blend-mode: ${({ season }) => (season === 'winter' ? 'screen' : 'soft-light')};
  opacity: ${({ season }) => (season === 'summer' ? 0.3 : 0.4)};
  color: ${({ season }) => seasonalParticle(season)};
`

const Particle = styled.span`
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  border-radius: 50%;
  background: currentColor;
  opacity: var(--o);
  animation: drift 12s ease-in-out infinite alternate;
`

const GlassDiffusion = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 86% 7%, rgba(255, 255, 255, 0.28), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent 30%);
  color: ${({ season }) => seasonalParticle(season)};
  mix-blend-mode: screen;
  opacity: ${({ season }) => (season === 'winter' ? 0.38 : 0.24)};
`

const TextureVeil = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 20%, rgba(70, 64, 50, 0.026) 0 1px, transparent 1.7px),
    radial-gradient(circle at 64% 72%, rgba(255, 255, 255, 0.16) 0 1px, transparent 1.9px),
    linear-gradient(180deg, transparent 0%, rgba(66, 58, 48, 0.03) 100%);
  background-size:
    18px 18px,
    23px 23px,
    auto;
  mix-blend-mode: ${({ season }) => (season === 'winter' ? 'soft-light' : 'multiply')};
  opacity: ${({ season }) => (season === 'winter' ? 0.1 : 0.07)};
`
