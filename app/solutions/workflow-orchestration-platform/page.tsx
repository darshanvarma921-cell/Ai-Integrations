"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import { GitBranch } from "lucide-react";

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
    title: "EHR Screen Embedding",
    body: "AI recommendations surface as contextual panels inside the EHR screens clinicians already use. No new app to open. No context switch.",
  },
  {
    title: "Audit-Ready Accept / Override",
    body: "Every AI suggestion is logged with whether the clinician accepted, modified, or overrode it. Provides the evidence trail regulators and insurers require.",
  },
  {
    title: "Role-Based Alert Routing",
    body: "Patient flow predictions go to bed managers. Clinical decision support goes to the treating physician. Nursing alerts go to the assigned nurse. Signal reaches the right person.",
  },
  {
    title: "Workflow Bottleneck Analytics",
    body: "Continuous analysis of EHR audit logs surfaces where time is being lost — screen switches per session, handoff delays, documentation burden by department.",
  },
  {
    title: "Low-Code Integration Builder",
    body: "Configure where and how AI output appears without engineering involvement. Drag-and-drop trigger conditions, notification rules, and display templates.",
  },
  {
    title: "Escalation & Fallback Logic",
    body: "Defines what happens when AI confidence is low or the model is unavailable. Ensures clinical workflows are never dependent on AI uptime.",
  },
] as const;

export default function WorkflowOrchestrationPage() {
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
            <GitBranch size={14} color="#00D4AA" strokeWidth={1.5} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-dm-sans)", fontWeight: 400, fontSize: 11,
              color: "#00D4AA", letterSpacing: "0.12em", textTransform: "uppercase",
            }}
          >
            Integration Suite
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
          Workflow Orchestration Platform
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
          A UI and workflow integration engine that embeds AI output directly
          inside the EHR screens clinicians already use — zero new interfaces,
          zero adoption friction.
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
              "Clinicians ignore standalone AI tools because they require leaving the EHR.",
              "Your Workflow Intelligence score flagged high screen-switch counts or documentation delays.",
              "AI pilots show good accuracy in testing but fail to change clinical behaviour in practice.",
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
            Ready to put AI where clinicians will actually see it?
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
