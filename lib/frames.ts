export interface FrameDef {
  id: string
  label: string
  number: string
  x: number
  y: number
  w: number
  h: number
  color: string
}

// All frames share the same Y and height — the film strip
export const FRAME_H = 780
export const FILM_MARGIN = 80 // sprocket strip height above & below frames
const GAP = 60

// Frame widths in film reading order
const WIDTHS: Record<string, number> = {
  about:      700,
  work:       1280,
  services:   800,
  process:    1100,
  experience: 740,
  toolkit:    800,
  contact:    700,
}

const COLORS: Record<string, string> = {
  about:      '#c8a96e',
  work:       '#7eb8e8',
  services:   '#7ec89e',
  process:    '#e87eb8',
  experience: '#b87ee8',
  toolkit:    '#7ee8d8',
  contact:    '#e8b87e',
}

const ORDER = ['about', 'work', 'services', 'process', 'experience', 'toolkit', 'contact']
const LABELS: Record<string, string> = {
  about:      'About',
  work:       'Work',
  services:   'Services',
  process:    'Process',
  experience: 'Experience',
  toolkit:    'Toolkit',
  contact:    'Contact',
}

// Calculate total width to center the strip
const totalW = ORDER.reduce((sum, id) => sum + WIDTHS[id] + GAP, 0) - GAP
let cursor = -totalW / 2

export const FRAMES: FrameDef[] = ORDER.map((id, i) => {
  const frame: FrameDef = {
    id,
    label:  LABELS[id],
    number: String(i + 1).padStart(2, '0'),
    x:      Math.round(cursor),
    y:      0,
    w:      WIDTHS[id],
    h:      FRAME_H,
    color:  COLORS[id],
  }
  cursor += WIDTHS[id] + GAP
  return frame
})

export const FRAME_MAP = new Map(FRAMES.map(f => [f.id, f]))

// Bounds include the film strip margins so fitAll shows the full reel
export function getFramesBounds() {
  let minX = Infinity, maxX = -Infinity
  for (const f of FRAMES) {
    minX = Math.min(minX, f.x)
    maxX = Math.max(maxX, f.x + f.w)
  }
  const minY = -FILM_MARGIN
  const maxY = FRAME_H + FILM_MARGIN
  return {
    minX, maxX, minY, maxY,
    w: maxX - minX,
    h: maxY - minY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  }
}
