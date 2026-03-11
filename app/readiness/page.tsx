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
    title: "Interoperability & Data Profiling",
    body: "We connect to your hospital's sandbox EHR environment and run a containerised data profiler behind your firewall. The interoperability test maps API availability, latency, and schema gaps across your systems. The data profiler — which never moves PHI off your network — analyses completeness, formatting consistency, duplication rates, and the balance of structured vs. free-text data.",
  },
  {
    number: "02",
    title: "Workflow & Process Intelligence",
    body: "We ingest EHR audit logs to map how clinicians actually move through your systems — screen switches per session, time-in-system per patient, and specific delay points. This reveals the real workflow bottlenecks where AI can have the most impact, not the ones your vendor documentation assumes.",
  },
  {
    number: "03",
    title: "Governance & Compliance Mapping",
    body: "A rules-based policy engine evaluates your administrative readiness through structured questionnaires and uploaded policy documents. It flags missing clinical safety protocols, liability gaps, consent framework deficiencies, and privacy workflow issues — scored and mapped to each assessment domain.",
  },
  {
    number: "04",
    title: "Multi-Stakeholder Assessment",
    body: "Role-specific questionnaires for CIO, CMIO, nursing leadership, legal, operations, and department heads. Evidence upload for architecture docs, vendor agreements, and DPIAs. This captures the organisational and people readiness that technical diagnostics can't measure.",
  },
  {
    number: "05",
    title: "Synthesis & Roadmap",
    body: "All four diagnostic modules feed into a single scoring engine that ranks your requested AI use cases by feasibility, calculates a global readiness score, and generates a board-ready report. The output is a prioritised roadmap that prescribes exactly what needs to happen — and in what order — before AI can be deployed.",
  },
] as const;

/* ── Solution data (for "What Happens Next") ─────────────────── */
const SOLUTIONS = [
  {
    diagnosticLabel: "Interoperability Test",
    title: "Core Integration Middleware",
    description:
      "A centralised API and routing layer between legacy hospital systems and new AI applications. When the assessment reveals that EHRs are blocking third-party tools from pulling real-time data or writing back into the system, this acts as the universal translator — unlocking read/write access so AI tools work without latency.",
  },
  {
    diagnosticLabel: "Data Health Profiler",
    title: "Data Standardisation & ETL Pipeline",
    description:
      "A data cleansing and pipeline service that resolves exactly the issues the profiler flags — missing fields, duplicates, unstructured free-text. If a hospital plugs AI into uncleaned data, it hallucinates. This solution structures and normalises their data before any AI deployment.",
  },
  {
    diagnosticLabel: "Workflow Intelligence Analyzer",
    title: "Workflow Orchestration Platform",
    description:
      "A UI and workflow integration engine that embeds AI output directly into the EHR screens clinicians already use. When the assessment shows doctors switching through 15 screens per session, a standalone AI app will be ignored. This takes the AI\u2019s recommendations and places them where they\u2019ll actually be seen and acted on.",
  },
  {
    diagnosticLabel: "Governance Gap Mapper",
    title: "Compliance & Audit Logging Engine",
    description:
      "A secure governance and tracking layer for AI models. When Legal and the CISO block deployment because they can\u2019t track data privacy or clinical liability, this automatically logs patient consent, data provenance, and every time a clinician accepts or overrides an AI recommendation.",
  },
  {
    diagnosticLabel: "Opportunity Prioritizer",
    title: "Managed AI Deployment",
    description:
      "End-to-end deployment of specific, vetted AI applications — ambient scribes, patient flow predictors, clinical communication tools. Once the assessment identifies the exact use case a hospital is ready for, we act as their deployment team to safely roll that tool into production. No in-house data scientists required.",
  },
] as const;

