import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

type ProcessStep = [boolean, boolean, boolean, boolean]

interface Contribution {
  heading: string
  detail: string
}

interface CaseStudy {
  slug: string
  num: string
  type: string
  year: string
  title: string
  subtitle: string
  role: string
  platform: string
  duration: string
  accentColor: string
  challenge: string
  problemContext: string
  process: ProcessStep
  contributions: Contribution[]
  outcome: string
  outcomeDetail: string
  next: string | null
  prev: string | null
}

const PROC_LABELS = ['Research', 'Wireframe', 'Design', 'Ship']

const CASE_STUDIES: Record<string, CaseStudy> = {
  rum: {
    slug: 'rum',
    num: '01',
    type: 'New Module',
    year: '2023',
    title: 'RUM Module',
    subtitle: 'Real User Monitoring for ObserveOps',
    role: 'Product Designer (sole)',
    platform: 'ObserveOps — Motadata',
    duration: '~4 months',
    accentColor: '#7eb8e8',
    challenge: 'Operations teams using ObserveOps had comprehensive infrastructure metrics but zero visibility into how real users were actually experiencing their applications — whether sessions were slow, where errors surfaced, or which user paths were most impacted.',
    problemContext: 'The RUM module needed to bridge this gap: bringing together session replay, performance metrics, error tracking, and alert configuration into a coherent new area of the platform — without breaking the mental model existing ObserveOps users had built.',
    process: [true, true, true, true],
    contributions: [
      {
        heading: 'Discovery & Scope Definition',
        detail: 'Ran stakeholder interviews with engineering leads and the product manager to understand what telemetry data was available, what operations teams actually needed to monitor, and where existing visibility gaps were causing real production incidents.',
      },
      {
        heading: 'Information Architecture',
        detail: 'Designed the complete IA for the module — session replay, performance timeline, error log table, threshold alert configuration — ensuring every section integrated naturally with existing ObserveOps navigation patterns and terminology.',
      },
      {
        heading: 'Dashboard & Drill-down Flows',
        detail: 'Built the main RUM dashboard with filterable metric cards and a trend timeline, plus deep-dive views for individual sessions, performance breakdowns across page routes, and full error traces with stack context.',
      },
      {
        heading: 'Alert & Threshold Design',
        detail: 'Designed the alert configuration UI within RUM context — threshold setters, condition builders, and notification routing — keeping it fully consistent with the platform\'s wider alert system while making it contextually relevant to user monitoring data.',
      },
    ],
    outcome: 'Shipped as a first-class feature of ObserveOps with zero critical UX issues flagged during engineering QA.',
    outcomeDetail: 'The module passed internal QA with no navigation-related bugs, zero confusion reported in the first internal demo, and became part of the core ObserveOps feature set. Later referenced in customer-facing sales materials as a key differentiator.',
    next: 'metric',
    prev: null,
  },
  metric: {
    slug: 'metric',
    num: '02',
    type: 'Redesign',
    year: '2023',
    title: 'Metric Explorer',
    subtitle: 'Query & Visualisation Redesign for ObserveOps',
    role: 'Product Designer (sole)',
    platform: 'ObserveOps — Motadata',
    duration: '~3 months',
    accentColor: '#7ec89e',
    challenge: 'The existing Metric Explorer had grown organically into a powerful but opaque tool — it could do a lot, but required significant tribal knowledge to use effectively. Operators frequently needed engineer help just to build basic multi-metric queries.',
    problemContext: 'The goal was not to reduce functionality but to restructure how it was exposed: making simple queries feel genuinely simple, while keeping advanced options accessible without cluttering the primary workflow or intimidating new users.',
    process: [false, true, true, true],
    contributions: [
      {
        heading: 'Heuristic Audit & Stakeholder Walkthroughs',
        detail: 'Conducted a structured heuristic evaluation of the existing query builder and ran walkthroughs with internal ops team members to map specific friction points — confusing multi-metric grouping, unclear time range defaults, and inconsistent chart controls.',
      },
      {
        heading: 'Progressive Disclosure Architecture',
        detail: 'Redesigned the query input to surface only the most-used options by default, with an expandable "Advanced" panel for power-user controls. This significantly reduced visible field count without removing any capability.',
      },
      {
        heading: 'Chart & Comparison View Redesign',
        detail: 'Rebuilt the chart type selector, time comparison UI, and axis controls — prioritising discoverability and keyboard accessibility. Standardised on component patterns from the ObserveOps design system for consistency.',
      },
      {
        heading: 'Design System Contribution',
        detail: 'Extracted the redesigned query components as reusable Figma components and documented their usage guidelines. These were later reused directly in the Log Explorer and Flow Explorer redesigns.',
      },
    ],
    outcome: 'Stakeholder walkthroughs of the redesign completed with zero navigation confusion — a measurable improvement from the baseline audit.',
    outcomeDetail: 'Metric Explorer components from this redesign were reused across two subsequent modules (Log Explorer, Flow Explorer), demonstrating the leverage gained from systematic component design over one-off UI work.',
    next: 'dashboard',
    prev: 'rum',
  },
  dashboard: {
    slug: 'dashboard',
    num: '03',
    type: 'Feature Suite',
    year: '2022–24',
    title: 'Dashboard System',
    subtitle: 'Create · Widget · Filter · Topology',
    role: 'Product Designer (sole)',
    platform: 'ObserveOps — Motadata',
    duration: 'Ongoing (2022–2024)',
    accentColor: '#e87eb8',
    challenge: 'ObserveOps users — operations teams monitoring large infrastructure — needed to build custom dashboards from heterogeneous data sources, add widgets from any module, apply global filters, and navigate complex network topology — all within a single coherent experience.',
    problemContext: 'Each capability (dashboard creation, widget management, global filtering, topology) had been separately requested across multiple product cycles. The challenge was designing them to be individually useful while forming a coherent, learnable system.',
    process: [true, true, true, true],
    contributions: [
      {
        heading: '"Create Dashboard" & Template System',
        detail: 'Designed the dashboard creation flow including blank canvas start, template library, and widget-from-scratch creation — with a clear distinction between personal and shared dashboards and permission-aware publishing.',
      },
      {
        heading: '"Add New Widget" Flow',
        detail: 'Built the widget picker and configuration experience — letting users add charts, metric tiles, log views, and topology maps to any dashboard in a consistent, guided workflow with live preview.',
      },
      {
        heading: 'Global Filter & Cross-module Search',
        detail: 'Designed the persistent Global Filter panel that applied time range, entity scope, and tag filters simultaneously across all dashboard widgets — a frequently-requested feature for ops teams managing hundreds of monitored entities.',
      },
      {
        heading: 'Topology Map & Trap Management',
        detail: 'Covered the network topology visualisation, trap log management UI, and NetRoute card view — designing complex graph-based interfaces with hover-detail panels, relationship lines, and progressive filter controls.',
      },
    ],
    outcome: 'The dashboard system became the central navigation hub for ObserveOps — referenced in every new module\'s onboarding documentation.',
    outcomeDetail: 'Dashboard creation components were adopted across 10+ modules. The Global Filter pattern, designed here, became a platform-wide standard applied to modules built independently of this feature suite.',
    next: 'system',
    prev: 'metric',
  },
  system: {
    slug: 'system',
    num: '04',
    type: 'Design Infrastructure',
    year: '2022–24',
    title: 'Design System',
    subtitle: 'Component Library, Tokens & Guidelines — ObserveOps',
    role: 'Design System Owner (sole)',
    platform: 'ObserveOps — Motadata (Figma)',
    duration: 'Ongoing (2022–2024)',
    accentColor: '#b87ee8',
    challenge: 'Designing 20+ modules as the sole designer meant component inconsistency was a constant risk. Without a formal system, each new module risked diverging from established patterns — slowing design velocity, causing engineering rework, and fragmenting the user experience.',
    problemContext: 'The system needed to be comprehensive enough to handle the platform\'s complexity, lightweight enough to maintain alone, and developer-friendly enough to actually drive consistent implementation rather than sitting as an aspirational reference.',
    process: [true, true, true, true],
    contributions: [
      {
        heading: 'Component Library (Figma)',
        detail: 'Built and maintained a comprehensive Figma component library covering buttons, inputs, tables, charts, cards, navigation patterns, empty states, and loading states — all with full variant coverage and auto-layout for responsive behavior.',
      },
      {
        heading: 'Design Tokens',
        detail: 'Defined and documented tokens for color (semantic + primitive palettes), spacing (8px grid), typography (scale, weight, line-height), elevation layers, and animation timing — giving engineering a reliable, single source of truth.',
      },
      {
        heading: 'Typography & Style Guide',
        detail: 'Created a complete style guide covering typeface usage, heading hierarchy, body text, data labels, and monospace code/metric display — critical distinctions for a data-dense monitoring platform where readability directly affects incident response speed.',
      },
      {
        heading: 'Motion & Animation Guidelines',
        detail: 'Documented micro-interaction principles and animation timing values covering state transitions, loading patterns, and feedback animations — ensuring interactions felt intentional and consistent across all 20+ modules.',
      },
    ],
    outcome: 'Single source of truth powering 20+ product modules — adopted by engineering and referenced in PM documentation.',
    outcomeDetail: 'The system reduced design-to-engineering handoff ambiguity significantly. New modules designed using the system required fewer revision cycles and maintained consistent visual quality without requiring design review on every individual component decision.',
    next: null,
    prev: 'dashboard',
  },
}

