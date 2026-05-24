import styled from '@emotion/styled'
import type { CSSProperties } from 'react'
import type { Season } from '../../../entities/calendar/model/calendar'
import { seasonTheme } from '../../../shared/design-system/tokens'
import autumnCanopy from '../../../assets/canopy-overlays/autumn-canopy.png'
import springCanopy from '../../../assets/canopy-overlays/spring-canopy.png'
import summerCanopy from '../../../assets/canopy-overlays/summer-canopy.png'
import winterCanopy from '../../../assets/canopy-overlays/winter-canopy.png'

const leafShadows = [
  [42, 12, 148, 58, -24, 0.12],
  [54, 28, 190, 70, 14, 0.16],
  [64, 6, 166, 62, -36, 0.18],
  [72, 24, 214, 78, 26, 0.16],
  [83, 10, 146, 52, -16, 0.18],
  [62, 48, 160, 58, 42, 0.1],
  [88, 42, 230, 82, -8, 0.11],
  [38, 60, 180, 68, 32, 0.08],
]

const particles = [
  [47, 12, 3, 0.26],
  [61, 19, 4, 0.22],
  [73, 8, 3, 0.24],
  [84, 30, 5, 0.18],
  [92, 18, 3, 0.22],
  [69, 46, 4, 0.14],
]

const canopyImages: Record<Season, string> = {
  spring: springCanopy,
  summer: summerCanopy,
  autumn: autumnCanopy,
  winter: winterCanopy,
}

export function CanopyAtmosphere({ season }: { season: Season }) {
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
      <SeasonalCanopy src={canopyImages[season]} alt="" aria-hidden="true" season={season} />
      <EdgeCanopy season={season}>
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} className={`edge edge-${index + 1}`} />
        ))}
      </EdgeCanopy>
      <BranchSilhouette season={season}>
        <span className="mass mass-a" />
        <span className="mass mass-b" />
        <span className="mass mass-c" />
        <span className="branch branch-a" />
        <span className="branch branch-b" />
        <span className="branch branch-c" />
        <span className="branch branch-d" />
      </BranchSilhouette>
      <LeafShadowField season={season}>
        {leafShadows.map(([x, y, width, height, rotate, opacity], index) => (
          <LeafShadow
            key={`${x}-${y}-${index}`}
            season={season}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--w': `${width}px`,
              '--h': `${height}px`,
              '--r': `${rotate}deg`,
              '--o': opacity,
            } as CSSProperties}
          />
        ))}
      </LeafShadowField>
      <CanopyAccent season={season}>
        <span className="branch branch-main" />
        <span className="branch branch-sub-a" />
        <span className="branch branch-sub-b" />
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} className={`accent accent-${index + 1}`} />
        ))}
      </CanopyAccent>
      <SoftNatureCorners season={season}>
        <span className="corner corner-left-a" />
        <span className="corner corner-left-b" />
        <span className="corner corner-right-a" />
        <span className="corner corner-right-b" />
      </SoftNatureCorners>
      <AtmosphericParticles season={season}>
        {particles.map(([x, y, size, opacity], index) => (
          <Particle
            key={`${x}-${y}-${index}`}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--s': `${size}px`,
              '--o': opacity,
            } as CSSProperties}
          />
        ))}
      </AtmosphericParticles>
      <GlassDiffusion season={season} />
      <TextureVeil season={season} />
    </>
  )
}

const seasonalShadow = (season: Season) => {
  if (season === 'winter') return 'rgba(54, 76, 92, 0.2)'
  if (season === 'autumn') return 'rgba(122, 72, 32, 0.2)'
  if (season === 'summer') return 'rgba(38, 86, 37, 0.22)'
  return 'rgba(136, 82, 86, 0.16)'
}

const seasonalParticle = (season: Season) => {
  if (season === 'winter') return 'rgba(187, 213, 230, 0.72)'
  if (season === 'autumn') return 'rgba(210, 133, 52, 0.58)'
  if (season === 'summer') return 'rgba(113, 150, 83, 0.48)'
  return 'rgba(239, 166, 177, 0.56)'
}

