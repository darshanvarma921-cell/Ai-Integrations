"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";

/* ── Data ─────────────────────────────────────────────────────── */
const SOLUTIONS = [
  {
    title: "Intelligent Bed Management",
    body: "Real-time census, demand forecasting, discharge readiness scoring, and automated transfer routing.",
  },
  {
    title: "Clinical Documentation",
    body: "Ambient AI captures physician-patient conversations and generates structured clinical notes in any language.",
  },
  {
    title: "Clinical Handoff",
    body: "Structured SBAR handoff notes generated from verbal shift transitions, with risk stratification and missing-information detection.",
  },
  {
    title: "Staff Scheduling",
    body: "Constraint-optimised scheduling that factors demand forecasts, compliance rules, skill matching, and burnout monitoring.",
  },
  {
    title: "Operating Room Optimisation",
    body: "Surgeon-specific case duration modelling, schedule optimisation, real-time OR board, and post-op bed reservation.",
  },
  {
    title: "Clinical Trial Matching",
    body: "Automated patient-trial eligibility matching from EHR data, with pre-screening documentation and enrolment tracking.",
  },
  {
    title: "Clinical Coding & Revenue",
    body: "AI-powered ICD-10 coding from discharge documentation, undercoding detection, and revenue impact analytics.",
  },
  {
    title: "Supply Chain Intelligence",
    body: "Demand forecasting, automated reorder, expiration tracking, and full device traceability.",
  },
  {
    title: "Specialty Documentation",
    body: "Purpose-built ambient documentation for surgical, anaesthesia, emergency, and oncology workflows.",
  },
  {
    title: "Analytics & KPI Dashboard",
    body: "Unified data warehouse, real-time KPI engine, clinical AI models, financial analytics, and regulatory reporting.",
  },
] as const;

/* ── Page ─────────────────────────────────────────────────────── */
export default function SolutionsPage() {
  return (
    <main style={{ background: "#08080D", minHeight: "100vh" }}>
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
          }}
        >
          Solutions Across the Hospital
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
            maxWidth: 480,
          }}
        >
          Ten operational modules. One unified platform.
        </motion.p>
      </section>

      {/* ── Solutions Grid ──────────────────────────────── */}
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
        <div
          className="grid sm:grid-cols-2"
          style={{ gap: "0 80px" }}
        >
          {SOLUTIONS.map((sol, i) => (
            <motion.div
              key={sol.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
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
                  marginBottom: 10,
                }}
              >
                {sol.title}
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
                {sol.body}
              </p>
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
