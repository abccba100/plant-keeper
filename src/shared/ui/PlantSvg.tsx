import type { CSSProperties } from 'react'

export type PlantKind = 'monstera' | 'peace' | 'sansevieria' | 'peperomia'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

/* ---- SVG gradient defs (render once at app root) ---- */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="leafShade" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.12)" />
        </linearGradient>
        <radialGradient id="soilGlow" cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="canopyBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        <linearGradient id="gLeafSpring" x1="0.15" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#3f7a3c" /><stop offset="0.5" stopColor="#6aa856" /><stop offset="1" stopColor="#a6d585" />
        </linearGradient>
        <linearGradient id="gLeafSummer" x1="0.15" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#2f5e2c" /><stop offset="0.5" stopColor="#4d8440" /><stop offset="1" stopColor="#7bad5c" />
        </linearGradient>
        <linearGradient id="gLeafRed" x1="0.15" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#a83a1f" /><stop offset="0.5" stopColor="#d4642b" /><stop offset="1" stopColor="#eaa24a" />
        </linearGradient>
        <linearGradient id="gLeafGold" x1="0.15" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#c98a1e" /><stop offset="0.5" stopColor="#e2ad33" /><stop offset="1" stopColor="#f4d066" />
        </linearGradient>
        <linearGradient id="gLeafSage" x1="0.15" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#6f8c74" /><stop offset="0.5" stopColor="#93ad94" /><stop offset="1" stopColor="#c2d2bd" />
        </linearGradient>
        <linearGradient id="gConifer" x1="0.15" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor="#3a5f49" /><stop offset="0.55" stopColor="#577d5f" /><stop offset="1" stopColor="#86a585" />
        </linearGradient>
        <linearGradient id="gBark" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#9a7350" /><stop offset="0.55" stopColor="#7a5538" /><stop offset="1" stopColor="#553a26" />
        </linearGradient>
        <linearGradient id="gBarkGrey" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#9c8a78" /><stop offset="1" stopColor="#5f4d3e" />
        </linearGradient>
        <radialGradient id="gPetalPink" cx="0.5" cy="0.92" r="0.95">
          <stop offset="0" stopColor="#fff6f8" /><stop offset="0.45" stopColor="#fbc6d4" /><stop offset="1" stopColor="#ef9bb1" />
        </radialGradient>
        <radialGradient id="gPetalWhite" cx="0.5" cy="0.92" r="0.95">
          <stop offset="0" stopColor="#ffffff" /><stop offset="0.7" stopColor="#fbfdfb" /><stop offset="1" stopColor="#e4ecdf" />
        </radialGradient>
        <radialGradient id="gPlumeria" cx="0.5" cy="0.9" r="0.95">
          <stop offset="0" stopColor="#fef4d8" /><stop offset="0.55" stopColor="#fffdf6" /><stop offset="1" stopColor="#eef2e6" />
        </radialGradient>
        <radialGradient id="gBerry" cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#e2776a" /><stop offset="0.5" stopColor="#c5463c" /><stop offset="1" stopColor="#9a2f2a" />
        </radialGradient>
        <radialGradient id="gLime" cx="0.36" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#c9e07a" /><stop offset="0.6" stopColor="#93bc46" /><stop offset="1" stopColor="#5f8f2f" />
        </radialGradient>
        <linearGradient id="gBird" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#a7d3ec" /><stop offset="0.55" stopColor="#7bb6df" /><stop offset="1" stopColor="#5793c4" />
        </linearGradient>
        <radialGradient id="gSnow" cx="0.38" cy="0.32" r="0.85">
          <stop offset="0" stopColor="#ffffff" /><stop offset="0.7" stopColor="#f1f7fb" /><stop offset="1" stopColor="#d6e6f0" />
        </radialGradient>
        <linearGradient id="gWing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7c878" /><stop offset="1" stopColor="#ec9f46" />
        </linearGradient>
        <linearGradient id="gPinecone" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#a07c4f" /><stop offset="1" stopColor="#6b4d2e" />
        </linearGradient>
        <linearGradient id="gNut" x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#d99a52" /><stop offset="0.55" stopColor="#bd7838" /><stop offset="1" stopColor="#8f5524" />
        </linearGradient>
        <linearGradient id="gAcornCap" x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#9a6c3c" /><stop offset="1" stopColor="#6b4a26" />
        </linearGradient>
        <linearGradient id="gDragonWing" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#dff0f2" stopOpacity="0.9" /><stop offset="1" stopColor="#a9d6db" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="gDragonBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f97a0" /><stop offset="1" stopColor="#2f5d64" />
        </linearGradient>
        <filter id="decorShadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" floodColor="#3a2e1f" floodOpacity="0.18" />
        </filter>
        <filter id="leafShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0.5" dy="1.4" stdDeviation="1.1" floodColor="#2a3a22" floodOpacity="0.22" />
        </filter>
      </defs>
    </svg>
  )
}

