'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CONTACT_LINKS } from '@/lib/content'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

export default function ContactFrame() {
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
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 4,
    padding: '9px 12px',
    fontSize: 12,
    color: '#f2ede6',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.18s',
  }

  return (
    <motion.div
      className="frame-inner"
      style={{ padding: '32px 36px', gap: 0 }}
      variants={container}
      initial="hidden"
      animate="show"
    >

      {/* Header */}
      <motion.div
        variants={item}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <p className="frame-number">06 / 06</p>
          <h2 className="frame-title" style={{ marginBottom: 0 }}>Contact</h2>
        </div>
        <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.9, textAlign: 'right' }}>
          OPEN TO<br />PROJECTS
        </p>
      </motion.div>

      <motion.div variants={item} className="frame-divider" />

      <div style={{ display: 'flex', gap: 32, flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* Left: info */}
        <motion.div
          variants={item}
          style={{ width: 178, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <p style={{ fontSize: 12, color: '#686460', lineHeight: 1.75 }}>
            Have a product to design or a UX problem to solve? Let&apos;s talk.
            I&apos;m particularly comfortable with data-heavy enterprise platforms.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CONTACT_LINKS.map((contact, i) => (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {contact.label}
                </p>
                <motion.a
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ color: '#d4b878' }}
                  transition={{ duration: 0.15 }}
                  style={{ fontSize: 11, color: '#c8a96e', textDecoration: 'none', wordBreak: 'break-all', letterSpacing: '0.02em', display: 'inline-block' }}
                >
                  {contact.value}
                </motion.a>
              </motion.div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto',
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.018)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 4,
          }}>
            <p style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>
              LOCATION
            </p>
            <p style={{ fontSize: 12, color: '#686460' }}>Ahmedabad, Gujarat</p>
            <p style={{ fontSize: 10, color: '#333', marginTop: 3 }}>India · Open to remote</p>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
                Name
              </label>
              <input
                type="text" required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(200,169,110,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
                Email
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(200,169,110,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 9, color: '#252320', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
              Message
            </label>
            <textarea
              required
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Tell me about the project, timeline, and what you need..."
              style={{ ...inputStyle, height: 120, resize: 'none', lineHeight: 1.65 }}
              onFocus={e => (e.target.style.borderColor = 'rgba(200,169,110,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.03, backgroundColor: status === 'success' ? undefined : '#d4b878' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={{
                background: status === 'success' ? 'rgba(100,180,100,0.15)' : '#c8a96e',
                color: status === 'success' ? '#7dca7d' : '#080808',
                border: status === 'success' ? '1px solid rgba(100,180,100,0.3)' : 'none',
                borderRadius: 4,
                padding: '10px 24px', fontSize: 12, fontWeight: 600,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                opacity: status === 'loading' ? 0.6 : 1,
              }}
            >
              {status === 'loading' ? 'Sending…' : status === 'success' ? '✓ Sent' : status === 'error' ? 'Try Again' : 'Send Message →'}
            </motion.button>

            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: 11, color: '#9a5a5a' }}
              >
                Failed — email directly at kishanpatel4999@gmail.com
              </motion.p>
            )}
          </div>
        </motion.form>
      </div>
    </motion.div>
  )
}
