"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ── Marquee data ─────────────────────────────────────────────── */
const ROW_1 = ["DoctorsApp", "Practo Ray", "HealthPlix", "KareXpert", "Insta", "Eka Care", "MocDoc", "Bahmni"];
const ROW_2 = ["Philips", "GE", "Mindray", "Drager", "Roche", "Siemens", "BPL", "Schiller"];
const ROW_3 = ["HL7 FHIR R4", "HL7 v2", "DICOM", "ASTM", "ABDM", "IEEE 11073"];

/* ── Pillar data ──────────────────────────────────────────────── */
const PILLARS = [
  {
    title: "Connect",
    body: "Plug into any hospital system — EHR, HIS, LIMS, pharmacy, PACS, bedside devices — through pre-built connector adapters. Upload a spec document and the platform auto-generates a working integration in hours, not months.",
  },
  {
    title: "Normalise",
    body: "Incoming data from every source is transformed into a single canonical model. Duplicate patients resolved, free-text coded to ICD-10, units standardised, quality issues flagged automatically.",
  },
  {
    title: "Integrate",
    body: "Bring in any AI tool — radiology triage, clinical decision support, documentation copilots, predictive analytics, revenue cycle automation. Connect it to clean, unified hospital data. No custom builds. No vendor lock-in.",
  },
] as const;

/* ── MarqueeRow ───────────────────────────────────────────────── */
const ITEM_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 400,
  fontSize: 11,
  color: "#555",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  paddingRight: 56,
  userSelect: "none",
};

const MASK: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  maskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  overflow: "hidden",
};

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: readonly string[];
  direction: "left" | "right";
  duration: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div style={MASK}>
      <div
        className={`animate-marquee-${direction}`}
        style={{
          display: "flex",
          animationDuration: `${duration}s`,
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={ITEM_STYLE}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Shared animation ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

/* ── Shared style helpers ─────────────────────────────────────── */
const BG = "#08080D";
const INNER: React.CSSProperties = {
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 48,
  paddingRight: 48,
};
const INNER_NARROW: React.CSSProperties = {
  ...INNER,
  maxWidth: 640,
  paddingLeft: 24,
  paddingRight: 24,
};

/* ── Component ────────────────────────────────────────────────── */
export function BelowFold() {
  return (
    <>
      {/* ── A: The Problem ──────────────────────────────── */}
      <section style={{ background: BG, borderTop: "1px solid #1A1A1A" }}>
        <div
          style={{
            ...INNER_NARROW,
            paddingTop: 96,
            paddingBottom: 96,
            textAlign: "center",
          }}
        >
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
            Hospitals don&rsquo;t have an AI problem. They have an integration
            problem. Clinical data lives across dozens of disconnected systems —
            EHRs, lab software, billing platforms, bedside devices. Every new AI
            tool requires months of custom engineering to plug in. Every system
            update breaks something. Most AI pilots die not because the technology
            failed, but because the infrastructure wasn&rsquo;t ready.
          </motion.p>
        </div>
      </section>

      {/* ── B: What Adopt AI Does ─ three pillars ───────── */}
      <section style={{ background: BG }}>
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

      {/* ── C: Start With Readiness ─ featured block ────── */}
      <section style={{ background: BG }}>
        <div style={{ ...INNER, paddingBottom: 96 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            style={{
              border: "1px solid #1A1A1A",
              padding: 40,
              maxWidth: 720,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 400,
                fontSize: 16,
                color: "#FFFFFF",
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}
            >
              Before you integrate, know where you stand.
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: 14,
                color: "#666",
                lineHeight: 1.7,
                marginBottom: 28,
                maxWidth: 580,
              }}
            >
              Our AI Readiness Assessment maps your hospital&rsquo;s systems, data
              quality, governance, workflows, infrastructure, and team capacity
              across six domains. You get a scored report, gap analysis, risk
              heatmap, and a prioritised roadmap — not a generic checklist, but a
              hospital-specific blueprint for AI adoption.
            </p>
            <Link
              href="/readiness"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 400,
                fontSize: 14,
                color: "#888",
                textDecoration: "none",
                transition: "color 0.3s",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#FFFFFF";
                const arrow = el.querySelector<HTMLElement>(".rf-arrow");
                if (arrow) arrow.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#888";
                const arrow = el.querySelector<HTMLElement>(".rf-arrow");
                if (arrow) arrow.style.transform = "translateX(0)";
              }}
            >
              Learn more
              <span
                className="rf-arrow"
                style={{ display: "inline-block", transition: "transform 0.3s" }}
              >
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── D: Compatible with ─ marquee ─────────────────── */}
      <section style={{ background: BG, borderTop: "1px solid #1A1A1A" }}>
        <div style={{ paddingTop: 64, paddingBottom: 72 }}>
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: 10,
              color: "#444",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Compatible with
          </motion.p>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <MarqueeRow items={ROW_1} direction="left" duration={30} />
            <MarqueeRow items={ROW_2} direction="right" duration={40} />
            <MarqueeRow items={ROW_3} direction="left" duration={35} />
          </div>
        </div>
      </section>

      {/* ── E: CTA ──────────────────────────────────────── */}
      <section style={{ background: BG }}>
        <div
          style={{
            ...INNER_NARROW,
            paddingTop: 96,
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

      {/* ── Footer ──────────────────────────────────────── */}
      <footer
        style={{
          background: BG,
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