const branchTone = (season: Season) => {
  if (season === 'winter') return 'rgba(61, 65, 63, 0.34)'
  if (season === 'autumn') return 'rgba(99, 58, 30, 0.28)'
  if (season === 'summer') return 'rgba(47, 77, 36, 0.24)'
  return 'rgba(88, 61, 43, 0.22)'
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
      radial-gradient(circle at 83% 4%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 24%, transparent), transparent 30%),
      linear-gradient(112deg, rgba(255, 255, 255, 0.8) 0%, transparent 36%, rgba(70, 70, 54, 0.045) 100%);
    mix-blend-mode: soft-light;
    animation: shimmer 8s ease-in-out infinite;
  }

  .directional-light {
    position: absolute;
    top: -22vh;
    right: -12vw;
    width: 74vw;
    height: 58vh;
    background:
      radial-gradient(ellipse at 76% 16%, rgba(255, 255, 255, 0.82), transparent 34%),
      radial-gradient(ellipse at 56% 38%, color-mix(in srgb, ${({ season }) => seasonTheme[season].accent} 22%, transparent), transparent 52%);
    filter: blur(22px);
    opacity: ${({ season }) => (season === 'winter' ? 0.6 : 0.78)};
    mix-blend-mode: screen;
  }

  .room-haze {
    position: absolute;
    inset: -8% -10% auto 12%;
    height: 360px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.48), transparent 76%),
      radial-gradient(ellipse at 70% 32%, rgba(255, 255, 255, 0.38), transparent 58%);
    filter: blur(12px);
    opacity: 0.72;
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
    top: -80px;
    right: -80px;
    width: min(58vw, 760px);
    height: 330px;
    background:
      radial-gradient(ellipse at 80% 15%, ${({ season }) => seasonalShadow(season)}, transparent 32%),
      radial-gradient(ellipse at 62% 42%, ${({ season }) => seasonalShadow(season)}, transparent 42%),
      linear-gradient(112deg, transparent 36%, ${({ season }) => seasonalShadow(season)} 74%, transparent 100%);
    filter: blur(26px);
    opacity: ${({ season }) => (season === 'summer' ? 0.9 : season === 'winter' ? 0.48 : 0.7)};
    mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.78) 42%, transparent 100%);
  }

  .diffused-shadow {
    position: absolute;
    top: 42px;
    right: 88px;
    width: min(46vw, 620px);
    height: 210px;
    background:
      radial-gradient(ellipse at 78% 30%, ${({ season }) => seasonalShadow(season)}, transparent 26%),
      radial-gradient(ellipse at 44% 58%, ${({ season }) => seasonalShadow(season)}, transparent 34%);
    filter: blur(34px);
    opacity: ${({ season }) => (season === 'summer' ? 0.54 : 0.34)};
  }
