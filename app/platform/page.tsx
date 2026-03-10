"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";

/* ── Data ─────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    title: "Intelligent Auto-Integration",
    body: "Upload a PDF, CSV, or API spec. The platform reads the document, infers the data schema, maps fields to our canonical FHIR model, and generates a working connector adapter. What used to take weeks of custom engineering collapses to hours.",
  },
  {
    title: "AI-Powered Data Normalisation",
    body: "Entity resolution resolves duplicate patients across systems. NLP extracts structured data from free-text clinical notes and maps to ICD-10. Unit conversion, drug name standardisation, and confidence scoring ensure the data lake stays clean.",
  },
  {
    title: "Self-Healing Pipelines",
    body: "When a hospital updates their EHR config, changes a password, or alters a data format — the platform detects the break, diagnoses the root cause, and auto-recovers. Only novel failures escalate to engineers.",
  },
  {
    title: "Natural Language Data Queries",
    body: "Hospital staff type plain-language questions and get instant answers from the unified data lake. No SQL, no BI dashboards. Role-based access ensures department heads only see their own data.",
  },
  {
    title: "Connector Marketplace",
    body: "Every deployed connector is stored as a versioned template. When a new hospital comes onboard with a similar system, the platform recommends the closest existing connector and auto-customises it. Each integration makes the next one faster.",
  },
] as const;

const LAYERS = [
  {
    label: "AI & Analytics Layer",
    desc: "Natural language queries for hospital staff. Clinical AI model routing — radiology, pathology, risk scoring. Third-party AI tool integrations with permissions management. Executive dashboards and regulatory reporting.",
  },
  {
    label: "Intelligence Layer",
    desc: "Auto-generated connector adapters from spec documents. AI-powered entity resolution and data normalisation. Confidence scoring and quality assurance pipelines. Self-healing detection, root cause diagnosis, and auto-recovery.",
  },
  {
    label: "Middleware",
    desc: "FHIR R4 canonical data model as single source of truth. Event-driven pipelines with message queues. API gateway with role-based access control. Audit trails and compliance logging.",
  },
  {
    label: "Hospital Systems",
    desc: "EHR and HIS platforms. LIMS and pharmacy management. PACS and radiology systems. Bedside devices and medical equipment. Billing, insurance portals, and accounting/ERP.",
  },
] as const;

const SYSTEM_CATEGORIES = [
  {
    label: "EHR / HIS",
    items: [
      { name: "DoctorsApp", note: "cloud-native HIS" },
      { name: "Practo Ray", note: "clinic management" },
      { name: "HealthPlix", note: "EMR platform" },
      { name: "KareXpert", note: "hospital management" },
      { name: "Insta HMS", note: "hospital management" },
      { name: "Eka Care", note: "health records" },
      { name: "MocDoc", note: "hospital management" },
      { name: "Bahmni", note: "open-source EMR" },
    ],
  },
  {
    label: "Medical Devices",
    items: [
      { name: "Patient Monitors", note: "Philips, GE, Mindray, Drager" },
      { name: "Ventilators", note: "Hamilton, Drager, Mindray" },
      { name: "Infusion Pumps", note: "BD, Baxter, B. Braun" },
      { name: "Lab Analysers", note: "Roche, Siemens, Abbott" },
      { name: "Imaging Systems", note: "GE, Philips, Siemens Healthineers" },
      { name: "ECG / Cardiac", note: "Schiller, BPL, GE" },
    ],
  },
  {
    label: "Integration Protocols",
    items: [
      { name: "HL7 FHIR R4", note: "primary canonical standard" },
      { name: "HL7 v2", note: "legacy messaging" },
      { name: "DICOM", note: "imaging and radiology" },
      { name: "ASTM", note: "laboratory instruments" },
      { name: "ABDM HIE-CM", note: "India national health exchange" },
      { name: "IEEE 11073", note: "bedside device communication" },
      { name: "SCP-ECG", note: "ECG data transfer" },
    ],
  },
  {
    label: "Ancillary Systems",
    items: [
      { name: "LIMS", note: "laboratory information management" },
      { name: "Pharmacy Management", note: "dispensing and inventory" },
      { name: "Insurance / TPA Portals", note: "claims and pre-authorisation" },
      { name: "Accounting / ERP", note: "finance and procurement" },
    ],
  },
] as const;

/* ── Shared helpers ───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const BG = "#08080D";

/* ── Page ─────────────────────────────────────────────────────── */
export default function PlatformPage() {
  return (
    <main style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 152,
          paddingBottom: 96,
          paddingLeft: 48,
          paddingRight: 48,
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
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
            maxWidth: 560,
          }}
        >
          A connector-first platform that brings fragmented hospital data
          together, then layers intelligence on top.
        </motion.p>
      </section>

      {/* ── Section 1: Five Core Capabilities ───────────── */}
      <section
        style={{
          borderTop: "1px solid #1A1A1A",
          paddingBottom: 96,
          paddingLeft: 48,
          paddingRight: 48,
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 28,
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            paddingTop: 48,
            marginBottom: 48,
          }}
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
      </section>

      {/* ── Section 2: Architecture ──────────────────────── */}
      <section
        style={{
          paddingTop: 96,
          paddingBottom: 96,
          paddingLeft: 48,
          paddingRight: 48,
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 28,
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            marginBottom: 48,
          }}
        >
          Architecture
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
      </section>

      {/* ── Section 3: Supported Systems ─────────────────── */}
      <section
        style={{
          paddingTop: 96,
          paddingBottom: 96,
          paddingLeft: 48,
          paddingRight: 48,
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 28,
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            marginBottom: 48,
          }}
        >
          Supported Systems
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {SYSTEM_CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: ci * 0.08 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500,
                  fontSize: 11,
                  color: "#555",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {cat.label}
              </p>
              <div>
                {cat.items.map((item, ii) => (
                  <div
                    key={item.name}
                    style={{
                      borderTop: ii === 0 ? "1px solid #1A1A1A" : "1px solid #141414",
                      paddingTop: 14,
                      paddingBottom: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 24,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 400,
                        fontSize: 14,
                        color: "#CCCCCC",
                      }}
                    >
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 300,
                        fontSize: 13,
                        color: "#555",
                      }}
                    >
                      {item.note}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #1A1A1A" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 0,
          paddingBottom: 96,
          paddingLeft: 24,
          paddingRight: 24,
          maxWidth: 640,
          marginLeft: "auto",
          marginRight: "auto",
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
