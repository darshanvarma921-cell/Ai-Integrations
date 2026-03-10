"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";

/* ── Data ─────────────────────────────────────────────────────── */
const DOMAINS = [
  {
    title: "Strategy & Use-Case Readiness",
    body: "Does the hospital have clear priority problems worth solving with AI? We assess whether each potential use case has a clear owner, measurable outcomes, baseline KPIs, acceptable risk levels, and sufficient workflow volume to justify deployment.",
  },
  {
    title: "Data Readiness",
    body: "Usually the biggest blocker. We evaluate what systems exist, interoperability levels, data quality — completeness, duplicates, timestamp integrity — structure, representativeness, bias risks, and access models.",
  },
  {
    title: "Governance & Compliance",
    body: "In healthcare, governance isn't a side section. We assess consent and lawful basis for data use, privacy and auditability, model approval processes, clinical safety sign-off, human oversight, and monitoring for drift and bias.",
  },
  {
    title: "Workflow & Operational Readiness",
    body: "A hospital may have data and budget but still be unready because the workflow is wrong. We check where AI output appears, who acts on it, response time expectations, staff trust, process standardisation, and fallback procedures.",
  },
  {
    title: "Technical & Infrastructure Readiness",
    body: "Cloud policy, identity management, API capabilities, event streaming, data lake maturity, model hosting options, logging, monitoring, disaster recovery, network segmentation, and device integration capability.",
  },
  {
    title: "People & Organisational Readiness",
    body: "Executive sponsorship, IT buy-in, clinical champion availability, legal and information governance capacity, analytics maturity, AI literacy among end users, and ability to run pilots and change management.",
  },
] as const;

const DELIVERABLES = [
  {
    name: "Overall Readiness Score",
    desc: "Single composite score across all six domains.",
  },
  {
    name: "Domain-Level Scores",
    desc: "Strategy, data, governance, workflow, infrastructure, people.",
  },
  {
    name: "Use-Case Readiness Scores",
    desc: "e.g. \"AI discharge summaries: 82/100\", \"radiology triage: 54/100\".",
  },
  {
    name: "Gap Analysis",
    desc: "Specific deficiencies mapped to each domain.",
  },
  {
    name: "Risk Heatmap",
    desc: "Visual representation of risk areas across the six domains.",
  },
  {
    name: "Priority Roadmap",
    desc: "Sequenced plan for reaching AI-readiness, ordered by impact and effort.",
  },
  {
    name: "Recommended First 3 Use Cases",
    desc: "Based on your specific system landscape and readiness profile.",
  },
  {
    name: "Infrastructure Checklist",
    desc: "Technical requirements for deployment, specific to your environment.",
  },
  {
    name: "Governance Checklist",
    desc: "Policy and compliance requirements before any AI goes live.",
  },
  {
    name: "ROI Opportunity Map",
    desc: "Estimated value of closing each identified gap.",
  },
] as const;

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

/* ── Animation ────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08 },
  }),
};

/* ── Shared layout ────────────────────────────────────────────── */
const BG = "#08080D";
const INNER = {
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 48,
  paddingRight: 48,
};
const H2 = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 400,
  fontSize: 28,
  color: "#FFFFFF",
  letterSpacing: "-0.01em",
  marginBottom: 48,
};

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

      {/* ── Section 1: Six Domains ───────────────────────── */}
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

          <div className="grid sm:grid-cols-2" style={{ gap: "0 80px" }}>
            {DOMAINS.map((domain, i) => (
              <motion.div
                key={domain.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                style={{
                  borderTop: "1px solid #1A1A1A",
                  paddingTop: 28,
                  paddingBottom: 28,
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
                  {domain.title}
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
                  {domain.body}
                </p>
              </motion.div>
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
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
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

      {/* ── Section 3: How It Works — three steps ────────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 96, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={H2}
          >
            How It Works
          </motion.h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                style={{
                  borderTop: "1px solid #1A1A1A",
                  paddingTop: 32,
                  paddingBottom: 32,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 48,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 200,
                    fontSize: 48,
                    color: "#333",
                    lineHeight: 1,
                    flexShrink: 0,
                    minWidth: 60,
                  }}
                >
                  {step.number}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontWeight: 500,
                      fontSize: 15,
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
                      maxWidth: 560,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid #1A1A1A" }} />
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