`

const SeasonalCanopy = styled.img<{ season: Season }>`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  width: ${({ season }) => (season === 'autumn' ? 'min(40vw, 570px)' : season === 'summer' ? 'min(34vw, 500px)' : 'min(36vw, 540px)')};
  max-width: none;
  pointer-events: none;
  user-select: none;
  opacity: ${({ season }) => (season === 'winter' ? 0.78 : season === 'summer' ? 0.86 : 0.92)};
  filter: ${({ season }) =>
    season === 'winter'
      ? 'drop-shadow(-12px 18px 22px rgba(70, 91, 108, 0.12)) saturate(0.92)'
      : season === 'summer'
        ? 'drop-shadow(-18px 22px 24px rgba(55, 91, 38, 0.13)) saturate(1.05)'
        : season === 'autumn'
          ? 'drop-shadow(-18px 22px 22px rgba(138, 75, 28, 0.15)) saturate(1.04)'
          : 'drop-shadow(-18px 22px 24px rgba(171, 94, 105, 0.12)) saturate(1.03)'};
  mask-image:
    linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.22) 8%, #000 26%),
    linear-gradient(180deg, #000 0%, #000 76%, transparent 100%);
  mask-composite: intersect;
`

const EdgeCanopy = styled.div<{ season: Season }>`
  position: fixed;
  top: 0;
  right: -34px;
  z-index: 1;
  width: 260px;
  height: 260px;
  pointer-events: none;
  overflow: hidden;
  opacity: ${({ season }) => (season === 'winter' ? 0.74 : season === 'summer' ? 0.86 : 0.9)};
  filter: ${({ season }) => (season === 'winter' ? 'blur(0.2px)' : 'drop-shadow(-12px 18px 20px rgba(60, 45, 30, 0.08))')};

  .edge {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: ${({ season }) => (season === 'spring' ? '22px' : season === 'summer' ? '48px' : season === 'autumn' ? '46px' : '150px')};
    height: ${({ season }) => (season === 'spring' ? '20px' : season === 'summer' ? '34px' : season === 'autumn' ? '42px' : '4px')};
    opacity: var(--o);
    transform: translate(-50%, -50%) rotate(var(--r)) scale(var(--s));
    transform-origin: center;
    background: ${({ season }) =>
      season === 'spring'
        ? 'radial-gradient(circle at 48% 42%, rgba(255, 250, 251, 0.98) 0 19%, rgba(248, 149, 162, 0.78) 20% 52%, rgba(246, 171, 183, 0.34) 53% 100%)'
        : season === 'summer'
          ? 'linear-gradient(135deg, rgba(138, 176, 82, 0.88), rgba(48, 93, 41, 0.72))'
          : season === 'autumn'
            ? 'linear-gradient(135deg, rgba(238, 145, 39, 0.9), rgba(165, 79, 24, 0.75))'
            : 'linear-gradient(90deg, rgba(65, 57, 54, 0.06), rgba(46, 42, 39, 0.58), rgba(65, 57, 54, 0.06))'};
    border-radius: ${({ season }) =>
      season === 'spring' ? '65% 35% 62% 38%' : season === 'summer' ? '80% 12% 80% 18%' : season === 'autumn' ? '64% 9% 68% 14%' : '999px'};
    box-shadow: ${({ season }) =>
      season === 'winter'
        ? '0 0 8px rgba(120, 145, 163, 0.1)'
        : season === 'spring'
          ? '0 5px 10px rgba(203, 116, 126, 0.13)'
          : 'inset -8px -8px 10px rgba(35, 45, 25, 0.12)'};
    mix-blend-mode: ${({ season }) => (season === 'winter' ? 'multiply' : 'normal')};
  }

  .edge-1 { --x: 72%; --y: 10%; --r: 22deg; --s: 1.12; --o: .95; }
  .edge-2 { --x: 88%; --y: 20%; --r: -28deg; --s: .9; --o: .82; }
  .edge-3 { --x: 62%; --y: 28%; --r: 48deg; --s: .74; --o: .72; }
  .edge-4 { --x: 94%; --y: 38%; --r: 12deg; --s: 1; --o: .8; }
  .edge-5 { --x: 76%; --y: 52%; --r: -18deg; --s: .78; --o: .68; }
  .edge-6 { --x: 98%; --y: 62%; --r: 35deg; --s: .72; --o: .6; }
  .edge-7 { --x: 82%; --y: 78%; --r: -45deg; --s: .6; --o: .48; }
  .edge-8 { --x: 54%; --y: 66%; --r: 20deg; --s: .52; --o: .36; }
  .edge-9 { --x: 104%; --y: 8%; --r: -8deg; --s: .76; --o: .52; }
  .edge-10 { --x: 66%; --y: 88%; --r: 15deg; --s: .44; --o: .32; }
  .edge-11 { --x: 52%; --y: 16%; --r: -52deg; --s: .46; --o: .28; }
  .edge-12 { --x: 106%; --y: 84%; --r: 42deg; --s: .5; --o: .34; }
  .edge-13 { --x: 44%; --y: 42%; --r: -12deg; --s: .38; --o: .22; }
  .edge-14 { --x: 90%; --y: 96%; --r: 18deg; --s: .36; --o: .24; }
  .edge-15 { --x: 58%; --y: 104%; --r: -28deg; --s: .3; --o: .18; }
  .edge-16 { --x: 112%; --y: 48%; --r: 8deg; --s: .44; --o: .28; }

  ${({ season }) =>
    season === 'winter'
      ? `
    .edge {
      height: 3px;
      width: 190px;
      border-radius: 999px;
      box-shadow: 0 0 14px rgba(185, 209, 225, 0.18);
    }
    .edge-1 { --x: 70%; --y: 18%; --r: 16deg; --s: 1; --o: .62; }
    .edge-2 { --x: 88%; --y: 30%; --r: -28deg; --s: .72; --o: .54; }
    .edge-3 { --x: 72%; --y: 44%; --r: 36deg; --s: .52; --o: .38; }
    .edge-4 { --x: 96%; --y: 7%; --r: -12deg; --s: .68; --o: .44; }
  `
      : ''}
`

const BranchSilhouette = styled.div<{ season: Season }>`
  position: fixed;
  top: -58px;
  right: -88px;
  z-index: 1;
  width: min(66vw, 900px);
  height: 330px;
  pointer-events: none;
  opacity: ${({ season }) => (season === 'winter' ? 0.62 : 0.52)};
  mix-blend-mode: multiply;
  filter: blur(1.5px);
  mask-image: radial-gradient(ellipse at 78% 9%, #000 0%, rgba(0, 0, 0, 0.72) 45%, transparent 82%);

  .mass {
    position: absolute;
    border-radius: 50%;
    background:
      radial-gradient(ellipse at 42% 44%, ${({ season }) => branchTone(season)}, transparent 58%),
      radial-gradient(ellipse at 72% 36%, ${({ season }) => seasonalShadow(season)}, transparent 52%);
    filter: blur(22px);
    opacity: ${({ season }) => (season === 'summer' ? 0.58 : season === 'winter' ? 0.26 : 0.42)};
    transform: rotate(-12deg);
  }

  .mass-a {
    top: -34px;
    right: 0;
    width: 370px;
    height: 160px;
  }

  .mass-b {
    top: 46px;
    right: 110px;
    width: 430px;
    height: 160px;
    opacity: ${({ season }) => (season === 'summer' ? 0.5 : 0.32)};
  }

  .mass-c {
    top: 112px;
    right: 280px;
    width: 280px;
    height: 130px;
    opacity: 0.18;
  }

  .branch {
    position: absolute;
    height: 5px;
    border-radius: 999px;
    background: ${({ season }) => branchTone(season)};
    transform-origin: right center;
    filter: blur(1.8px);
  }

  .branch-a {
    top: 88px;
    right: 18px;
    width: 82%;
    transform: rotate(-10deg);
  }

  .branch-b {
    top: 132px;
    right: 118px;
    width: 50%;
    height: 4px;
    transform: rotate(24deg);
    opacity: 0.82;
  }

  .branch-c {
    top: 48px;
    right: 240px;
    width: 40%;
    height: 3px;
    transform: rotate(-31deg);
    opacity: 0.64;
  }

  .branch-d {
    top: 182px;
    right: 72px;
    width: 48%;
    height: 3px;
    transform: rotate(9deg);
    opacity: 0.34;
  }
`

const LeafShadowField = styled.div<{ season: Season }>`
  position: fixed;
  top: -56px;
  right: -86px;
  z-index: 1;
  width: min(70vw, 960px);
  height: 420px;
  pointer-events: none;
  mix-blend-mode: multiply;
  filter: blur(${({ season }) => (season === 'summer' ? '7px' : '9px')});
  opacity: ${({ season }) => (season === 'winter' ? 0.3 : season === 'summer' ? 0.72 : 0.56)};
  mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.78) 44%, rgba(0, 0, 0, 0.22) 72%, transparent 100%);
