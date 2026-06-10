import type { Season } from '../../../store/calendarData'

export const radii = {
  panel: '8px',
  control: '8px',
  round: '999px',
} as const

export const shadows = {
  panel: '0 18px 42px rgba(58, 52, 42, 0.08)',
  floating: '0 28px 70px rgba(38, 32, 25, 0.16)',
  soft: '0 12px 24px rgba(71, 110, 75, 0.18)',
} as const

export const seasonTheme: Record<
  Season,
  {
    accent: string
    accentSoft: string
    surface: string
    line: string
    mutedLine: string
    pageBackground: string
    controlSurface: string
    controlLine: string
    calendarSurface: string
    gridLine: string
    selectedCell: string
    canopyGlow: string
    canopyLeaf: string
    canopyShadow: string
    cellLight: string
    soil: string
    drySoil: string
    wetSoil: string
    particle: string
    railTint: string
  }
> = {
  spring: {
    accent: '#5f8e62',
    accentSoft: 'rgba(95, 142, 98, 0.12)',
    surface: '#fffaf6',
    line: 'rgba(113, 106, 91, 0.18)',
    mutedLine: 'rgba(113, 106, 91, 0.11)',
    pageBackground:
      'radial-gradient(circle at 83% 4%, rgba(244, 171, 181, 0.45), transparent 28%), radial-gradient(circle at 46% 8%, rgba(255, 245, 223, 0.88), transparent 36%), linear-gradient(115deg, #fbf5ec 0%, #fffaf6 45%, #f7f2e9 100%)',
    controlSurface:
      'linear-gradient(180deg, rgba(255, 250, 246, 0.84), rgba(255, 239, 236, 0.62))',
    controlLine: 'rgba(171, 116, 111, 0.22)',
    calendarSurface:
      'linear-gradient(180deg, rgba(255, 250, 247, 0.78), rgba(255, 241, 237, 0.5)), radial-gradient(ellipse at 80% 0%, rgba(245, 158, 172, 0.22), transparent 46%)',
    gridLine: 'rgba(169, 118, 108, 0.18)',
    selectedCell:
      'linear-gradient(135deg, rgba(245, 162, 177, 0.2), rgba(95, 142, 98, 0.16)), linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,246,242,0.78))',
    canopyGlow:
      'radial-gradient(ellipse at 78% 8%, rgba(245, 158, 172, 0.44), transparent 32%), radial-gradient(ellipse at 72% 22%, rgba(125, 143, 73, 0.12), transparent 38%)',
    canopyLeaf: 'linear-gradient(135deg, rgba(248, 162, 177, 0.94), rgba(255, 223, 219, 0.82))',
    canopyShadow: 'rgba(128, 93, 78, 0.16)',
    cellLight: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,252,247,0.72))',
    soil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(123, 89, 62, 0.18) 26%, rgba(91, 60, 40, 0.74) 72%, rgba(60, 42, 31, 0.55))',
    drySoil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(162, 121, 76, 0.2) 24%, rgba(128, 85, 52, 0.68) 72%, rgba(94, 62, 43, 0.5))',
    wetSoil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(74, 74, 59, 0.16) 22%, rgba(53, 43, 34, 0.82) 72%, rgba(35, 49, 44, 0.56))',
    particle:
      'radial-gradient(circle, rgba(246, 151, 164, 0.68) 0 2px, transparent 3px), radial-gradient(circle, rgba(255, 213, 218, 0.72) 0 2px, transparent 3px)',
    railTint: 'rgba(255, 249, 241, 0.66)',
  },
  summer: {
    accent: '#6f9852',
    accentSoft: 'rgba(111, 152, 82, 0.13)',
    surface: '#fbfff4',
    line: 'rgba(109, 125, 86, 0.18)',
    mutedLine: 'rgba(109, 125, 86, 0.11)',
    pageBackground:
      'radial-gradient(circle at 81% 3%, rgba(119, 160, 74, 0.5), transparent 28%), radial-gradient(circle at 42% 10%, rgba(255, 247, 197, 0.7), transparent 34%), linear-gradient(115deg, #f7f7ed 0%, #fffdf5 45%, #edf5e6 100%)',
    controlSurface:
      'linear-gradient(180deg, rgba(253, 255, 241, 0.86), rgba(238, 250, 220, 0.62))',
    controlLine: 'rgba(94, 133, 63, 0.24)',
    calendarSurface:
      'linear-gradient(180deg, rgba(253, 255, 242, 0.78), rgba(235, 249, 218, 0.5)), radial-gradient(ellipse at 80% 0%, rgba(111, 152, 82, 0.24), transparent 46%)',
    gridLine: 'rgba(96, 126, 69, 0.2)',
    selectedCell:
      'linear-gradient(135deg, rgba(111, 152, 82, 0.22), rgba(255, 242, 150, 0.18)), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(246,255,231,0.76))',
    canopyGlow:
      'radial-gradient(ellipse at 80% 6%, rgba(57, 110, 39, 0.36), transparent 32%), radial-gradient(ellipse at 67% 20%, rgba(32, 78, 32, 0.16), transparent 38%)',
    canopyLeaf: 'linear-gradient(135deg, rgba(91, 137, 45, 0.96), rgba(38, 85, 35, 0.74))',
    canopyShadow: 'rgba(47, 85, 38, 0.18)',
    cellLight: 'linear-gradient(180deg, rgba(255,255,255,0.93), rgba(253,255,245,0.72))',
    soil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(134, 101, 61, 0.18) 24%, rgba(95, 65, 40, 0.76) 72%, rgba(60, 46, 34, 0.58))',
    drySoil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(181, 139, 83, 0.18) 24%, rgba(137, 92, 52, 0.62) 72%, rgba(94, 62, 43, 0.48))',
    wetSoil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(69, 77, 54, 0.17) 22%, rgba(46, 42, 31, 0.84) 72%, rgba(34, 55, 50, 0.62))',
    particle: 'radial-gradient(circle, rgba(72, 111, 48, 0.22) 0 2px, transparent 3px)',
    railTint: 'rgba(249, 255, 239, 0.66)',
  },
  autumn: {
    accent: '#bf7b2f',
    accentSoft: 'rgba(191, 123, 47, 0.13)',
    surface: '#fff8ef',
    line: 'rgba(166, 119, 64, 0.2)',
    mutedLine: 'rgba(166, 119, 64, 0.12)',
    pageBackground:
      'radial-gradient(circle at 86% 6%, rgba(235, 155, 69, 0.5), transparent 30%), radial-gradient(circle at 47% 8%, rgba(255, 239, 213, 0.82), transparent 36%), linear-gradient(115deg, #fbf2e5 0%, #fffaf2 45%, #f4eee4 100%)',
    controlSurface:
      'linear-gradient(180deg, rgba(255, 247, 235, 0.86), rgba(255, 228, 197, 0.62))',
    controlLine: 'rgba(191, 123, 47, 0.25)',
    calendarSurface:
      'linear-gradient(180deg, rgba(255, 248, 238, 0.8), rgba(255, 230, 200, 0.48)), radial-gradient(ellipse at 80% 0%, rgba(217, 124, 33, 0.24), transparent 46%)',
    gridLine: 'rgba(178, 110, 49, 0.2)',
    selectedCell:
      'linear-gradient(135deg, rgba(191, 123, 47, 0.22), rgba(112, 68, 34, 0.13)), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,241,224,0.78))',
    canopyGlow:
      'radial-gradient(ellipse at 82% 8%, rgba(217, 124, 33, 0.42), transparent 33%), radial-gradient(ellipse at 66% 18%, rgba(124, 70, 27, 0.2), transparent 38%)',
    canopyLeaf: 'linear-gradient(135deg, rgba(229, 132, 37, 0.96), rgba(151, 78, 25, 0.72))',
    canopyShadow: 'rgba(140, 82, 35, 0.2)',
    cellLight: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,239,0.72))',
    soil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(166, 112, 62, 0.22) 23%, rgba(112, 70, 39, 0.78) 72%, rgba(75, 48, 31, 0.56))',
    drySoil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(185, 127, 70, 0.24) 23%, rgba(138, 83, 44, 0.68) 72%, rgba(92, 56, 35, 0.5))',
    wetSoil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(79, 73, 52, 0.16) 22%, rgba(55, 43, 33, 0.82) 72%, rgba(39, 49, 44, 0.56))',
    particle:
      'radial-gradient(circle, rgba(214, 120, 30, 0.66) 0 2px, transparent 3px), radial-gradient(circle, rgba(121, 74, 30, 0.5) 0 2px, transparent 3px)',
    railTint: 'rgba(255, 248, 238, 0.66)',
  },
  winter: {
    accent: '#6d99bc',
    accentSoft: 'rgba(109, 153, 188, 0.13)',
    surface: '#f8fbff',
    line: 'rgba(139, 164, 184, 0.24)',
    mutedLine: 'rgba(139, 164, 184, 0.14)',
    pageBackground:
      'radial-gradient(circle at 82% 7%, rgba(171, 205, 231, 0.55), transparent 29%), radial-gradient(circle at 48% 18%, rgba(255,255,255,0.9), transparent 36%), linear-gradient(115deg, #eef5fb 0%, #fbfcfb 45%, #f4f9ff 100%)',
    controlSurface:
      'linear-gradient(180deg, rgba(249, 253, 255, 0.9), rgba(229, 242, 251, 0.66))',
    controlLine: 'rgba(109, 153, 188, 0.26)',
    calendarSurface:
      'linear-gradient(180deg, rgba(249, 253, 255, 0.84), rgba(231, 243, 251, 0.54)), radial-gradient(ellipse at 80% 0%, rgba(171, 205, 231, 0.3), transparent 46%)',
    gridLine: 'rgba(110, 148, 177, 0.22)',
    selectedCell:
      'linear-gradient(135deg, rgba(109, 153, 188, 0.22), rgba(255,255,255,0.28)), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(238,248,255,0.8))',
    canopyGlow:
      'radial-gradient(ellipse at 78% 12%, rgba(179, 207, 229, 0.62), transparent 30%), radial-gradient(ellipse at 65% 2%, rgba(40, 68, 82, 0.12), transparent 36%)',
    canopyLeaf: 'linear-gradient(135deg, rgba(225, 237, 246, 0.9), rgba(107, 129, 142, 0.32))',
    canopyShadow: 'rgba(82, 106, 124, 0.16)',
    cellLight: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(247,252,255,0.72))',
    soil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(237,245,249,0.9) 33%, rgba(150,132,108,0.46) 74%, rgba(255,255,255,0.74))',
    drySoil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(237,245,249,0.9) 33%, rgba(150,132,108,0.46) 74%, rgba(255,255,255,0.74))',
    wetSoil: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(229,241,248,0.92) 33%, rgba(82,94,101,0.54) 74%, rgba(255,255,255,0.78))',
    particle: 'linear-gradient(180deg, rgba(255,255,255,0.84), rgba(225,235,242,0.4))',
    railTint: 'rgba(248, 252, 255, 0.7)',
  },
}
