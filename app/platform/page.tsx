"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";

/* ── Data ─────────────────────────────────────────────────────── */
const LAYERS = [
  {
    label: "AI Tools",
    desc: "Any third-party AI product: radiology triage, clinical decision support, documentation copilots, predictive analytics, revenue cycle automation. You choose. We connect.",
  },
  {
    label: "Intelligence Layer",
    desc: "Auto-generated connectors from uploaded specs, data normalisation engine, quality assurance, self-healing pipeline monitoring.",
  },
  {
    label: "Middleware",
    desc: "FHIR R4 canonical data model, event-driven pipelines, API gateway, message queues. All hospital data transformed into one queryable schema.",
  },
  {
    label: "Hospital Systems",
    desc: "EHRs, HIS, LIMS, pharmacy, PACS, bedside devices, billing, insurance portals. Connected through pre-built adapters or auto-generated from documentation.",
  },
] as const;

const CAPABILITIES = [
  {
    title: "Intelligent Auto-Integration",
    body: "Upload an API spec, a CSV template, or a device data sheet. The platform reads it, infers the schema, maps fields to our canonical model, and generates a working connector. What used to take weeks collapses to hours.",
  },
  {
    title: "Data Normalisation",
    body: "Entity resolution across systems. NLP extraction from free-text to ICD-10. Unit conversion, drug name standardisation, duplicate detection. The data lake stays clean without manual effort.",
  },
  {
    title: "Self-Healing Pipelines",
    body: "When a hospital changes an EHR config, updates an API, or alters a data format — the platform detects the break, diagnoses the cause, and auto-recovers. Only novel failures reach an engineer.",
  },
  {
    title: "Natural Language Queries",
    body: "Hospital staff ask questions in plain language and get answers from the unified data lake. No SQL. No BI tools. Role-based access ensures people only see what they should.",
  },
  {
    title: "Connector Marketplace",
    body: "Every deployed integration is stored as a versioned template. When a new hospital runs a similar system, the platform recommends the closest match and auto-customises. Each connection makes the next one faster.",
  },
] as const;

const SYSTEM_CATEGORIES = [
  {
    label: "EHR / HIS",
    items: "DoctorsApp, Practo Ray, HealthPlix, KareXpert, Insta, Eka Care, MocDoc, CrelioHealth, MediXcel, NuvertOS, LIFE HIS, Bahmni, eHospital (NIC)",
  },
  {
    label: "Medical Devices",
    items: "Patient monitors (Philips, GE, BPL, Mindray), Ventilators (Hamilton, Drager, AgVa), Infusion pumps (B. Braun, Fresenius), Lab analysers (Roche, Siemens, Beckman, Erba), Imaging (GE, Siemens, Fujifilm, Allengers), ECG (BPL, Schiller, Philips, Tricog)",
  },
  {
    label: "Protocols",
    items: "HL7 FHIR R4, HL7 v2, DICOM, DICOMweb, ASTM, ABDM HIE-CM, IEEE 11073, SCP-ECG",
  },
  {
    label: "Ancillary Systems",
    items: "LIMS, pharmacy management, ABDM/ABHA, TPA portals (Medi Assist, Paramount, Raksha), CGHS, Ayushman Bharat PMJAY, Tally, SAP",
  },
] as const;

/* ── Animation ────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
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

/* ── CTA block (reused) ───────────────────────────────────────── */
function PageCTA() {
  return (
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
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}
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
            Ready to find out if your hospital is ready for AI?
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
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function PlatformPage() {
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
          The Integration Layer for Hospital AI
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
          We don&rsquo;t sell AI products. We make it possible for hospitals to
          adopt any AI product — seamlessly, without disruption, without replacing
          what already works.
        </motion.p>
      </section>

      {/* ── Section 1: How It Works ─ platform layers ───── */}
      <section style={{ borderTop: "1px solid #1A1A1A", background: BG }}>
        <div style={{ ...INNER, paddingTop: 64, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={H2}
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
                style={{
                  borderTop: "1px solid #1A1A1A",
                  paddingTop: 20,
                  paddingBottom: 20,
                  display: "flex",
                  alignItems: "flex-start",
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

      {/* ── Section 2: Five Core Capabilities ───────────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 96, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={H2}
          >
            Five Core Capabilities
          </motion.h2>

          <div>
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                style={{
                  borderTop: "1px solid #1A1A1A",
                  paddingTop: 28,
                  paddingBottom: 28,
                  display: "grid",
                  gridTemplateColumns: "240px 1fr",
                  gap: 48,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: 15,
                    color: "#FFFFFF",
                  }}
                >
                  {cap.title}
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
                  {cap.body}
                </p>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid #1A1A1A" }} />
          </div>
        </div>
      </section>

      {/* ── Section 3: Supported Systems ─────────────────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 96, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={H2}
          >
            Supported Systems
          </motion.h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {SYSTEM_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  borderTop: "1px solid #1A1A1A",
                  paddingTop: 24,
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: 32,
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: 11,
                    color: "#555",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {cat.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "#555",
                    lineHeight: 1.7,
                  }}
                >
                  {cat.items}
                </span>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid #1A1A1A" }} />
          </div>
        </div>
      </section>

      <PageCTA />

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