export async function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cs = CASE_STUDIES[slug]
  if (!cs) return {}
  return {
    title: `${cs.title} — Kishan S. Patel`,
    description: cs.challenge.slice(0, 155),
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = CASE_STUDIES[slug]
  if (!cs) notFound()

  const prevCs = cs.prev ? CASE_STUDIES[cs.prev] : null
  const nextCs = cs.next ? CASE_STUDIES[cs.next] : null
  const allSlugs = Object.keys(CASE_STUDIES)

  return (
    <main style={{
      background: '#080808', minHeight: '100vh', color: '#f2ede6',
      fontFamily: 'var(--font-inter), Inter, -apple-system, sans-serif',
      WebkitFontSmoothing: 'antialiased',
    }}>

      {/* Fixed header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '16px clamp(24px, 6vw, 80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(8,8,8,0.88), transparent)',
        backdropFilter: 'blur(12px)',
      }}>
        <Link href="/" style={{
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
          color: '#686460', fontSize: 13, letterSpacing: '0.03em',
        }}>
          <span style={{ fontSize: 16, lineHeight: 1, opacity: 0.7 }}>←</span>
          Back to portfolio
        </Link>
        <div style={{ display: 'flex', gap: 6 }}>
          {allSlugs.map(s => (
            <Link key={s} href={`/work/${s}`} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: s === slug ? '#c8a96e' : 'rgba(255,255,255,0.12)',
              display: 'inline-block',
              flexShrink: 0,
            }} />
          ))}
        </div>
      </header>

      {/* Hero */}
      <section style={{
        paddingTop: 'clamp(120px, 18vh, 180px)',
        paddingBottom: 'clamp(48px, 8vh, 96px)',
        paddingLeft: 'clamp(24px, 8vw, 120px)',
        paddingRight: 'clamp(24px, 8vw, 120px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-8%', top: '-15%',
          width: 700, height: 700, borderRadius: '50%',
          background: `radial-gradient(circle, ${cs.accentColor}0a 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <span style={{
            fontSize: 11, color: cs.accentColor,
            border: `1px solid ${cs.accentColor}50`,
            borderRadius: 3, padding: '3px 10px', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{cs.type}</span>
          <span style={{
            fontSize: 11, color: '#484541',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3, padding: '3px 10px', letterSpacing: '0.06em',
          }}>{cs.year}</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(52px, 9vw, 128px)',
          fontFamily: 'var(--font-antonio), Antonio, sans-serif',
          fontWeight: 700, color: '#f2ede6',
          textTransform: 'uppercase', letterSpacing: '0.03em',
          lineHeight: 0.9, marginBottom: 20,
        }}>{cs.title}</h1>

        <p style={{
          fontSize: 'clamp(15px, 1.4vw, 20px)',
          color: '#7a766f', lineHeight: 1.55,
          marginBottom: 48, maxWidth: 560,
        }}>{cs.subtitle}</p>

        <div style={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[
            { label: 'Role', value: cs.role },
            { label: 'Platform', value: cs.platform },
            { label: 'Duration', value: cs.duration },
          ].map(m => (
            <div key={m.label} style={{
              padding: '16px 24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 4, minWidth: 140,
            }}>
              <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</p>
              <p style={{ fontSize: 14, color: '#a09b93', lineHeight: 1.4 }}>{m.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Body */}
      <div style={{ paddingLeft: 'clamp(24px, 8vw, 120px)', paddingRight: 'clamp(24px, 8vw, 120px)' }}>

        {/* Challenge */}
        <section style={{ paddingTop: 80, paddingBottom: 64, borderBottom: '1px solid rgba(255,255,255,0.04)', maxWidth: 840 }}>
          <p style={{ fontSize: 10, color: cs.accentColor, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>The Challenge</p>
          <p style={{ fontSize: 'clamp(17px, 1.8vw, 24px)', color: '#d8d2c8', lineHeight: 1.75, marginBottom: 20 }}>{cs.challenge}</p>
          <p style={{ fontSize: 'clamp(14px, 1.1vw, 16px)', color: '#7a766f', lineHeight: 1.85 }}>{cs.problemContext}</p>
        </section>

        {/* Process coverage */}
        <section style={{ paddingTop: 64, paddingBottom: 64, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontSize: 10, color: cs.accentColor, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 24 }}>Process Coverage</p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 520 }}>
            {PROC_LABELS.map((label, i) => (
              <div key={label} style={{ flex: 1 }}>
                <div style={{
                  height: 5, borderRadius: 3, marginBottom: 10,
                  background: cs.process[i] ? cs.accentColor : '#141414',
                  opacity: cs.process[i] ? 0.75 : 1,
                }} />
                <p style={{ fontSize: 11, color: cs.process[i] ? '#a09b93' : '#2e2e2e', letterSpacing: '0.06em' }}>{label}</p>
              </div>
            ))}
          </div>
          {!cs.process[0] && (
            <p style={{ fontSize: 12, color: '#3a3a3a', marginTop: 12, letterSpacing: '0.04em' }}>
              ↳ Research phase was completed upstream by PM before design engagement
            </p>
          )}
        </section>

        {/* Contributions */}
        <section style={{ paddingTop: 64, paddingBottom: 64, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontSize: 10, color: cs.accentColor, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 40 }}>Contributions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {cs.contributions.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 32, maxWidth: 840 }}>
                <div style={{ flexShrink: 0, paddingTop: 4 }}>
                  <span style={{
                    fontSize: 11, color: cs.accentColor, fontWeight: 700,
                    opacity: 0.6, fontVariantNumeric: 'tabular-nums',
                    display: 'block', minWidth: 24,
                  }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 700, color: '#e8e2d8', marginBottom: 10, lineHeight: 1.3 }}>{c.heading}</h3>
                  <p style={{ fontSize: 'clamp(14px, 1.05vw, 16px)', color: '#7a766f', lineHeight: 1.85 }}>{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outcome */}
        <section style={{ paddingTop: 64, paddingBottom: 80 }}>
          <p style={{ fontSize: 10, color: cs.accentColor, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Outcome</p>
          <div style={{ borderLeft: `2px solid ${cs.accentColor}40`, paddingLeft: 24, marginBottom: 20, maxWidth: 760 }}>
            <p style={{ fontSize: 'clamp(17px, 1.6vw, 22px)', color: '#d8d2c8', lineHeight: 1.7, fontStyle: 'italic' }}>
              &ldquo;{cs.outcome}&rdquo;
            </p>
          </div>
          <p style={{ fontSize: 'clamp(14px, 1.05vw, 16px)', color: '#7a766f', lineHeight: 1.85, maxWidth: 760 }}>{cs.outcomeDetail}</p>
        </section>
      </div>

      {/* Footer nav */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '40px clamp(24px, 8vw, 120px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {prevCs ? (
          <Link href={`/work/${prevCs.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 10, color: '#3a3a3a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>← Previous</span>
            <span style={{ fontSize: 15, color: '#a09b93' }}>{prevCs.title}</span>
          </Link>
        ) : <div />}

        <Link href="/" style={{
          fontSize: 11, color: '#484541', letterSpacing: '0.1em', textTransform: 'uppercase',
          textDecoration: 'none', padding: '8px 22px',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 100,
        }}>All Work</Link>

        {nextCs ? (
          <Link href={`/work/${nextCs.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: '#3a3a3a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Next →</span>
            <span style={{ fontSize: 15, color: '#a09b93' }}>{nextCs.title}</span>
          </Link>
        ) : <div />}
      </footer>
    </main>
  )
}
