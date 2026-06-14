'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, SceneHead, Chip, CountUp, EASE } from './primitives'
import {
  PROFILE, STATS, SPECS, CURRENT_ROLE,
  PROJECTS, PROCESS_LABELS,
  SERVICES, STEPS, TIMELINE,
  SKILL_DOMAINS, TOOLS, METHODS, AI_TOOLS,
  CONTACT_LINKS, CONTACT_BLURB,
} from '@/lib/content'

interface SceneProps {
  index: number
}

/* ── 01 · About (hero) ─────────────────────────────────────── */
export function AboutScene({ index }: SceneProps) {
  return (
    <div className="m-wrap" style={{ gap: 22 }}>
      <Reveal style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROFILE.photo}
          alt={PROFILE.name}
          style={{
            width: 84, height: 84, borderRadius: 12, objectFit: 'cover',
            border: '1px solid rgba(200,169,110,0.25)', flexShrink: 0, background: '#1a1a1a',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="m-num">01 / 07 · About</span>
          <span style={{ fontSize: 11, color: '#56524c', letterSpacing: '0.04em', lineHeight: 1.5 }}>
            {PROFILE.location}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.05} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h1 className="m-title" style={{ fontSize: 'clamp(2.7rem, 16vw, 4.2rem)' }}>
          {PROFILE.firstName}<br />{PROFILE.lastName}
        </h1>
        <p className="m-eyebrow">{PROFILE.role} · {PROFILE.company}</p>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="m-body">{PROFILE.bio}</p>
      </Reveal>

      <Reveal delay={0.15} style={{ display: 'flex', gap: 8 }}>
        {STATS.map((s) => (
          <div key={s.label} className="m-card" style={{ flex: 1, padding: '12px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <CountUp
                value={s.val}
                suffix={s.suffix}
                style={{ fontSize: 26, fontWeight: 700, color: '#c8a96e', fontFamily: 'var(--font-display)', lineHeight: 1 }}
              />
              <span style={{ fontSize: 8, color: '#43403b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.unit}</span>
            </div>
            <p style={{ fontSize: 9.5, color: '#56524c', marginTop: 5, letterSpacing: '0.03em' }}>{s.label}</p>
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.2} className="m-card" style={{ background: 'rgba(200,169,110,0.05)', borderColor: 'rgba(200,169,110,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div>
            <p className="m-eyebrow" style={{ fontSize: 9 }}>{CURRENT_ROLE.company}</p>
            <p style={{ fontSize: 14, color: '#e8e2d8', fontWeight: 600, marginTop: 3 }}>{CURRENT_ROLE.title}</p>
          </div>
          <span style={{ fontSize: 10, color: '#56524c', whiteSpace: 'nowrap' }}>{CURRENT_ROLE.period}</span>
        </div>
        <p style={{ fontSize: 12, color: '#6f6b64', lineHeight: 1.6, marginTop: 8 }}>{CURRENT_ROLE.blurb}</p>
      </Reveal>

      <Reveal delay={0.25} style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {SPECS.map((s) => <Chip key={s}>{s}</Chip>)}
      </Reveal>

      <Reveal delay={0.3} style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <a href="https://behance.net/kishanspatel" target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, textAlign: 'center', fontSize: 12.5, fontWeight: 600, color: '#080808',
            background: '#c8a96e', padding: '12px 16px', borderRadius: 6, textDecoration: 'none',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
          Behance ↗
        </a>
        <a href="/resume" target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, textAlign: 'center', fontSize: 12.5, fontWeight: 500, color: '#a09b93',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 16px', borderRadius: 6, textDecoration: 'none', letterSpacing: '0.04em',
          }}>
          Resume ↗
        </a>
      </Reveal>
    </div>
  )
}

/* ── 02 · Selected Work ────────────────────────────────────── */
export function WorkScene({ index }: SceneProps) {
  return (
    <div className="m-wrap" style={{ justifyContent: 'flex-start', gap: 18 }}>
      <SceneHead index={index} title="Selected Work" meta={<>BEHANCE<br />/KISHANSPATEL</>} />

      <Reveal style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 9, color: '#2f2c28', letterSpacing: '0.12em', textTransform: 'uppercase', marginRight: 4 }}>Process</span>
        {PROCESS_LABELS.map((l, i) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Chip style={{ fontSize: 9.5, padding: '2px 7px' }}>{l}</Chip>
            {i < PROCESS_LABELS.length - 1 && <span style={{ fontSize: 9, color: '#2a2a2a' }}>→</span>}
          </span>
        ))}
      </Reveal>

      {PROJECTS.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.05} className="m-card" style={{ padding: '18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#26241f', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{p.index}</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#e8e2d8', lineHeight: 1.15 }}>{p.title}</h3>
          </div>
          <p style={{ fontSize: 11.5, color: '#605c56', lineHeight: 1.5 }}>{p.subtitle}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 9, color: '#3a3733', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.year}</span>
            <span style={{ fontSize: 9, color: '#3a3733', letterSpacing: '0.03em' }}>{p.scope}</span>
          </div>

          {/* Process bars */}
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            {PROCESS_LABELS.map((l, bi) => (
              <div key={l} style={{ flex: 1, height: 3, borderRadius: 2, background: '#1c1b19', overflow: 'hidden' }}>
                {p.process[bi] && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.2 + bi * 0.08 }}
                    style={{ height: '100%', background: '#c8a96e', borderRadius: 2, transformOrigin: 'left' }}
                  />
                )}
              </div>
            ))}
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {p.contributions.map((c, ci) => (
              <li key={ci} style={{ display: 'flex', gap: 9, fontSize: 12, color: '#716d66', lineHeight: 1.55 }}>
                <span style={{
                  flexShrink: 0, marginTop: 1, width: 15, height: 15, borderRadius: 3,
                  border: '1px solid rgba(200,169,110,0.22)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 8, color: '#c8a96e',
                }}>{ci + 1}</span>
                {c}
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
            {p.tags.map((t) => <Chip key={t} style={{ fontSize: 9.5, padding: '2px 8px', color: '#48443f' }}>{t}</Chip>)}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/* ── 03 · Services ─────────────────────────────────────────── */
export function ServicesScene({ index }: SceneProps) {
  return (
    <div className="m-wrap" style={{ justifyContent: 'flex-start', gap: 18 }}>
      <SceneHead index={index} title="Services" meta={<>PRODUCT<br />DESIGNER</>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SERVICES.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.05} className="m-card" style={{ padding: '18px 18px' }}>
            <span style={{
              position: 'absolute', bottom: -14, right: 8, fontSize: 72, fontWeight: 800,
              color: '#141311', fontFamily: 'var(--font-display)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
            }}>{s.num}</span>
            <p className="m-eyebrow" style={{ fontSize: 9 }}>{s.focus}</p>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#e8e2d8', marginTop: 5 }}>{s.title}</h3>
            <p style={{ fontSize: 12.5, color: '#6f6b64', lineHeight: 1.6, marginTop: 8, position: 'relative' }}>{s.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12, position: 'relative' }}>
              {s.deliverables.map((d) => <Chip key={d} style={{ fontSize: 10, padding: '2px 8px', color: '#48443f' }}>{d}</Chip>)}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ── 04 · Process ──────────────────────────────────────────── */
export function ProcessScene({ index }: SceneProps) {
  return (
    <div className="m-wrap" style={{ justifyContent: 'flex-start', gap: 18 }}>
      <SceneHead index={index} title="Process" meta={<>5 STAGES<br />END-TO-END</>} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {STEPS.map((step, i) => (
          <Reveal key={step.number} delay={i * 0.04} style={{ display: 'flex', gap: 14 }}>
            {/* Gutter: number + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30, flexShrink: 0 }}>
              <span style={{
                fontSize: 18, fontWeight: 700, color: '#c8a96e', fontFamily: 'var(--font-display)',
                lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}>{step.number}</span>
              {i < STEPS.length - 1 && (
                <div style={{ width: 1, flex: 1, minHeight: 26, background: 'rgba(255,255,255,0.08)', marginTop: 6 }} />
              )}
            </div>
            {/* Content */}
            <div style={{ paddingBottom: 22, flex: 1 }}>
              <p className="m-eyebrow" style={{ fontSize: 9 }}>{step.focus}</p>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e8e2d8', marginTop: 4, lineHeight: 1.2 }}>{step.label}</h3>
              <p style={{ fontSize: 12.5, color: '#6f6b64', lineHeight: 1.6, marginTop: 7 }}>{step.description}</p>
              <p style={{ fontSize: 10, color: '#48443f', marginTop: 8, letterSpacing: '0.02em' }}>
                <span style={{ color: '#2f2c28', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Output · </span>{step.output}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ── 05 · Experience ───────────────────────────────────────── */
export function ExperienceScene({ index }: SceneProps) {
  return (
    <div className="m-wrap" style={{ justifyContent: 'flex-start', gap: 18 }}>
      <SceneHead index={index} title="Experience" meta={<>4+ YEARS<br />FULL-TIME</>} />

      <Reveal className="m-card" style={{ background: 'rgba(200,169,110,0.05)', borderColor: 'rgba(200,169,110,0.12)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 30, fontWeight: 700, color: '#c8a96e', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            <CountUp value={4} suffix="+" />
          </p>
          <div>
            <p className="m-eyebrow" style={{ fontSize: 9 }}>Current</p>
            <p style={{ fontSize: 12, color: '#6f6b64', marginTop: 2 }}>Years at Motadata</p>
          </div>
        </div>
      </Reveal>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {TIMELINE.map((item, i) => (
          <Reveal key={i} delay={i * 0.04} style={{ display: 'flex', gap: 14 }}>
            {/* Gutter */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 12, flexShrink: 0 }}>
              <span className={item.live ? 'live-dot' : undefined} style={item.live ? { marginTop: 5 } : {
                width: 8, height: 8, borderRadius: '50%', marginTop: 5,
                background: item.accent ? '#c8a96e' : '#26241f', border: `2px solid ${item.accent ? '#c8a96e' : '#2a2a2a'}`,
              }} />
              {i < TIMELINE.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 30, background: 'rgba(255,255,255,0.07)', marginTop: 6 }} />}
            </div>
            {/* Content */}
            <div style={{ paddingBottom: 22, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: item.accent ? '#e8e2d8' : '#9a958d', lineHeight: 1.25 }}>{item.role}</h3>
                <span style={{ fontSize: 9.5, color: '#48443f', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.period}</span>
              </div>
              <p style={{ fontSize: 11, color: item.accent ? '#c8a96e' : '#56524c', marginTop: 2 }}>{item.company}</p>
              <ul style={{ listStyle: 'none', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {item.bullets.map((b, j) => (
                  <li key={j} style={{ display: 'flex', gap: 7, fontSize: 11.5, color: '#605c56', lineHeight: 1.55 }}>
                    <span style={{ color: '#2f2c28', flexShrink: 0 }}>—</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ── 06 · Toolkit ──────────────────────────────────────────── */
export function ToolkitScene({ index }: SceneProps) {
  return (
    <div className="m-wrap" style={{ justifyContent: 'flex-start', gap: 18 }}>
      <SceneHead index={index} title="Toolkit" meta={<>4 DOMAINS<br />OF CRAFT</>} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SKILL_DOMAINS.map((d, i) => (
          <Reveal key={d.area} delay={i * 0.05} className="m-card" style={{ padding: '14px 16px', borderLeft: `2px solid ${d.color}55` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 14, color: d.color, lineHeight: 1 }}>{d.icon}</span>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: '#ede8e0' }}>{d.area}</p>
                <p style={{ fontSize: 9.5, color: `${d.color}99`, marginTop: 1 }}>{d.note}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 11 }}>
              {d.skills.map((sk) => (
                <span key={sk} style={{
                  fontSize: 10, color: '#6f6a63', background: `${d.color}0d`,
                  border: `1px solid ${d.color}2a`, borderRadius: 4, padding: '2px 7px', letterSpacing: '0.02em',
                }}>{sk}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="m-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <p className="m-eyebrow" style={{ fontSize: 8.5 }}>Tools</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {TOOLS.map((t) => <Chip key={t} style={{ fontSize: 10, padding: '2px 8px' }}>{t}</Chip>)}
          </div>
        </div>
        <div>
          <p className="m-eyebrow" style={{ fontSize: 8.5 }}>Methods</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {METHODS.map((m) => <Chip key={m} style={{ fontSize: 10, padding: '2px 8px' }}>{m}</Chip>)}
          </div>
        </div>
        <div>
          <p className="m-eyebrow" style={{ fontSize: 8.5 }}>AI</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {AI_TOOLS.map((a) => (
              <span key={a.name} style={{
                fontSize: 10, color: '#56524c', border: `1px solid ${a.color}33`, borderLeft: `2px solid ${a.color}66`,
                borderRadius: 3, padding: '2px 8px', background: `${a.color}0d`,
              }}>{a.name}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}

/* ── 07 · Contact ──────────────────────────────────────────── */
export function ContactScene({ index }: SceneProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 5000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6, padding: '12px 13px', fontSize: 14, color: '#f2ede6', outline: 'none',
    fontFamily: 'inherit', WebkitAppearance: 'none',
  }

  return (
    <div className="m-wrap" style={{ justifyContent: 'flex-start', gap: 18 }}>
      <SceneHead index={index} title="Contact" meta={<>OPEN TO<br />PROJECTS</>} />

      <Reveal><p className="m-body" style={{ fontSize: 13.5 }}>{CONTACT_BLURB}</p></Reveal>

      <Reveal delay={0.05} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CONTACT_LINKS.map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 14px', borderRadius: 6, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none',
            }}>
            <span style={{ fontSize: 9, color: '#3a3733', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.label}</span>
            <span style={{ fontSize: 12.5, color: '#c8a96e', wordBreak: 'break-all', textAlign: 'right' }}>{c.value}</span>
          </a>
        ))}
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" required placeholder="Your name" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <input type="email" required placeholder="you@example.com" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputStyle} />
          <textarea required placeholder="Tell me about the project…" value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            style={{ ...inputStyle, height: 110, resize: 'none', lineHeight: 1.6 }} />
          <button type="submit" disabled={status === 'loading'}
            style={{
              background: status === 'success' ? 'rgba(100,180,100,0.15)' : '#c8a96e',
              color: status === 'success' ? '#7dca7d' : '#080808',
              border: status === 'success' ? '1px solid rgba(100,180,100,0.3)' : 'none',
              borderRadius: 6, padding: '13px 24px', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              opacity: status === 'loading' ? 0.6 : 1,
            }}>
            {status === 'loading' ? 'Sending…' : status === 'success' ? '✓ Sent' : status === 'error' ? 'Try Again' : 'Send Message →'}
          </button>
          {status === 'error' && (
            <p style={{ fontSize: 11.5, color: '#9a5a5a' }}>Failed — email directly at kishanpatel4999@gmail.com</p>
          )}
        </form>
      </Reveal>

      <Reveal delay={0.15} style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#807b73', fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {PROFILE.name}
        </p>
        <p style={{ fontSize: 10, color: '#3a3733', marginTop: 4, letterSpacing: '0.04em' }}>
          {PROFILE.location} · Open to remote
        </p>
      </Reveal>
    </div>
  )
}