/* ── Flip card data ───────────────────────────────────────────── */
const CARDS = [
  {
    title: "Overall Readiness Score",
    description: "A single composite score across all six assessment domains. Gives leadership one number to understand where the hospital stands — and how far there is to go.",
  },
  {
    title: "Domain-Level Scores",
    description: "Individual scores for strategy, data, governance, workflow, infrastructure, and people. Pinpoints exactly which domains are strong and which are holding back adoption.",
  },
  {
    title: "Use-Case Readiness Scores",
    description: "Scored readiness for specific AI applications — e.g., 'AI discharge summaries: 82/100', 'radiology triage: 54/100'. Shows which use cases are deployable now.",
  },
  {
    title: "Gap Analysis",
    description: "Specific deficiencies mapped to each domain. Not just 'data quality is low' but exactly which data elements are incomplete, from which systems, and what it takes to fix them.",
  },
  {
    title: "Risk Heatmap",
    description: "Visual representation of risk areas across all six domains. Red zones highlight blockers. Amber zones flag areas that need attention before deployment.",
  },
  {
    title: "Priority Roadmap",
    description: "A sequenced plan for reaching AI-readiness, ordered by impact and effort. Phase 1/2/3 structure with timelines, dependencies, and resource estimates.",
  },
  {
    title: "Recommended First 3 Use Cases",
    description: "Based on your specific system landscape, data maturity, and workflow readiness — not generic suggestions. The three AI applications most likely to succeed in your environment.",
  },
  {
    title: "Infrastructure Checklist",
    description: "Technical requirements for deployment, specific to your environment. Covers cloud policy, API readiness, identity management, event streaming, and monitoring.",
  },
  {
    title: "Governance Checklist",
    description: "Policy and compliance requirements before any AI goes live. Consent frameworks, DPIAs, model approval processes, clinical safety sign-off, and audit trails.",
  },
  {
    title: "ROI Opportunity Map",
    description: "Estimated value of closing each identified gap. Maps investment required against projected return — so leadership can prioritise with commercial clarity.",
  },
] as const;

/* ── FlipCard ─────────────────────────────────────────────────── */
function FlipCard({ title, description }: { title: string; description: string }) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    // Only toggle on tap (touch devices that lack hover)
    if (!window.matchMedia("(hover: hover)").matches) {
      setFlipped((f) => !f);
    }
  };

  return (
    <div
      className={`flip-card-container${flipped ? " flipped" : ""}`}
      style={{ perspective: "1000px", height: 260, cursor: "pointer" }}
      onClick={handleClick}
    >
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front">
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: 14,
              color: "#FFFFFF",
              lineHeight: 1.4,
            }}
          >
            {title}
          </span>
        </div>

        {/* Back */}
        <div className="flip-card-back">
          <div className="flip-card-back-inner">
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 500,
                fontSize: 13,
                color: "#FFFFFF",
                marginBottom: 10,
                lineHeight: 1.4,
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: 12,
                color: "#888",
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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

/* ── SolutionBlock ────────────────────────────────────────────── */
function SolutionBlock({
  solution,
  isLast,
  index,
}: {
  solution: (typeof SOLUTIONS)[number];
  isLast: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 0,
        paddingTop: 48,
        paddingBottom: isLast ? 0 : 48,
        borderBottom: isLast ? "none" : "1px solid #1A1A1A",
      }}
      className="solution-block"
    >
      {/* Left: diagnostic link (~30%) */}
      <div style={{ width: "30%", flexShrink: 0, paddingRight: 32, paddingTop: 2 }}>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 10,
            color: "#555",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          When hospitals fail:
        </p>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 13,
            color: "#888",
          }}
        >
          {solution.diagnosticLabel}
        </p>
      </div>

      {/* Right: solution detail (~70%) */}
      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #1A1A1A",
          paddingLeft: 32,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            fontSize: 16,
            color: "#FFFFFF",
            marginBottom: 8,
          }}
        >
          {solution.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: 14,
            color: "#666",
            lineHeight: 1.7,
          }}
        >
          {solution.description}
        </p>
      </div>
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
        paddingBottom: isLast ? 0 : 56,
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

      {/* ── Section 2: What You Get — flip cards ─────────── */}
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

          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: 13,
              color: "#555",
              marginTop: -32,
              marginBottom: 32,
            }}
          >
            Hover to explore each deliverable.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            style={{ gap: 16 }}
          >
            {CARDS.map((card) => (
              <FlipCard
                key={card.title}
                title={card.title}
                description={card.description}
              />
            ))}
          </motion.div>
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

      {/* ── Section 4: What Happens Next ─────────────────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 96, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{ ...H2, borderTop: "1px solid #1A1A1A", paddingTop: 48, marginBottom: 8 }}
          >
            What Happens Next
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: 14,
              color: "#666",
              marginBottom: 48,
            }}
          >
            The assessment tells you where you stand. These are the solutions that close the gaps.
          </motion.p>

          <div>
            {SOLUTIONS.map((solution, i) => (
              <SolutionBlock
                key={solution.title}
                solution={solution}
                isLast={i === SOLUTIONS.length - 1}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Not a Checklist ────────────────────── */}
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

      {/* ── Section 6: CTA ───────────────────────────────── */}
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
