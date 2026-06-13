'use client'

import Link from 'next/link'

export default function ResumePage() {
  return (
    <>
      {/* Screen toolbar — hidden on print */}
      <div className="resume-toolbar">
        <Link href="/" className="resume-back">← Back to portfolio</Link>
        <button className="resume-print-btn" onClick={() => window.print()}>
          Download PDF
        </button>
      </div>

      {/* Resume sheet */}
      <div className="resume-sheet">

        {/* ── Header ── */}
        <header className="resume-header">
          <div>
            <h1 className="resume-name">Kishan Patel</h1>
            <p className="resume-role">UI/UX Designer</p>
          </div>
          <div className="resume-contact">
            <a href="mailto:kishanpatel4999@gmail.com">kishanpatel4999@gmail.com</a>
            <span>+91 7096855325</span>
            <a href="https://kishanp.com" target="_blank" rel="noopener noreferrer">kishanp.com</a>
            <a href="https://www.linkedin.com/in/kishanspatel49/" target="_blank" rel="noopener noreferrer">linkedin.com/in/kishanspatel49</a>
            <a href="https://www.behance.net/kishanspatel" target="_blank" rel="noopener noreferrer">behance.net/kishanspatel</a>
            <a href="https://dribbble.com/kishanspatel" target="_blank" rel="noopener noreferrer">dribbble.com/kishanspatel</a>
            <span>Ahmedabad, Gujarat, India</span>
          </div>
        </header>

        <div className="resume-rule" />

        {/* ── Summary ── */}
        <section className="resume-section">
          <h2 className="resume-section-title">Professional Summary</h2>
          <p className="resume-body">
            UI/UX Designer with a computer science background and 4+ years of experience designing enterprise
            software products. Skilled in Figma, Adobe XD, Photoshop, and Illustrator, with strengths across user
            research, wireframing, design systems, and end-to-end product design. Comfortable using AI tools to
            accelerate UI design and skilled at creating custom icons and vector graphics.
          </p>
        </section>

        <div className="resume-rule" />

        {/* ── Experience ── */}
        <section className="resume-section">
          <h2 className="resume-section-title">Experience</h2>

          {/* AI Mindarray */}
          <div className="resume-job">
            <div className="resume-job-header">
              <div>
                <p className="resume-job-title">UX Designer</p>
                <p className="resume-job-company">AI Mindarray Systems Pvt. Ltd. · Ahmedabad, Gujarat, India</p>
              </div>
              <p className="resume-job-period">Jul 2022 — Present</p>
            </div>
            <ul className="resume-bullets">
              <li>Product designer for <strong>Motadata ObserveOps</strong>, an IT infrastructure monitoring platform spanning network discovery, metric analysis, log management, APM, and RUM features.</li>
              <li>Designed the complete <strong>RUM (Real User Monitoring)</strong> module end to end, from research to final UI.</li>
              <li>Designed the <strong>NCM module</strong> and <strong>APM Compare</strong> feature, ensuring alert correlation across modules.</li>
              <li>Redesigned key modules including <strong>Metric Explorer, Log Explorer, Flow Explorer, Trap Explorer, Topology, Global Filter/Search,</strong> and the customizable <strong>Dashboard</strong> (Add Widget / Create Dashboard).</li>
              <li>Designed <strong>License and Settings</strong> modules, Trap Report, NCM Compliance, and NetRoute card view.</li>
              <li>Built and maintained the <strong>Figma design system</strong>, including components, tokens, typography, and motion guidelines.</li>
              <li>Owned the full design process: feature research, documentation, UX flow planning, wireframing, and final high-fidelity Figma designs.</li>
            </ul>
          </div>
        </section>

        <div className="resume-rule" />

        {/* ── Education ── */}
        <section className="resume-section">
          <h2 className="resume-section-title">Education</h2>
          <div className="resume-edu-grid">
            <div className="resume-job-header">
              <div>
                <p className="resume-job-title">M.Sc. — Computer Application &amp; IT</p>
                <p className="resume-job-company">K.S. School of Business Management, Gujarat University</p>
              </div>
              <p className="resume-job-period">2020 — 2022</p>
            </div>
            <div className="resume-job-header">
              <div>
                <p className="resume-job-title">B.Sc. — Computer Application &amp; IT</p>
                <p className="resume-job-company">K.S. School of Business Management, Gujarat University</p>
              </div>
              <p className="resume-job-period">2017 — 2020</p>
            </div>
            <div className="resume-job-header">
              <div>
                <p className="resume-job-title">Higher Secondary (Class 12)</p>
                <p className="resume-job-company">Super Higher Secondary School, GHSEB</p>
              </div>
              <p className="resume-job-period">2017</p>
            </div>
            <div className="resume-job-header">
              <div>
                <p className="resume-job-title">Secondary (Class 10)</p>
                <p className="resume-job-company">Hosanna Mission High School, GSEB</p>
              </div>
              <p className="resume-job-period">2015</p>
            </div>
          </div>
        </section>

        <div className="resume-rule" />

        {/* ── Skills ── */}
        <section className="resume-section">
          <h2 className="resume-section-title">Skills</h2>
          <div className="resume-skills-grid">
            <div className="resume-skill-row">
              <span className="resume-skill-label">Design</span>
              <span className="resume-skill-value">Product Design · Web Design · Mobile Design · User Experience (UX) · User Interface (UI) · Wireframing · Prototyping · Usability Testing · Design Systems · Interaction Design · Visual Design · Iconography</span>
            </div>
            <div className="resume-skill-row">
              <span className="resume-skill-label">Research</span>
              <span className="resume-skill-value">User Research · Feature Research · UX Documentation · UX Flow Planning</span>
            </div>
            <div className="resume-skill-row">
              <span className="resume-skill-label">Tools</span>
              <span className="resume-skill-value">Figma · Adobe XD · Adobe Photoshop · Adobe Illustrator · Adobe After Effects</span>
            </div>
          </div>
        </section>

        <div className="resume-rule" />

        {/* ── Certifications ── */}
        <section className="resume-section">
          <h2 className="resume-section-title">Certifications</h2>
          <div className="resume-cert-grid">
            <div className="resume-cert-row">
              <span className="resume-cert-name">UX Fundamentals: Practical Usability for Product Design</span>
              <span className="resume-cert-meta">Udemy, 2022</span>
            </div>
            <div className="resume-cert-row">
              <span className="resume-cert-name">UX Design &amp; User Experience Design Course (Theory)</span>
              <span className="resume-cert-meta">Udemy, 2023</span>
            </div>
            <div className="resume-cert-row">
              <span className="resume-cert-name">Figma UI/UX Design Essentials</span>
              <span className="resume-cert-meta">Udemy, 2024</span>
            </div>
            <div className="resume-cert-row">
              <span className="resume-cert-name">UX &amp; Design Thinking Quick Start</span>
              <span className="resume-cert-meta">Udemy, 2025</span>
            </div>
          </div>
        </section>

        <div className="resume-rule" />

        {/* ── Languages ── */}
        <section className="resume-section resume-portfolio-row">
          <h2 className="resume-section-title">Languages</h2>
          <div className="resume-portfolio-links">
            <span>English (Native)</span>
            <span>Gujarati (Native)</span>
            <span>Hindi (Native)</span>
          </div>
        </section>

      </div>

      <style>{`
        /* ── Screen styles ── */
        body { margin: 0; background: #080808; }

        .resume-toolbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          padding: 14px 40px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-family: Inter, -apple-system, sans-serif;
        }
        .resume-back {
          font-size: 13px; color: #585450; text-decoration: none; letter-spacing: 0.03em;
        }
        .resume-back:hover { color: #a09b93; }
        .resume-print-btn {
          font-size: 12px; color: #c8a96e; letter-spacing: 0.08em;
          background: rgba(200,169,110,0.08);
          border: 1px solid rgba(200,169,110,0.3);
          border-radius: 100px; padding: 7px 20px;
          cursor: pointer; font-family: inherit;
          transition: border-color 0.2s, background 0.2s;
        }
        .resume-print-btn:hover {
          border-color: rgba(200,169,110,0.6);
          background: rgba(200,169,110,0.14);
        }

        /* ── Sheet ── */
        .resume-sheet {
          max-width: 820px;
          margin: 0 auto;
          margin-top: 72px;
          margin-bottom: 80px;
          background: #0d0d0d;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          padding: 56px 64px;
          font-family: Inter, -apple-system, sans-serif;
          color: #d8d2c8;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Header ── */
        .resume-header {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;
          margin-bottom: 28px;
        }
        .resume-name {
          font-family: var(--font-antonio, 'Antonio', sans-serif);
          font-size: 44px; font-weight: 700; color: #f2ede6;
          letter-spacing: 0.04em; text-transform: uppercase;
          line-height: 0.95; margin: 0 0 8px;
        }
        .resume-role {
          font-size: 13px; color: #c8a96e; letter-spacing: 0.12em;
          text-transform: uppercase; margin: 0;
        }
        .resume-contact {
          display: flex; flex-direction: column; align-items: flex-end; gap: 5px;
          flex-shrink: 0;
        }
        .resume-contact a, .resume-contact span {
          font-size: 12px; color: #686460; letter-spacing: 0.03em;
          text-decoration: none;
        }
        .resume-contact a:hover { color: #c8a96e; }

        /* ── Rule ── */
        .resume-rule {
          height: 1px; background: rgba(255,255,255,0.07); margin: 24px 0;
        }

        /* ── Sections ── */
        .resume-section { margin: 0; }
        .resume-section-title {
          font-size: 9px; font-weight: 700; color: #c8a96e;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin: 0 0 16px;
        }
        .resume-body {
          font-size: 13px; color: #7a766f; line-height: 1.85; margin: 0;
        }
        .resume-body strong { color: #a09b93; font-weight: 600; }

        /* ── Jobs ── */
        .resume-job-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 16px; margin-bottom: 10px;
        }
        .resume-job-title {
          font-size: 15px; font-weight: 700; color: #e8e2d8;
          letter-spacing: 0.01em; margin: 0 0 3px;
        }
        .resume-job-company {
          font-size: 12px; color: #585450; letter-spacing: 0.03em; margin: 0;
        }
        .resume-job-period {
          font-size: 11px; color: #383432; letter-spacing: 0.06em;
          white-space: nowrap; padding-top: 2px; margin: 0;
        }
        .resume-bullets {
          margin: 0; padding: 0 0 0 0; list-style: none;
          display: flex; flex-direction: column; gap: 7px;
        }
        .resume-bullets li {
          font-size: 12.5px; color: #686460; line-height: 1.75;
          padding-left: 16px; position: relative;
        }
        .resume-bullets li::before {
          content: '—'; position: absolute; left: 0; color: #2e2e2e;
          font-size: 11px;
        }
        .resume-bullets li strong { color: #908a84; font-weight: 600; }

        /* ── Skills ── */
        .resume-skills-grid { display: flex; flex-direction: column; gap: 9px; }
        .resume-skill-row { display: flex; gap: 16px; }
        .resume-skill-label {
          font-size: 11px; color: #484541; letter-spacing: 0.07em;
          width: 130px; flex-shrink: 0; padding-top: 1px;
        }
        .resume-skill-value {
          font-size: 12.5px; color: #686460; line-height: 1.65;
        }

        /* ── Education grid ── */
        .resume-edu-grid { display: flex; flex-direction: column; gap: 14px; }

        /* ── Certifications ── */
        .resume-cert-grid { display: flex; flex-direction: column; gap: 8px; }
        .resume-cert-row { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
        .resume-cert-name { font-size: 12.5px; color: #686460; line-height: 1.6; }
        .resume-cert-meta { font-size: 11px; color: #383432; white-space: nowrap; letter-spacing: 0.04em; }

        /* ── Portfolio / Languages row ── */
        .resume-portfolio-row { display: flex; align-items: baseline; gap: 32px; }
        .resume-portfolio-row .resume-section-title { margin-bottom: 0; white-space: nowrap; }
        .resume-portfolio-links { display: flex; gap: 20px; flex-wrap: wrap; }
        .resume-portfolio-links a, .resume-portfolio-links span {
          font-size: 13px; color: #686460; text-decoration: none; letter-spacing: 0.03em;
        }
        .resume-portfolio-links a:hover { color: #c8a96e; }

        /* ── Print styles ── */
        @media print {
          @page { size: A4; margin: 18mm 20mm; }

          body { background: #fff !important; }

          .resume-toolbar { display: none !important; }

          .resume-sheet {
            max-width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            border: none !important;
            border-radius: 0 !important;
            color: #111 !important;
          }

          .resume-name { color: #000 !important; font-size: 34px !important; }
          .resume-role { color: #555 !important; }
          .resume-contact a, .resume-contact span { color: #444 !important; }
          .resume-rule { background: #ddd !important; }
          .resume-section-title { color: #555 !important; }
          .resume-body { color: #333 !important; }
          .resume-body strong { color: #111 !important; }
          .resume-job-title { color: #000 !important; }
          .resume-job-company { color: #444 !important; }
          .resume-job-period { color: #666 !important; }
          .resume-bullets li { color: #333 !important; }
          .resume-bullets li::before { color: #aaa !important; }
          .resume-bullets li strong { color: #111 !important; }
          .resume-skill-label { color: #555 !important; }
          .resume-skill-value { color: #333 !important; }
          .resume-portfolio-links a, .resume-portfolio-links span { color: #444 !important; }
          .resume-cert-name { color: #333 !important; }
          .resume-cert-meta { color: #666 !important; }
        }
      `}</style>
    </>
  )
}
