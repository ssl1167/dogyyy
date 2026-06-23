import * as d3 from 'd3'

/** Matches :root tokens in global.css */
export const CHART_THEME = {
  ink: '#71a3c5ff',
  muted: '#9dbe6fff',
  paper: '#f4f0e7',
  paperDeep: '#e8e0d1',
  brick: '#cd5d44ff',
  purple: '#c25564ff',
  teal: '#417a6fff',
  yellow: '#f2b134',
  night: '#101d26',
  line: 'rgba(24, 40, 51, 0.18)',
  grid: 'rgba(24, 40, 51, 0.12)',
  white: '#fffaf1',
} as const

/** Bubble rank gradient — theme-based palette */
const BUBBLE_PALETTE = [
  CHART_THEME.purple,
  CHART_THEME.teal,
  CHART_THEME.brick,
  CHART_THEME.yellow,
  '#8d3928',
  '#4d3485',
  '#2d6a6e',
  CHART_THEME.ink,
]

export function bubbleColor(rank: number, total = 30): string {
  const t = total <= 1 ? 0 : (rank - 1) / (total - 1)
  const idx = t * (BUBBLE_PALETTE.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.min(lo + 1, BUBBLE_PALETTE.length - 1)
  const f = idx - lo
  return d3.interpolateRgb(BUBBLE_PALETTE[lo], BUBBLE_PALETTE[hi])(f)
}

export const HUMANIZATION_PALETTE: Record<string, string> = {
  BELLA: CHART_THEME.purple,
  MAX: CHART_THEME.teal,
  LUNA: '#4d3485',
  CHARLIE: CHART_THEME.brick,
  COCO: CHART_THEME.yellow,
  LOLA: '#8d3928',
  MILO: '#2f6e63ff',
  OLIVER: CHART_THEME.ink,
}

export const SERIES_PALETTE = [
  CHART_THEME.purple,
  CHART_THEME.teal,
  CHART_THEME.brick,
  CHART_THEME.yellow,
  '#8d3928',
  '#eead3dff',
  '#9ba220ff',
  CHART_THEME.ink,
] as const

export function softenColor(color: string, amount = 0.24): string {
  return d3.interpolateRgb(color, CHART_THEME.paper)(amount)
}

export function humanizationColor(name: string, index: number): string {
  const base = HUMANIZATION_PALETTE[name] ?? SERIES_PALETTE[index % SERIES_PALETTE.length]
  return softenColor(base, 0.4)
}

export const CULTURE_COLORS: Record<string, string> = {
  LUNA: CHART_THEME.purple,
  BOWIE: CHART_THEME.yellow,
  ARYA: CHART_THEME.brick,
  LOKI: CHART_THEME.teal,
}

export function tealHeat(t: number): string {
  return d3.interpolateRgb(CHART_THEME.paperDeep, CHART_THEME.teal)(Math.max(0, Math.min(1, t)))
}

export function warmHeat(t: number): string {
  return d3.interpolateRgb(CHART_THEME.paperDeep, CHART_THEME.brick)(Math.max(0, Math.min(1, t)))
}

export function inkHeat(t: number): string {
  return d3.interpolateRgb(CHART_THEME.paperDeep, CHART_THEME.night)(Math.max(0, Math.min(1, t)))
}

export function applyAxisStyle(
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
): void {
  selection.selectAll('path, line').attr('stroke', CHART_THEME.line)
  selection.selectAll('text').attr('fill', CHART_THEME.muted)
}