/* ---- Pot ---- */
function Pot({ variant = 'terra' }: { variant?: 'terra' | 'cream' }) {
  const fill = variant === 'terra' ? 'var(--pot-terra)' : 'var(--pot-cream)'
  const deep = variant === 'terra' ? 'var(--pot-terra-deep)' : 'var(--pot-cream-deep)'
  return (
    <g>
      <ellipse cx="0" cy="1.5" rx="17" ry="4" fill="rgba(40,30,20,0.16)" />
      <path d="M-15,-23 L15,-23 L11.5,-2 Q11,1.5 7.5,1.5 L-7.5,1.5 Q-11,1.5 -11.5,-2 Z" fill={fill} />
      <path d="M2,-23 L15,-23 L11.5,-2 Q11,1.5 7.5,1.5 L2,1.5 Z" fill={deep} opacity="0.45" />
      <rect x="-17.5" y="-28" width="35" height="6.5" rx="3.25" fill={fill} />
      <rect x="-17.5" y="-28" width="35" height="2.4" rx="1.2" fill="rgba(255,255,255,0.4)" />
      <rect x="2" y="-28" width="15.5" height="6.5" rx="3" fill={deep} opacity="0.4" />
    </g>
  )
}

function leaf(L: number, W: number, lean: number, fill: string, key: string, midrib = true) {
  const t = `rotate(${lean})`
  return (
    <g key={key} transform={t}>
      <path d={`M0,0 C ${-W},${-L * 0.32} ${-W},${-L * 0.74} 0,${-L} C ${W},${-L * 0.74} ${W},${-L * 0.32} 0,0 Z`} fill={fill} />
      {midrib && <path d={`M0,${-L * 0.06} L0,${-L * 0.9}`} stroke="rgba(0,0,0,0.12)" strokeWidth="0.9" fill="none" strokeLinecap="round" />}
    </g>
  )
}

/* ---- Monstera ---- */
function Monstera({ season }: { season: Season }) {
  const g1 = season === 'winter' ? '#5f8268' : '#3f7a44'
  const g2 = season === 'winter' ? '#6f917a' : '#4f8d52'
  const g3 = season === 'winter' ? '#789a83' : '#62a05f'
  const MLeaf = ({ s, rot, fill }: { s: number; rot: number; fill: string }) => (
    <g transform={`rotate(${rot}) scale(${s})`}>
      <path d="M0,0 C -7,-9 -16,-16 -18,-27 C -19,-33 -16,-30 -13,-31 C -16,-36 -15,-42 -11,-45 C -12,-49 -8,-49 -6,-47 C -4,-52 2,-52 4,-47 C 7,-49 11,-48 10,-44 C 14,-41 14,-35 11,-31 C 15,-31 18,-33 17,-27 C 15,-16 7,-9 0,0 Z" fill={fill} />
      <path d="M0,-4 L0,-44" stroke="rgba(0,0,0,0.13)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M0,-18 L-9,-26 M0,-28 L-7,-36 M0,-18 L9,-26 M0,-28 L7,-36" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  )
  return (
    <g>
      <Pot variant="cream" />
      <g transform="translate(0,-26)">
        <MLeaf s={0.92} rot={-26} fill={g1} />
        <MLeaf s={1.0} rot={2} fill={g2} />
        <MLeaf s={0.86} rot={28} fill={g3} />
      </g>
    </g>
  )
}

