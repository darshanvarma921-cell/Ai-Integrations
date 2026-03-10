"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";

/* ── Shared layout ────────────────────────────────────────────── */
const BG = "#08080D";
const INNER: React.CSSProperties = {
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 48,
  paddingRight: 48,
};
const H2: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 400,
  fontSize: 28,
  color: "#FFFFFF",
  letterSpacing: "-0.01em",
  marginBottom: 48,
};

/* ── Domain data (for bento grid) ─────────────────────────────── */
const DOMAINS = [
  {
    title: "Strategy & Use-Case Readiness",
    body: "Does the hospital have clear priority problems worth solving with AI? We assess whether each potential use case has a clear owner, measurable outcomes, baseline KPIs, acceptable risk levels, and sufficient workflow volume.",
    span: 1,
  },
  {
    title: "Data Readiness",
    body: "Usually the biggest blocker. We evaluate what systems exist, interoperability levels, data quality — completeness, duplicates, timestamp integrity — structure, representativeness, and access models.",
    span: 2,
  },
  {
    title: "Governance & Compliance",
    body: "Consent and lawful basis for data use, privacy and auditability, model approval processes, clinical safety sign-off, human oversight, and monitoring for drift and bias.",
    span: 2,
  },
  {
    title: "Workflow & Operational",
    body: "Where in the workflow AI output appears, who acts on it, staff trust, process standardisation, and fallback procedures.",
    span: 1,
  },
  {
    title: "Technical Infrastructure",
    body: "Cloud policy, identity management, API capabilities, data lake maturity, model hosting, monitoring, and device integration.",
    span: 1,
  },
  {
    title: "People & Organisation",
    body: "Executive sponsorship, IT buy-in, clinical champions, legal capacity, analytics maturity, AI literacy, and change management readiness.",
    span: 2,
  },
] as const;

/* ── Step data (for timeline) ─────────────────────────────────── */
const STEPS = [
  {
    number: "01",
    title: "Multi-Stakeholder Assessment",
    body: "Role-specific questionnaires for CIO, CMIO, nursing leadership, legal, operations, and department heads. Evidence upload for policies, architecture docs, and vendor agreements.",
  },
  {
    number: "02",
    title: "Scoring & Analysis",
    body: "Weighted maturity models across all six domains. Specialty-specific scoring templates. Automated extraction of readiness evidence from uploaded documents.",
  },
  {
    number: "03",
    title: "Report & Roadmap",
    body: "Board-ready report with scores, gaps, risks, and a prioritised implementation sequence. Benchmark against peer hospitals. Recommended use cases matched to your readiness profile.",
  },
] as const;

/* ── Deliverables data ────────────────────────────────────────── */
const DELIVERABLES = [
  { name: "Overall Readiness Score", desc: "Single composite score across all six domains." },
  { name: "Domain-Level Scores", desc: "Strategy, data, governance, workflow, infrastructure, people." },
  { name: "Use-Case Readiness Scores", desc: "e.g. \"AI discharge summaries: 82/100\", \"radiology triage: 54/100\"." },
  { name: "Gap Analysis", desc: "Specific deficiencies mapped to each domain." },
  { name: "Risk Heatmap", desc: "Visual representation of risk areas across the six domains." },
  { name: "Priority Roadmap", desc: "Sequenced plan for reaching AI-readiness, ordered by impact and effort." },
  { name: "Recommended First 3 Use Cases", desc: "Based on your specific system landscape and readiness profile." },
  { name: "Infrastructure Checklist", desc: "Technical requirements for deployment, specific to your environment." },
  { name: "Governance Checklist", desc: "Policy and compliance requirements before any AI goes live." },
  { name: "ROI Opportunity Map", desc: "Estimated value of closing each identified gap." },
] as const;

