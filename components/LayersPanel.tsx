'use client'

import { FRAMES } from '@/lib/frames'

interface Props {
  selectedId: string | null
  onSelect: (id: string) => void
  onFitAll: () => void
}

export default function LayersPanel({ selectedId, onSelect, onFitAll }: Props) {
  return (
    <div className="layers-panel select-none">
      {/* Page */}
      <div style={{ borderBottom: '1px solid #3d3d3d', padding: '0 0 8px' }}>
        <p className="layers-section-title">Pages</p>
        <div className="layer-item active" style={{ color: '#ebebeb', background: '#383838', margin: '0 4px' }}>
          <PageIcon />
          <span>Portfolio</span>
        </div>
      </div>

      {/* Layers */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <p className="layers-section-title">Layers</p>

        {/* Fit all shortcut */}
        <div
          className="layer-item"
          style={{ marginBottom: 4 }}
          onClick={onFitAll}
          title="⌘0 / Escape"
        >
          <FitIcon />
          <span style={{ fontSize: 11, color: '#757575' }}>Zoom to fit all</span>
        </div>

        {FRAMES.map(frame => (
          <div
            key={frame.id}
            className={`layer-item ${selectedId === frame.id ? 'active' : ''}`}
            onClick={() => onSelect(frame.id)}
            title={`Navigate to ${frame.label}`}
          >
            <span
              className="layer-dot"
              style={{ background: frame.color, opacity: selectedId === frame.id ? 1 : 0.6 }}
            />
            <span>{frame.label}</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.4 }}>{frame.number}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid #3d3d3d' }}>
        <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          <a
            href="https://behance.net/kishanspatel"
            target="_blank"
            rel="noopener noreferrer"
            className="layer-item"
            style={{ margin: 0, padding: '4px 8px', borderRadius: 4 }}
          >
            <BehanceIcon />
            <span>Behance</span>
          </a>
          <a
            href="https://linkedin.com/in/kishanspatel"
            target="_blank"
            rel="noopener noreferrer"
            className="layer-item"
            style={{ margin: 0, padding: '4px 8px', borderRadius: 4 }}
          >
            <LinkedInIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Icons ────────────────────────────────────────────────── */
function PageIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1.5" y="1.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

function FitIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function BehanceIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.5 5.5C5.33 5.5 6 4.83 6 4C6 3.17 5.33 2.5 4.5 2.5H1.5V9.5H5C5.83 9.5 6.5 8.83 6.5 8C6.5 7.17 5.6 5.5 4.5 5.5Z" stroke="currentColor" strokeWidth="1"/>
      <path d="M8 4H11M7.5 7.5H10.5C10.5 8.88 9.5 9.5 8.75 9.5C7.75 9.5 7 8.83 7 7C7 5.17 7.75 4.5 8.75 4.5C9.75 4.5 10.5 5.17 10.5 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1"/>
      <path d="M3.5 5.5V8.5M3.5 3.5V3.51M5.5 8.5V6.5C5.5 5.9 6 5.5 6.5 5.5S7.5 5.9 7.5 6.5V8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}