/* ---- Peace lily ---- */
function PeaceLily({ season }: { season: Season }) {
  const g1 = season === 'winter' ? '#5e8169' : '#3e7c46'
  const g2 = season === 'winter' ? '#6f9079' : '#52934f'
  const g3 = season === 'winter' ? '#7c9c84' : '#67a25d'
  return (
    <g>
      <Pot variant="cream" />
      <g transform="translate(0,-26)">
        {leaf(46, 8.5, -24, g1, 'l1')}
        {leaf(52, 9, -6, g2, 'l2')}
        {leaf(44, 8, 22, g3, 'l3')}
        {leaf(38, 7, 40, g1, 'l4')}
        <g transform="translate(8,-34) rotate(14)">
          <path d="M0,0 C -8,-4 -8,-18 0,-23 C 7,-18 7,-4 0,0 Z" fill="#fbfbf6" />
          <path d="M0,0 C -8,-4 -8,-18 0,-23 C 4,-18 4,-6 0,0 Z" fill="rgba(120,150,110,0.12)" />
          <rect x="-1.4" y="-18" width="2.8" height="11" rx="1.4" fill="#e8e2b8" />
        </g>
      </g>
    </g>
  )
}

/* ---- Sansevieria ---- */
function Sansevieria({ season }: { season: Season }) {
  const g1 = season === 'winter' ? '#5b8170' : '#3c7a4d'
  const g2 = season === 'winter' ? '#6c9079' : '#4d8a53'
  const edge = season === 'winter' ? '#cdd9c2' : '#c9c06a'
  const blade = (h: number, w: number, lean: number, fill: string, key: string) => (
    <g key={key} transform={`rotate(${lean})`}>
      <path d={`M0,0 C ${-w},${-h * 0.4} ${-w * 0.7},${-h * 0.85} 0,${-h} C ${w * 0.7},${-h * 0.85} ${w},${-h * 0.4} 0,0 Z`} fill={fill} />
      <path d={`M0,${-h * 0.05} L0,${-h * 0.94}`} stroke={edge} strokeWidth="1" opacity="0.7" fill="none" strokeLinecap="round" />
    </g>
  )
  return (
    <g>
      <Pot variant="terra" />
      <g transform="translate(0,-24)">
        {blade(58, 6, -16, g1, 'b1')}
        {blade(66, 6.5, -4, g2, 'b2')}
        {blade(54, 6, 12, g1, 'b3')}
        {blade(44, 5, 26, g2, 'b4')}
      </g>
    </g>
  )
}

/* ---- Peperomia ---- */
function Peperomia({ season }: { season: Season }) {
  const g1 = season === 'winter' ? '#6a8f76' : '#52934f'
  const g2 = season === 'winter' ? '#7a9c83' : '#67a55f'
  const stem = season === 'winter' ? '#8a9c86' : '#6f8a4e'
  const coin = (x: number, y: number, r: number, fill: string, key: string) => (
    <g key={key}>
      <line x1="0" y1="-4" x2={x} y2={y} stroke={stem} strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.86} fill={fill} />
      <circle cx={x} cy={y} r="1.1" fill="rgba(0,0,0,0.14)" />
    </g>
  )
  return (
    <g>
      <Pot variant="terra" />
      <g transform="translate(0,-24)">
        {coin(-11, -22, 6.5, g1, 'c1')}
        {coin(-3, -32, 7, g2, 'c2')}
        {coin(8, -26, 6.5, g1, 'c3')}
        {coin(13, -16, 5.5, g2, 'c4')}
        {coin(-9, -12, 5, g2, 'c5')}
        {coin(2, -20, 6, g1, 'c6')}
      </g>
    </g>
  )
}

const plantGlyphs: Record<PlantKind, React.ComponentType<{ season: Season }>> = {
  monstera: Monstera,
  peace: PeaceLily,
  sansevieria: Sansevieria,
  peperomia: Peperomia,
}

export function PlantGlyph({ kind, season }: { kind: PlantKind; season: Season }) {
  const C = plantGlyphs[kind] ?? Peperomia
  return <C season={season} />
}

function Sprout({ season }: { season: Season }) {
  const g = season === 'winter' ? '#7c9c84' : '#67a25d'
  return (
    <g opacity="0.8">
      <path d="M0,0 C -1,-6 -4,-9 -8,-10 C -4,-12 -1,-9 0,-5 C 1,-9 4,-12 8,-10 C 4,-9 1,-6 0,0 Z" fill={g} />
      <line x1="0" y1="0" x2="0" y2="-7" stroke={g} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )
}

