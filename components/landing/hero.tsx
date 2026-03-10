"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { EntropyGlobe } from "@/components/ui/entropy-globe";
import { ScrollIndicator } from "./scroll-indicator";

const TEXT_LINES = [
  { text: "Connect", delay: 0 },
  { text: "Every System.", delay: 150 },
  { text: "Elevate Every Outcome.", delay: 300 },
] as const;

export function Hero() {
  const lineRefs = useRef<Array<HTMLElement | null>>([]);
  const subRef   = useRef<HTMLParagraphElement | null>(null);
  const ctaRef   = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Staggered fade-up animation via CSS animation-delay
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.animationDelay = `${TEXT_LINES[i].delay}ms`;
      el.style.opacity = "0";
      el.style.animationFillMode = "forwards";
      el.classList.add("word-float");
    });
    if (subRef.current) {
      subRef.current.style.animationDelay = "500ms";
      subRef.current.style.opacity = "0";
      subRef.current.style.animationFillMode = "forwards";
      subRef.current.classList.add("word-float");
    }
    if (ctaRef.current) {
      ctaRef.current.style.animationDelay = "700ms";
      ctaRef.current.style.opacity = "0";
      ctaRef.current.style.animationFillMode = "forwards";
      ctaRef.current.classList.add("word-float");
    }
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-[#0A0A0F] pt-24">
      {/* ── Globe layer (fills section, sits behind text) ──────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden
      >
        {/* Outer ambient glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: "min(700px, 95vw)",
            height: "min(700px, 95vw)",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06) 0%, rgba(0,212,170,0.04) 50%, transparent 75%)",
            filter: "blur(60px)",
          }}
        />
        {/* Globe canvas container */}
        <div
          style={{
            width: "min(680px, 92vw)",
            height: "min(680px, 92vw)",
            position: "relative",
          }}
        >
          <EntropyGlobe />
        </div>
      </div>

      {/* ── Vignette overlay so text is legible ───────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(10,10,15,0.55) 70%, rgba(10,10,15,0.9) 100%)",
        }}
      />

      {/* ── Hero text (center) ─────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Line 1: "Connect" – Playfair italic */}
        <h1>
          <span
            ref={(el) => { lineRefs.current[0] = el; }}
            className="block"
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(56px, 8vw, 96px)",
              lineHeight: 1.08,
              color: "rgba(255,255,255,0.72)",
              textShadow:
                "0 0 60px rgba(0,212,170,0.25), 0 0 120px rgba(139,92,246,0.15)",
              letterSpacing: "-0.02em",
            }}
          >
            Connect
          </span>

          {/* Line 2: "Every System." – DM Sans medium */}
          <span
            ref={(el) => { lineRefs.current[1] = el; }}
            className="block mt-1"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: "clamp(38px, 5.5vw, 72px)",
              lineHeight: 1.12,
              color: "#ffffff",
              letterSpacing: "-0.025em",
            }}
          >
            Every System.
          </span>

          {/* Line 3: "Elevate Every Outcome." – DM Sans medium */}
          <span
            ref={(el) => { lineRefs.current[2] = el; }}
            className="block"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: "clamp(38px, 5.5vw, 72px)",
              lineHeight: 1.12,
              color: "#ffffff",
              letterSpacing: "-0.025em",
            }}
          >
            Elevate Every Outcome.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subRef}
          className="mt-7 max-w-[580px]"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: 16,
            color: "#777",
            lineHeight: 1.7,
          }}
        >
          AI-powered integration infrastructure for hospitals, clinics, and
          health networks. Connect your HIS, EHR, and billing systems without
          replacing what already works.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-wrap items-center justify-center"
          style={{ gap: 32 }}
        >
          {/* "Start Exploring →" — text link, arrow nudges right on hover */}
          <a
            href="#"
            className="group"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: 15,
              color: "#888",
              letterSpacing: "0.02em",
              textDecoration: "none",
              transition: "color 0.3s",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#FFFFFF";
              const arrow = el.querySelector<HTMLElement>(".cta-arrow");
              if (arrow) arrow.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#888";
              const arrow = el.querySelector<HTMLElement>(".cta-arrow");
              if (arrow) arrow.style.transform = "translateX(0)";
            }}
          >
            Start Exploring
            <span
              className="cta-arrow"
              style={{ display: "inline-block", transition: "transform 0.3s" }}
            >
              →
            </span>
          </a>

          {/* "View Live Demo" — white text link, primary action by colour */}
          <Link
            href="/demo"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: 15,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
              textDecoration: "none",
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.7";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            View Live Demo
          </Link>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <div className="relative z-10 w-full flex justify-center pb-6">
        <ScrollIndicator />
      </div>
    </section>
  );
}