`

const LeafShadow = styled.span<{ season: Season }>`
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--w);
  height: var(--h);
  border-radius: ${({ season }) => (season === 'autumn' ? '56% 12% 62% 18%' : '82% 0 82% 0')};
  background:
    radial-gradient(ellipse at 45% 44%, ${({ season }) => seasonalShadow(season)} 0%, ${({ season }) => seasonalShadow(season)} 42%, transparent 74%);
  transform: translate(-50%, -50%) rotate(var(--r));
  opacity: var(--o);
`

const CanopyAccent = styled.div<{ season: Season }>`
  position: fixed;
  top: -8px;
  right: -14px;
  z-index: 1;
  width: 430px;
  height: 180px;
  pointer-events: none;
  opacity: ${({ season }) => (season === 'winter' ? 0.72 : 0.88)};
  filter: blur(0.15px);
  mix-blend-mode: ${({ season }) => (season === 'winter' ? 'multiply' : 'normal')};
  mask-image: linear-gradient(90deg, transparent 0%, #000 18%, #000 100%);

  .branch {
    position: absolute;
    height: ${({ season }) => (season === 'winter' ? '4px' : '5px')};
    border-radius: 999px;
    background: ${({ season }) =>
      season === 'winter'
        ? 'linear-gradient(90deg, rgba(68, 59, 54, 0.1), rgba(48, 41, 38, 0.72))'
        : season === 'autumn'
          ? 'linear-gradient(90deg, rgba(112, 60, 25, 0.04), rgba(112, 60, 25, 0.66))'
          : season === 'summer'
            ? 'linear-gradient(90deg, rgba(53, 91, 38, 0.03), rgba(53, 91, 38, 0.5))'
            : 'linear-gradient(90deg, rgba(94, 55, 38, 0.03), rgba(94, 55, 38, 0.58))'};
    transform-origin: right center;
  }

  .branch-main {
    top: 28px;
    right: -24px;
    width: 330px;
    transform: rotate(-9deg);
  }

  .branch-sub-a {
    top: 42px;
    right: 118px;
    width: 130px;
    transform: rotate(31deg);
    opacity: 0.72;
  }

  .branch-sub-b {
    top: 18px;
    right: 74px;
    width: 160px;
    transform: rotate(-35deg);
    opacity: 0.58;
  }

  .accent {
    position: absolute;
    width: ${({ season }) => (season === 'winter' ? '8px' : season === 'autumn' ? '30px' : season === 'spring' ? '18px' : '36px')};
    height: ${({ season }) => (season === 'winter' ? '8px' : season === 'autumn' ? '28px' : season === 'spring' ? '16px' : '26px')};
    background: ${({ season }) =>
      season === 'spring'
        ? 'radial-gradient(circle at 52% 42%, rgba(255, 235, 238, 0.95) 0 22%, rgba(246, 142, 155, 0.74) 23% 54%, rgba(255, 194, 204, 0.28) 55% 100%)'
        : season === 'summer'
          ? 'linear-gradient(135deg, rgba(117, 158, 67, 0.94), rgba(46, 92, 38, 0.76))'
          : season === 'autumn'
            ? 'linear-gradient(135deg, rgba(236, 143, 37, 0.95), rgba(171, 83, 23, 0.76))'
            : 'radial-gradient(circle, rgba(255,255,255,0.9) 0 42%, rgba(145, 163, 174, 0.44) 43% 100%)'};
    border-radius: ${({ season }) =>
      season === 'spring' ? '64% 36% 66% 34%' : season === 'autumn' ? '60% 7% 64% 14%' : season === 'winter' ? '50%' : '76% 14% 76% 14%'};
    box-shadow: ${({ season }) =>
      season === 'spring'
        ? '0 5px 9px rgba(205, 111, 119, 0.14)'
        : season === 'winter'
          ? '0 0 10px rgba(255,255,255,0.7)'
          : 'inset -5px -5px 9px rgba(37, 50, 25, 0.16)'};
    transform: translate(-50%, -50%) rotate(var(--r)) scale(var(--s));
    opacity: var(--o);
  }

  .accent-1 { left: 76%; top: 18%; --r: 18deg; --s: 1; --o: .92; }
  .accent-2 { left: 86%; top: 12%; --r: -18deg; --s: .82; --o: .78; }
  .accent-3 { left: 92%; top: 28%; --r: 36deg; --s: 1.08; --o: .82; }
  .accent-4 { left: 68%; top: 33%; --r: -42deg; --s: .74; --o: .72; }
  .accent-5 { left: 58%; top: 19%; --r: 12deg; --s: .62; --o: .68; }
  .accent-6 { left: 79%; top: 44%; --r: -8deg; --s: .7; --o: .66; }
  .accent-7 { left: 98%; top: 6%; --r: 22deg; --s: .7; --o: .62; }
  .accent-8 { left: 52%; top: 42%; --r: 50deg; --s: .56; --o: .54; }
  .accent-9 { left: 70%; top: 5%; --r: -26deg; --s: .58; --o: .56; }
  .accent-10 { left: 88%; top: 48%; --r: 8deg; --s: .56; --o: .52; }
  .accent-11 { left: 62%; top: 8%; --r: 42deg; --s: .5; --o: .46; }
  .accent-12 { left: 95%; top: 42%; --r: -33deg; --s: .56; --o: .5; }
  .accent-13 { left: 74%; top: 58%; --r: 19deg; --s: .42; --o: .4; }
  .accent-14 { left: 83%; top: 65%; --r: -12deg; --s: .44; --o: .36; }
  .accent-15 { left: 67%; top: 72%; --r: 31deg; --s: .34; --o: .28; }
  .accent-16 { left: 90%; top: 72%; --r: -28deg; --s: .36; --o: .3; }
  .accent-17 { left: 56%; top: 62%; --r: 14deg; --s: .32; --o: .24; }
  .accent-18 { left: 99%; top: 58%; --r: 20deg; --s: .38; --o: .26; }
`

const AtmosphericParticles = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  mix-blend-mode: ${({ season }) => (season === 'winter' ? 'screen' : 'soft-light')};
  opacity: ${({ season }) => (season === 'summer' ? 0.36 : 0.46)};
  color: ${({ season }) => seasonalParticle(season)};
`

const SoftNatureCorners = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  opacity: ${({ season }) => (season === 'winter' ? 0.2 : 0.28)};

  .corner {
    position: absolute;
    width: ${({ season }) => (season === 'winter' ? '170px' : '120px')};
    height: ${({ season }) => (season === 'winter' ? '12px' : '84px')};
    filter: blur(${({ season }) => (season === 'winter' ? '1.6px' : '1px')});
    background: ${({ season }) =>
      season === 'spring'
        ? 'radial-gradient(circle at 24% 36%, rgba(245, 154, 166, .52) 0 7px, transparent 8px), radial-gradient(circle at 58% 62%, rgba(255, 207, 214, .42) 0 6px, transparent 7px)'
        : season === 'summer'
          ? 'radial-gradient(ellipse at 30% 42%, rgba(102, 144, 69, .52) 0 24px, transparent 25px), radial-gradient(ellipse at 66% 60%, rgba(62, 108, 52, .34) 0 21px, transparent 22px)'
          : season === 'autumn'
            ? 'radial-gradient(ellipse at 30% 42%, rgba(218, 124, 38, .5) 0 20px, transparent 21px), radial-gradient(ellipse at 66% 60%, rgba(143, 77, 31, .32) 0 18px, transparent 19px)'
            : 'linear-gradient(90deg, transparent, rgba(63, 70, 72, .42), transparent)'};
    transform: rotate(var(--r)) scale(var(--s));
  }

  .corner-left-a {
    left: 202px;
    bottom: 34px;
    --r: -8deg;
    --s: 0.62;
  }

  .corner-left-b {
    left: 252px;
    bottom: 8px;
    --r: 16deg;
    --s: 0.42;
  }

  .corner-right-a {
    right: 6px;
    bottom: 128px;
    --r: 18deg;
    --s: 0.56;
  }

  .corner-right-b {
    right: 122px;
    bottom: 18px;
    --r: -14deg;
    --s: 0.36;
  }
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
  filter: blur(0.8px);
  animation: drift 12s ease-in-out infinite alternate;
`

const GlassDiffusion = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 86% 7%, rgba(255, 255, 255, 0.32), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.14), transparent 30%);
  color: ${({ season }) => seasonalParticle(season)};
  backdrop-filter: blur(0.4px);
  mix-blend-mode: screen;
  opacity: ${({ season }) => (season === 'winter' ? 0.42 : 0.28)};
`

const TextureVeil = styled.div<{ season: Season }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 20%, rgba(70, 64, 50, 0.028) 0 1px, transparent 1.7px),
    radial-gradient(circle at 64% 72%, rgba(255, 255, 255, 0.18) 0 1px, transparent 1.9px),
    linear-gradient(180deg, transparent 0%, rgba(66, 58, 48, 0.035) 100%);
  background-size:
    18px 18px,
    23px 23px,
    auto;
  mix-blend-mode: ${({ season }) => (season === 'winter' ? 'soft-light' : 'multiply')};
  opacity: ${({ season }) => (season === 'winter' ? 0.12 : 0.08)};
`