const CELL_SLOTS: Record<number, number[]> = { 1: [50], 2: [33, 67], 3: [24, 50, 76] }

function Ground({ season, w }: { season: Season; w: number }) {
  if (season === 'winter') {
    return (
      <g>
        <path d={`M0,58 Q ${w * 0.25},48 ${w * 0.5},52 T ${w},54 L ${w},70 L0,70 Z`} fill="#f3f8fb" />
        <path d={`M0,58 Q ${w * 0.25},48 ${w * 0.5},52 T ${w},54`} stroke="#dce8ef" strokeWidth="1.4" fill="none" />
        <ellipse cx={w * 0.5} cy="62" rx={w * 0.42} ry="5" fill="rgba(160,190,210,0.18)" />
        {[0.16, 0.42, 0.68, 0.88].map((p, i) => (
          <circle key={i} cx={w * p} cy={50 + (i % 2) * 4} r="1.5" fill="#fff" opacity="0.9" />
        ))}
      </g>
    )
  }
  return (
    <g>
      <path d={`M0,56 Q ${w * 0.28},50 ${w * 0.55},53 T ${w},55 L ${w},70 L0,70 Z`} fill="var(--soil-top)" />
      <path d={`M0,60 Q ${w * 0.3},56 ${w * 0.6},58 T ${w},60 L ${w},70 L0,70 Z`} fill="var(--soil-bottom)" opacity="0.85" />
      <ellipse cx={w * 0.5} cy="58" rx={w * 0.44} ry="4" fill="rgba(255,255,255,0.18)" />
      {[0.12, 0.34, 0.58, 0.8, 0.92].map((p, i) => (
        <ellipse key={i} cx={w * p} cy={54 + (i % 2) * 5} rx="2.4" ry="1.5" fill="#f3a9bb" opacity="0.85" transform={`rotate(${i * 40} ${w * p} ${54 + (i % 2) * 5})`} />
      ))}
    </g>
  )
}

export function GardenScene({ plants, season }: { plants: { kind: PlantKind }[]; season: Season }) {
  const w = 120
  const total = Math.min(plants.length, 3)
  const slots = CELL_SLOTS[total] ?? CELL_SLOTS[1]
  const shown = plants.slice(0, total)
  return (
    <svg viewBox={`0 0 ${w} 70`} preserveAspectRatio="xMidYEnd meet" aria-hidden="true">
      <Ground season={season} w={w} />
      {shown.map((plant, i) => {
        const scale = (plant.kind === 'sansevieria' ? 0.46 : 0.5) - (total === 3 ? 0.05 : 0)
        return (
          <g key={`${plant.kind}-${i}`} transform={`translate(${(w * slots[i]) / 100}, 56) scale(${scale})`}>
            <PlantGlyph kind={plant.kind} season={season} />
          </g>
        )
      })}
      {shown.length === 0 && (
        <g transform={`translate(${w / 2}, 54) scale(1.1)`}><Sprout season={season} /></g>
      )}
    </svg>
  )
}

export function WideScene({ plants, season }: { plants: { kind: PlantKind }[]; season: Season }) {
  const w = 320
  const total = Math.min(plants.length, 4)
  const positions = total === 1 ? [50] : total === 2 ? [36, 64] : total === 3 ? [26, 50, 74] : [20, 40, 60, 80]
  return (
    <svg viewBox={`0 0 ${w} 132`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Ground season={season} w={w} />
      <g transform="translate(0,52)">
        {plants.slice(0, total).map((plant, i) => {
          const scale = plant.kind === 'sansevieria' ? 0.78 : 0.86
          return (
            <g key={`${plant.kind}-${i}`} transform={`translate(${(w * positions[i]) / 100}, ${50 - 52 + 56}) scale(${scale})`}>
              <PlantGlyph kind={plant.kind} season={season} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/* ---- Plant avatar (for sidebar / chips) ---- */
export function PlantAvatar({
  kind,
  season,
  style,
  className,
}: {
  kind: PlantKind
  season: Season
  style?: CSSProperties
  className?: string
}) {
  return (
    <span className={`plant-avatar ${className ?? ''}`} style={style}>
      <svg viewBox="0 0 60 92" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <g transform="translate(30,86) scale(0.66)">
          <PlantGlyph kind={kind} season={season} />
        </g>
      </svg>
    </span>
  )
}
