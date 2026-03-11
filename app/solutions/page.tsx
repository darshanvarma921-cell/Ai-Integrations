"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import Link from "next/link";

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

/* ── Stack layer data ─────────────────────────────────────────── */
const STACK_LAYERS = [
  {
    number: 1,
    name: "Core Integration Middleware",
    tagline: "Makes systems talk",
    expansion:
      "API gateway, HL7/FHIR/DICOM adapters, custom legacy connectors, patient identity matching, real-time event routing, and monitoring\u2009\u2014\u2009so AI can pull and push data inside the systems clinicians already use.",
    slug: "/solutions/core-integration-middleware",
  },
  {
    number: 2,
    name: "Data Standardisation & ETL",
    tagline: "Makes data usable",
    expansion:
      "Source extraction, deduplication, terminology normalisation (SNOMED, ICD, LOINC), NLP for unstructured notes, master patient index, and continuous data refresh\u2009\u2014\u2009so AI runs on clean, reliable inputs.",
    slug: "/solutions/data-standardisation-etl",
  },
  {
    number: 3,
    name: "Workflow Orchestration",
    tagline: "Makes AI adoptable",
    expansion:
      "UI embedding, rules-based routing, role-based task assignment, contextual alerts inside existing systems, EHR-triggered actions, and adoption analytics\u2009\u2014\u2009so AI output reaches the right person at the right time.",
    slug: "/solutions/workflow-orchestration-platform",
  },
  {
    number: 4,
    name: "Compliance & Audit Logging",
    tagline: "Makes AI governable",
    expansion:
      "Model I/O logging, data provenance, consent tracking, version control, override records, audit-ready reports, and explainability metadata\u2009\u2014\u2009so legal, IG, and risk teams can say yes.",
    slug: "/solutions/compliance-audit-logging",
  },
  {
    number: 5,
    name: "Managed AI Deployment",
    tagline: "Makes AI launch",
    expansion:
      "Readiness assessment, use-case prioritisation, integration setup, workflow design, compliance coordination, training, pilot design, go-live support, and post-launch optimisation\u2009\u2014\u2009so the hospital doesn\u2019t need an internal AI ops team.",
    slug: "/solutions/managed-ai-deployment",
  },
] as const;

/* ── Timeline step data ───────────────────────────────────────── */
const DEPLOYMENT_STEPS = [
  {
    number: "01",
    label: "Connect",
    body: "Integration middleware identifies the patient and encounter, connects the scribe to the EHR, and opens a bidirectional data pipeline. No new vendor integration project\u2009\u2014\u2009the connector layer already exists.",
  },
  {
    number: "02",
    label: "Prepare",
    body: "Data standardisation ensures the patient\u2019s history, medications, allergies, and prior notes are clean, correctly coded, and chronologically aligned before the AI touches them.",
  },
  {
    number: "03",
    label: "Embed",
    body: "Workflow orchestration places the AI-generated draft note inside the clinician\u2019s existing charting flow\u2009\u2014\u2009right patient, right encounter, ready for review and sign-off. No new login. No separate screen.",
  },
  {
    number: "04",
    label: "Govern",
    body: "The compliance engine logs which model version produced the note, what data it used, whether the clinician edited or accepted it, and maintains a full audit trail\u2009\u2014\u2009reconstructable at any point.",
  },
  {
    number: "05",
    label: "Deliver",
    body: "Managed deployment handled the readiness assessment, EHR integration, department pilot, staff training, success metrics, and optimisation before wider rollout. One accountable party. Not just software access\u2009\u2014\u2009operational value.",
  },
] as const;

/* ── Engagement entry data ────────────────────────────────────── */
const ENTRIES = [
  {
    title: "First Use Case",
    body: "You have a specific AI tool to deploy\u2009\u2014\u2009a scribe, a triage model, a discharge predictor. We handle end-to-end rollout: integration, data prep, workflow embedding, compliance, training, and go-live. Fixed scope. Defined outcome.",
  },
  {
    title: "Platform Foundation",
    body: "You want to build the infrastructure once and deploy AI tools on top of it repeatedly. We implement the integration and data layers, establish governance, and create a reusable deployment framework. Every subsequent AI module connects faster.",
  },
  {
    title: "Full Readiness Engagement",
    body: "You\u2019re not sure where to start. We run an evidence-based assessment across six domains, identify the highest-value use cases matched to your actual readiness, and build the roadmap. Then we execute it.",
  },
] as const;

/* ── StackLayer component ─────────────────────────────────────── */
function StackLayer({
  layer,
  index,
}: {
  layer: (typeof STACK_LAYERS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      onClick={() => setExpanded((e) => !e)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          background: "#111118",
          border: "1px solid #1A1A1A",
          borderLeft: expanded
            ? "2px solid #00D4AA"
            : "2px solid transparent",
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: expanded
            ? "inset 4px 0 16px -8px rgba(0, 212, 170, 0.15)"
            : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#2A2A2A";
          if (!expanded)
            e.currentTarget.style.borderLeftColor = "rgba(0, 212, 170, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#1A1A1A";
          if (!expanded)
            e.currentTarget.style.borderLeftColor = "transparent";
        }}
      >
        {/* Layer number */}
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            fontSize: 13,
            color: "#00D4AA",
            minWidth: 32,
            flexShrink: 0,
          }}
        >
          L{layer.number}
        </span>

        {/* Name */}
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            fontSize: 15,
            color: "#FFFFFF",
            flex: 1,
          }}
        >
          {layer.name}
        </span>

        {/* Tagline */}
        <span
          className="hidden sm:inline"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: 13,
            color: "#555",
            flexShrink: 0,
          }}
        >
          {layer.tagline}
        </span>

        {/* Expand indicator */}
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 14,
            color: "#444",
            transition: "transform 0.25s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          &#9662;
        </span>
      </div>

      {/* Expansion panel */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: expanded ? 200 : 0,
          transition: "max-height 0.35s ease",
        }}
      >
        <div
          style={{
            padding: "20px 28px 20px 84px",
            background: "rgba(17, 17, 24, 0.5)",
            borderLeft: "2px solid rgba(0, 212, 170, 0.15)",
            borderBottom: "1px solid #1A1A1A",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: 13,
              color: "#777",
              lineHeight: 1.7,
              maxWidth: 640,
              marginBottom: 12,
            }}
          >
            {layer.expansion}
          </p>
          <Link
            href={layer.slug}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: 12,
              color: "#00D4AA",
              textDecoration: "none",
              opacity: 0.7,
              transition: "opacity 0.25s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            onClick={(e) => e.stopPropagation()}
          >
            Learn more →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ── DeploymentStep component ─────────────────────────────────── */
