"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import { DatabaseZap } from "lucide-react";

const BG = "#08080D";
const INNER: React.CSSProperties = {
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 48,
  paddingRight: 48,
};

const FEATURES = [
  {
    title: "Entity Resolution",
    body: "Deduplicates patient records across systems using probabilistic matching — so one patient is always one patient, regardless of how many systems they appear in.",
  },
  {
    title: "Free-Text NLP Extraction",
    body: "Extracts structured ICD-10, SNOMED, and LOINC codes from clinical notes, discharge summaries, and pathology reports. Unstructured data becomes queryable.",
  },
  {
    title: "Completeness Scoring",
    body: "Continuous field-level completeness metrics per data source. Flags which systems are producing incomplete records and quantifies the impact on AI model accuracy.",
  },
  {
    title: "Schema Normalisation",
    body: "Maps every incoming data format to a canonical FHIR R4 model. Drug names, units, timestamps, and identifiers are standardised before storage.",
  },
  {
    title: "Duplication Removal",
    body: "Automated detection and resolution of duplicate observations, orders, and records — including near-duplicate identification via semantic similarity.",
  },
  {
    title: "Quality Gates",
    body: "Configurable thresholds that block low-quality data from reaching AI models. Every record that enters the pipeline carries a quality score.",
  },
] as const;

export default function DataStandardisationPage() {
  return (
    <main style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ ...INNER, paddingTop: 152, paddingBottom: 96 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(0, 212, 170, 0.08)",
              border: "1px solid rgba(0, 212, 170, 0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <DatabaseZap size={14} color="#00D4AA" strokeWidth={1.5} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-dm-sans)", fontWeight: 400, fontSize: 11,
              color: "#00D4AA", letterSpacing: "0.12em", textTransform: "uppercase",
            }}
          >
            Most Deployed
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          style={{
            fontFamily: "var(--font-dm-sans)", fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 48px)", color: "#FFFFFF",
            letterSpacing: "-0.02em", marginBottom: 24, maxWidth: 720,
          }}
        >
          Data Standardisation & ETL Pipeline
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-dm-sans)", fontWeight: 300, fontSize: 17,
            color: "#777", lineHeight: 1.7, maxWidth: 600, marginBottom: 40,
          }}
        >
          A data cleansing and pipeline service that resolves missing fields,
          duplicates, and unstructured free-text — so AI models receive clean,
          normalised data and stop hallucinating.
        </motion.p>

        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-dm-sans)", fontWeight: 400, fontSize: 14,
            color: "#FFFFFF", textDecoration: "none",
            border: "1px solid #2A2A2A", borderRadius: 4,
            padding: "12px 24px", display: "inline-block", transition: "border-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,170,0.4)"; e.currentTarget.style.color = "#00D4AA"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.color = "#FFFFFF"; }}
        >
          Book a Consultation
        </motion.a>
      </section>

      {/* When you need this */}
      <section style={{ borderTop: "1px solid #1A1A1A", background: BG }}>
        <div style={{ ...INNER, paddingTop: 64, paddingBottom: 80 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "var(--font-dm-sans)", fontWeight: 400, fontSize: 22,
              color: "#FFFFFF", letterSpacing: "-0.01em", marginBottom: 32,
            }}
          >
            When you need this
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 0 }}>
            {[
              "Your Data Health Profiler score flagged high duplication rates or incomplete fields.",
              "AI models return inconsistent or nonsensical outputs on your hospital's data.",
              "Clinical notes and free-text sit outside your structured data pipeline entirely.",
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  borderLeft: i === 0 ? "none" : "1px solid #1A1A1A",
                  padding: "24px 28px", borderTop: "1px solid #1A1A1A",
                }}
              >
                <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300, fontSize: 14, color: "#666", lineHeight: 1.65 }}>
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingTop: 80, paddingBottom: 96 }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "var(--font-dm-sans)", fontWeight: 400, fontSize: 22,
              color: "#FFFFFF", letterSpacing: "-0.01em", marginBottom: 40,
              borderTop: "1px solid #1A1A1A", paddingTop: 48,
            }}
          >
            How it works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1, background: "#1A1A1A" }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                style={{ background: BG, padding: "32px 28px" }}
              >
                <h3 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 14, color: "#FFFFFF", marginBottom: 10 }}>
                  {f.title}
                </h3>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300, fontSize: 13, color: "#555", lineHeight: 1.65 }}>
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: BG, borderTop: "1px solid #1A1A1A" }}>
        <div style={{ maxWidth: 560, marginLeft: "auto", marginRight: "auto", padding: "96px 24px", textAlign: "center" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300, fontSize: 18, color: "#777", lineHeight: 1.7, marginBottom: 36 }}
          >
            Ready to clean your data before AI touches it?
          </motion.p>
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              fontFamily: "var(--font-dm-sans)", fontWeight: 400, fontSize: 14,
              color: "#FFFFFF", textDecoration: "none",
              border: "1px solid #2A2A2A", borderRadius: 4,
              padding: "12px 28px", display: "inline-block", transition: "border-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,170,0.4)"; e.currentTarget.style.color = "#00D4AA"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.color = "#FFFFFF"; }}
          >
            Request a Demo
          </motion.a>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #1A1A1A", paddingTop: 64, paddingBottom: 64, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, fontSize: 11, color: "#444" }}>&copy; 2025 Adopt AI</p>
      </footer>
    </main>
  );
}
