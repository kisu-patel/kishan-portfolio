'use client'

import type { Tool } from '@/hooks/useCanvas'

interface Props {
  tool: Tool
  setTool: (t: Tool) => void
  displayScale: number
  onFitAll: () => void
}

export default function Toolbar({ tool, setTool, displayScale, onFitAll }: Props) {
  return (
    <div className="toolbar select-none">
      {/* Logo */}
      <span className="toolbar-logo" onClick={onFitAll} title="Fit all (⌘0)">KSP</span>
      <div className="panel-divider" style={{ margin: '0 6px' }} />

      {/* Tools */}
      <button
        className={`toolbar-btn ${tool === 'select' ? 'active' : ''}`}
        onClick={() => setTool('select')}
        title="Select (V)"
        aria-label="Select tool"
      >
        <SelectIcon />
      </button>
      <button
        className={`toolbar-btn ${tool === 'pan' ? 'active' : ''}`}
        onClick={() => setTool('pan')}
        title="Pan (H)"
        aria-label="Pan tool"
      >
        <HandIcon />
      </button>

      {/* Center: page title */}
      <div className="flex-1 flex items-center justify-center gap-2 pointer-events-none">
        <span className="text-[#ebebeb] text-[12px] font-medium tracking-wide">Portfolio</span>
        <span className="toolbar-tag">Figma Canvas</span>
      </div>

      {/* Right: zoom + shortcuts */}
      <span
        className="toolbar-zoom"
        onClick={onFitAll}
        title="Fit all (⌘0 or Escape)"
      >
        {displayScale}%
      </span>

      <div className="panel-divider" style={{ margin: '0 6px' }} />

      <a
        href="/kishan-resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="toolbar-btn"
        title="Download Resume"
        style={{ gap: 6, width: 'auto', padding: '0 10px', fontSize: 11, color: '#c8a96e' }}
      >
        <DownloadIcon />
        <span className="hidden sm:inline" style={{ fontSize: 11 }}>Resume</span>
      </a>

      <button
        className="toolbar-btn"
        style={{ color: '#adadad' }}
        title="Keyboard shortcuts"
        onClick={() => {
          alert(
            'Keyboard shortcuts:\n\n' +
            'V — Select tool\n' +
            'H — Pan tool\n' +
            'Space + drag — Pan canvas\n' +
            'Scroll — Pan canvas\n' +
            'Ctrl/⌘ + scroll — Zoom\n' +
            'Ctrl/⌘ + 0 — Fit all\n' +
            'Ctrl/⌘ + +/− — Zoom in/out\n' +
            'Escape — Fit all'
          )
        }}
      >
        <HelpIcon />
      </button>
    </div>
  )
}

/* ── Inline SVG icons ─────────────────────────────────────── */
function SelectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2L7.5 14L9.5 9.5L14 7.5L2 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

function HandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 2.5V8.5M8.5 3.5V8.5M11 5V8.5M3.5 7V10.5C3.5 12.16 4.84 13.5 6.5 13.5H9.5C11.16 13.5 12.5 12.16 12.5 10.5V8.5C12.5 7.67 11.83 7 11 7C10.63 7 10.29 7.14 10.03 7.37C9.79 6.86 9.29 6.5 8.75 6.5C8.39 6.5 8.06 6.63 7.81 6.84C7.57 6.32 7.07 5.97 6.5 5.97C6.1 5.97 5.73 6.12 5.45 6.38V5C5.45 4.17 4.78 3.5 3.95 3.5S2.5 4.17 2.5 5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 6.5C6 5.4 6.9 4.5 8 4.5S10 5.4 10 6.5C10 7.6 9.1 8 8 8.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
    </svg>
  )
}