function DeploymentStep({
  step,
  isLast,
}: {
  step: (typeof DEPLOYMENT_STEPS)[number];
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
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            border: `1px solid ${isInView ? "#00D4AA" : "#333"}`,
            background: isInView ? "#00D4AA" : "transparent",
            transition: "background 0.5s 0.15s, border-color 0.5s 0.15s",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        />
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

      {/* Horizontal connector */}
      <div
        style={{
          width: 32,
          height: 1,
          background: "#1A1A1A",
          marginTop: 23,
          flexShrink: 0,
        }}
      />

      {/* Content */}
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
          {step.label}
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
export default function SolutionsPage() {
  return (
    <main style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />

      {/* ── Section 1: Hero ────────────────────────────────── */}
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
          The Infrastructure That Makes Hospital{" "}
          <span
            style={{
              borderBottom: "1px solid rgba(0, 212, 170, 0.4)",
              paddingBottom: 2,
            }}
          >
            AI Work
          </span>
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
            marginBottom: 40,
          }}
        >
          Five integrated layers&thinsp;&mdash;&thinsp;from system connectivity
          to managed deployment&thinsp;&mdash;&thinsp;that take AI from pilot to
          production. Not another AI product. The operating layer that makes
          every AI product deliverable.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Link
            href="/demo"
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
          </Link>
        </motion.div>
      </section>

      {/* ── Section 2: The Stack ───────────────────────────── */}
      <section style={{ borderTop: "1px solid #1A1A1A", background: BG }}>
        <div style={{ ...INNER, paddingTop: 64, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={H2}
          >
            The Stack
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
              color: "#555",
              marginTop: -32,
              marginBottom: 48,
              maxWidth: 540,
            }}
          >
            Each layer depends on the one below it. Together they form a
            complete operating environment for hospital AI.
          </motion.p>

          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              gap: 0,
            }}
          >
            {STACK_LAYERS.map((layer, i) => (
              <StackLayer key={layer.number} layer={layer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: A Deployment, End to End ────────────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 96, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{ ...H2, borderTop: "1px solid #1A1A1A", paddingTop: 48 }}
          >
            A Deployment, End to End
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
              color: "#555",
              marginTop: -32,
              marginBottom: 48,
              maxWidth: 540,
            }}
          >
            Here&rsquo;s what a real deployment looks like when every layer is
            in place&thinsp;&mdash;&thinsp;an ambient AI scribe, from connection
            to go-live.
          </motion.p>

          <div style={{ maxWidth: 680 }}>
            {DEPLOYMENT_STEPS.map((step, i) => (
              <DeploymentStep
                key={step.number}
                step={step}
                isLast={i === DEPLOYMENT_STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: How Hospitals Engage ────────────────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 96, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{ ...H2, borderTop: "1px solid #1A1A1A", paddingTop: 48 }}
          >
            How Hospitals Engage
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
              color: "#555",
              marginTop: -32,
              marginBottom: 48,
              maxWidth: 540,
            }}
          >
            There&rsquo;s no single way in. Start where the need is sharpest.
          </motion.p>

          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: 0 }}
          >
            {ENTRIES.map((entry, i) => (
              <motion.div
                key={entry.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  borderTop: "2px solid #00D4AA",
                  padding: "28px 28px 28px 0",
                  paddingRight: i < 2 ? 28 : 0,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: 15,
                    color: "#FFFFFF",
                    marginBottom: 14,
                  }}
                >
                  {entry.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: 13,
                    color: "#666",
                    lineHeight: 1.7,
                  }}
                >
                  {entry.body}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: 14,
              color: "#555",
              marginTop: 48,
              maxWidth: 600,
            }}
          >
            Every engagement builds toward the same outcome: a hospital where AI
            deploys in weeks, not years.
          </motion.p>
        </div>
      </section>

      {/* ── Section 5: CTA ─────────────────────────────────── */}
      <section style={{ background: BG }}>
        <div
          style={{
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 48,
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
              gap: 16,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 400,
                fontSize: 28,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                marginBottom: 8,
              }}
            >
              See Where You Stand
            </h2>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: 15,
                color: "#777",
                lineHeight: 1.7,
                marginBottom: 16,
                maxWidth: 480,
              }}
            >
              Book an assessment. We&rsquo;ll map your systems, score your
              readiness, and show you the fastest path to operational AI.
            </p>
            <Link
              href="/demo"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 500,
                fontSize: 14,
                color: "#08080D",
                background: "#00D4AA",
                textDecoration: "none",
                padding: "12px 32px",
                borderRadius: 4,
                transition: "opacity 0.3s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Book an Assessment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
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
