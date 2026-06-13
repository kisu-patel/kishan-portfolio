import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Kishan S. Patel — UI / UX Designer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#080808',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 80px',
        fontFamily: 'system-ui, -apple-system, Helvetica, sans-serif',
        position: 'relative',
      }}
    >
      {/* Subtle grid dots */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(200,169,110,0.07) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.4,
        display: 'flex',
      }} />

      {/* Frame numbers strip */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 56, zIndex: 1 }}>
        {['01', '02', '03', '04', '05', '06', '07'].map(n => (
          <span key={n} style={{ fontSize: 11, color: 'rgba(200,169,110,0.3)', letterSpacing: 6, fontWeight: 600 }}>{n}</span>
        ))}
      </div>

      {/* Main heading */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
        <div style={{ fontSize: 13, color: '#c8a96e', letterSpacing: 10, textTransform: 'uppercase', marginBottom: 24, fontWeight: 700 }}>
          UI / UX DESIGNER
        </div>
        <div style={{
          fontSize: 100,
          fontWeight: 900,
          color: '#f2ede6',
          letterSpacing: -3,
          lineHeight: 0.88,
          marginBottom: 40,
        }}>
          KISHAN<br />
          <span style={{ color: 'rgba(242,237,230,0.5)' }}>S. PATEL</span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ fontSize: 15, color: '#585450' }}>Motadata · ObserveOps</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(200,169,110,0.4)', display: 'flex' }} />
          <span style={{ fontSize: 15, color: '#585450' }}>Ahmedabad, India</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(200,169,110,0.4)', display: 'flex' }} />
          <span style={{ fontSize: 15, color: '#585450' }}>4+ Years</span>
        </div>
      </div>

      {/* Bottom accent */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
        <div style={{ width: 48, height: 2, background: '#c8a96e', opacity: 0.7 }} />
        <span style={{ fontSize: 12, color: 'rgba(200,169,110,0.5)', letterSpacing: 4 }}>PORTFOLIO</span>
      </div>
    </div>,
    { ...size }
  )
}
