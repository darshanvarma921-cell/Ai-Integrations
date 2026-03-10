"use client";

import { motion } from "framer-motion";

/* ── Data ─────────────────────────────────────────────────────── */
const PILLARS = [
  {
    title: "Connect",
    body: "Plug into any hospital system — EHR, HIS, LIMS, pharmacy, PACS, bedside devices — through pre-built connector adapters. Upload a spec document and the platform auto-generates a working integration in hours, not months.",
  },
  {
    title: "Normalise",
    body: "Incoming data from every source is transformed into a single canonical model. Duplicate patients resolved, free-text coded to ICD-10, units standardised, quality issues flagged. The data lake stays clean without manual effort.",
  },
  {
    title: "Orchestrate",
    body: "Layer AI tools on top of clean, unified data. Plug in radiology AI, clinical decision support, predictive analytics — or build your own. The platform handles routing, permissions, and keeps everything running when systems change.",
  },
] as const;

const LAYERS = [
  {
    label: "AI & Analytics Layer",
    desc: "Natural language queries, clinical AI models, third-party AI tool integrations, executive dashboards",
  },
  {
    label: "Intelligence Layer",
    desc: "Auto-generated connectors, data normalisation, quality assurance, self-healing pipelines",
  },
  {
    label: "Middleware",
    desc: "FHIR R4 canonical schema, event-driven pipelines, message queues, API gateway",
  },
  {
    label: "Hospital Systems",
    desc: "EHRs, HIS, LIMS, pharmacy, PACS, devices, billing, insurance portals",
  },
] as const;

const SYSTEM_ROWS = [
  {
    category: "EHR / HIS",
    items: ["DoctorsApp", "Practo Ray", "HealthPlix", "KareXpert", "Insta", "Eka Care", "MocDoc", "Bahmni"],
  },
  {
    category: "Devices",
    items: ["Philips", "GE", "Mindray", "Drager", "Roche", "Siemens", "BPL", "Schiller"],
  },
  {
    category: "Protocols",
    items: ["HL7 FHIR R4", "HL7 v2", "DICOM", "ASTM", "ABDM", "IEEE 11073"],
  },
] as const;

/* ── Shared animation variant ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

/* ── Shared style helpers ─────────────────────────────────────── */
const SECTION_BASE = { background: "#08080D" };
const INNER = {
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 48,
  paddingRight: 48,
};
const INNER_NARROW = { ...INNER, maxWidth: 640, paddingLeft: 24, paddingRight: 24 };

const SECTION_HEADING = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 400,
  fontSize: 28,
  color: "#FFFFFF",
  letterSpacing: "-0.01em",
  marginBottom: 48,
};

/* ── Component ────────────────────────────────────────────────── */
export function BelowFold() {
  return (
    <>
      {/* ── A: The Problem ──────────────────────────────── */}
      <section style={{ ...SECTION_BASE, borderTop: "1px solid #1A1A1A" }}>
        <div style={{ ...INNER_NARROW, paddingTop: 96, paddingBottom: 96, textAlign: "center" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: 18,
              color: "#888",
              lineHeight: 1.7,
            }}
          >
            Hospital data lives in dozens of disconnected systems — EHRs, lab
            software, billing platforms, bedside devices. Every integration is a
            manual, months-long engineering project. Every system update breaks
            something. And new AI tools can&rsquo;t plug in without rebuilding the
            plumbing from scratch.
          </motion.p>
        </div>
      </section>

      {/* ── B: What Adopt AI Does ─ three pillars ───────── */}
      <section style={SECTION_BASE}>
        <div style={{ ...INNER, paddingBottom: 96 }}>
          <div className="grid sm:grid-cols-3" style={{ gap: 60 }}>
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                style={{ borderTop: "1px solid #1A1A1A", paddingTop: 28 }}
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
                  {p.title}
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
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── C: How It Works ─ architecture layers ───────── */}
      <section style={SECTION_BASE}>
        <div style={{ ...INNER, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={SECTION_HEADING}
          >
            How It Works
          </motion.h2>

          <div>
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="flex items-start justify-between"
                style={{
                  borderTop: "1px solid #1A1A1A",
                  paddingTop: 20,
                  paddingBottom: 20,
                  gap: 48,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#FFFFFF",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    minWidth: 200,
                    flexShrink: 0,
                  }}
                >
                  {layer.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "#666",
                    lineHeight: 1.7,
                  }}
                >
                  {layer.desc}
                </span>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid #1A1A1A" }} />
          </div>
        </div>
      </section>

      {/* ── D: Built For ─ system grid ──────────────────── */}
      <section style={SECTION_BASE}>
        <div style={{ ...INNER, paddingBottom: 96, textAlign: "center" }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={SECTION_HEADING}
          >
            Built For
          </motion.h2>

          <div>
            {SYSTEM_ROWS.map((row, i) => (
              <motion.div
                key={row.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  borderTop: "1px solid #1A1A1A",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <div
                  className="flex flex-wrap justify-center"
                  style={{ gap: 24 }}
                >
                  {row.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 400,
                        fontSize: 11,
                        color: "#555",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid #1A1A1A" }} />
          </div>
        </div>
      </section>

      {/* ── E: CTA ──────────────────────────────────────── */}
      <section style={SECTION_BASE}>
        <div
          style={{
            ...INNER_NARROW,
            paddingTop: 0,
            paddingBottom: 96,
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
            style={{ gap: 32 }}
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
              Ready to connect your systems — and the AI tools that will transform
              them?
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
              Book a Demo
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer
        style={{
          background: "#08080D",
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
    </>
  );
}
