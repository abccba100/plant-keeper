import type { SVGProps } from 'react'

export type IconName =
  | 'upload' | 'scan' | 'clock' | 'pen' | 'search' | 'users' | 'calendar'
  | 'list' | 'grid' | 'chevL' | 'chevR' | 'caret' | 'leaf' | 'sun'
  | 'maple' | 'snow' | 'plus' | 'x' | 'edit' | 'drop' | 'check'
  | 'refresh' | 'image' | 'camera' | 'sprout' | 'info' | 'bulb' | 'thermo' | 'moon' | 'home'

const p = {
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const paths: Record<IconName, React.ReactNode> = {
  upload: <><path d="M12 16V5" {...p} /><path d="M7 9l5-4 5 4" {...p} /><path d="M5 19h14" {...p} /></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3" {...p} /><circle cx="12" cy="12" r="3" {...p} /></>,
  clock: <><circle cx="12" cy="12" r="8" {...p} /><path d="M12 8v4l2.5 2" {...p} /></>,
  pen: <><path d="M14 5l5 5L8 21H3v-5L14 5z" {...p} /></>,
  search: <><circle cx="11" cy="11" r="6" {...p} /><path d="M20 20l-4-4" {...p} /></>,
  users: <><circle cx="9" cy="9" r="3" {...p} /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7a3 3 0 0 1 0 5.5M21 19a5 5 0 0 0-3-4.5" {...p} /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" {...p} /><path d="M4 9h16M8 3v4M16 3v4" {...p} /></>,
  list: <><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" {...p} /></>,
  grid: <><rect x="4" y="4" width="16" height="16" rx="2" {...p} /><path d="M4 10h16M10 4v16" {...p} /></>,
  chevL: <><path d="M14 6l-6 6 6 6" {...p} /></>,
  chevR: <><path d="M10 6l6 6-6 6" {...p} /></>,
  caret: <><path d="M6 9l6 6 6-6" {...p} /></>,
  leaf: <><path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z" {...p} /><path d="M5 19C9 13 13 11 17 9" {...p} /></>,
  sun: <><circle cx="12" cy="12" r="4" {...p} /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" {...p} /></>,
  maple: <><path d="M12 3l1.6 3 2.4-1-.6 2.6 3 .4-2 2 2.4 2-3 .6.6 2.4-2.6-1L12 21l-1.8-3.6-2.6 1 .6-2.4-3-.6 2.4-2-2-2 3-.4-.6-2.6 2.4 1z" {...p} /></>,
  snow: <><path d="M12 2v20M4 7l16 10M20 7L4 17" {...p} /><path d="M12 6l-2-2 2-2 2 2-2 2zM12 18l-2 2 2 2 2-2-2-2z" {...p} /></>,
  plus: <><path d="M12 5v14M5 12h14" {...p} /></>,
  x: <><path d="M6 6l12 12M18 6L6 18" {...p} /></>,
  edit: <><path d="M14 5l5 5L8 21H3v-5L14 5z" {...p} /><path d="M3 21h18" {...p} /></>,
  drop: <><path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" {...p} /></>,
  check: <><path d="M5 12l4.5 4.5L19 7" {...p} /></>,
  refresh: <><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4" {...p} /><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4" {...p} /></>,
  image: <><rect x="4" y="5" width="16" height="14" rx="2" {...p} /><circle cx="9" cy="10" r="1.6" {...p} /><path d="M5 17l4.5-4 3 2.5L16 12l3 3" {...p} /></>,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" {...p} /><circle cx="12" cy="13" r="3.4" {...p} /></>,
  sprout: <><path d="M12 20v-7" {...p} /><path d="M12 13c0-3-2-5-6-5 0 3 2 5 6 5z" {...p} /><path d="M12 11c0-3 2-5 6-5 0 3-2 5-6 5z" {...p} /></>,
  info: <><circle cx="12" cy="12" r="8.5" {...p} /><path d="M12 11v5M12 7.6v.01" {...p} /></>,
  bulb: <><path d="M9 18h6M10 21h4" {...p} /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.2 1.3 2.2h4.6c.2-1 .7-1.7 1.3-2.2A6 6 0 0 0 12 3z" {...p} /></>,
  thermo: <><path d="M14 14.5V5a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0z" {...p} /></>,
  moon: <><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 7.2 7.2 0 1 0 20 15.5z" {...p} /></>,
  home: <><path d="M3 11L12 3l9 8v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" {...p} /><path d="M9 21V13h6v8" {...p} /></>,
}

export function Icon({ name, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" {...rest}>{paths[name]}</svg>
}