/* ── BentoCell ────────────────────────────────────────────────── */
function BentoCell({
  title,
  body,
  className = "",
  delay = 0,
}: {
  title: string;
  body: string;
  className?: string;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "#2A2A2A" : "#1A1A1A"}`,
        background: "transparent",
        padding: 32,
        transition: "border-color 0.3s",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 500,
          fontSize: 15,
          color: "#FFFFFF",
          marginBottom: 12,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 300,
          fontSize: 13,
          color: "#666",
          lineHeight: 1.6,
        }}
      >
        {body}
      </p>
    </motion.div>
  );
}

/* ── TimelineStep ─────────────────────────────────────────────── */
function TimelineStep({
  step,
  isLast,
}: {
  step: (typeof STEPS)[number];
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "flex-start",
        paddingBottom: isLast ? 0 : 72,
      }}
    >
      {/* Left column: node + connecting line */}
      <div
        style={{
          width: 40,
          flexShrink: 0,
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        {/* Node dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            border: `1px solid ${isInView ? "#10B981" : "#333"}`,
            background: isInView ? "#10B981" : "transparent",
            transition: "background 0.5s 0.15s, border-color 0.5s 0.15s",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        />
        {/* Vertical connector to next step */}
        {!isLast && (
          <div
            style={{
              flex: 1,
              width: 1,
              background: "#1A1A1A",
              marginTop: 10,
            }}
          />
        )}
      </div>

      {/* Horizontal connector line */}
      <div
        style={{
          width: 32,
          height: 1,
          background: "#1A1A1A",
          marginTop: 23,
          flexShrink: 0,
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          flex: 1,
          borderLeft: "1px solid #1A1A1A",
          paddingLeft: 24,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 200,
            fontSize: 48,
            color: "#222",
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          {step.number}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            fontSize: 16,
            color: "#FFFFFF",
            marginBottom: 10,
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: 14,
            color: "#666",
            lineHeight: 1.7,
            maxWidth: 520,
          }}
        >
          {step.body}
        </p>
      </motion.div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ReadinessPage() {
  return (
    <main style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section style={{ ...INNER, paddingTop: 152, paddingBottom: 96 }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            marginBottom: 24,
            maxWidth: 720,
          }}
        >
          AI Readiness Assessment
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: 17,
            color: "#777",
            lineHeight: 1.7,
            maxWidth: 600,
          }}
        >
          A structured, evidence-based evaluation of your hospital&rsquo;s
          readiness to adopt AI — across systems, data, governance, workflows,
          infrastructure, and people.
        </motion.p>
      </section>

      {/* ── Section 1: Six Domains — bento grid ─────────── */}
      <section style={{ borderTop: "1px solid #1A1A1A", background: BG }}>
        <div style={{ ...INNER, paddingTop: 64, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={H2}
          >
            Six Domains of Readiness
          </motion.h2>

          {/* Bento grid — 3 cols desktop, 1 col mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {DOMAINS.map((d, i) => (
              <BentoCell
                key={d.title}
                title={d.title}
                body={d.body}
                className={d.span === 2 ? "sm:col-span-2" : "sm:col-span-1"}
                delay={(i % 3) * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: What You Get ──────────────────────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 96, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={H2}
          >
            What You Get
          </motion.h2>

          <div style={{ maxWidth: 800 }}>
            {DELIVERABLES.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                style={{
                  borderTop: "1px solid #1A1A1A",
                  paddingTop: 18,
                  paddingBottom: 18,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#FFFFFF",
                  }}
                >
                  {item.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "#666",
                  }}
                >
                  — {item.desc}
                </span>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid #1A1A1A" }} />
          </div>
        </div>
      </section>

      {/* ── Section 3: How It Works — timeline ───────────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 96, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{ ...H2, borderTop: "1px solid #1A1A1A", paddingTop: 48 }}
          >
            How It Works
          </motion.h2>

          <div style={{ maxWidth: 680 }}>
            {STEPS.map((step, i) => (
              <TimelineStep
                key={step.number}
                step={step}
                isLast={i === STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Not a Checklist ────────────────────── */}
      <section style={{ background: BG }}>
        <div
          style={{
            ...INNER,
            paddingTop: 96,
            paddingBottom: 96,
            maxWidth: 800,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: 18,
              color: "#888",
              lineHeight: 1.7,
            }}
          >
            Most readiness assessments are self-reported questionnaires in a nice
            UI. Ours is evidence-backed, system-aware, and commercially useful. It
            maps your actual infrastructure, identifies your highest-value use
            cases, and creates the pipeline for integration — not just a score, but
            a blueprint.
          </motion.p>
        </div>
      </section>

      {/* ── Section 5: CTA ───────────────────────────────── */}
      <section style={{ background: BG }}>
        <div
          style={{
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 96,
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: 18,
                color: "#777",
                lineHeight: 1.7,
              }}
            >
              Find out where your hospital stands.
            </p>
            <a
              href="#"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 400,
                fontSize: 15,
                color: "#FFFFFF",
                textDecoration: "none",
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Book an Assessment
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid #1A1A1A",
          paddingTop: 64,
          paddingBottom: 64,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 11,
            color: "#444",
          }}
        >
          &copy; 2025 Adopt AI
        </p>
      </footer>
    </main>
  );
}
