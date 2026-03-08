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
              fontWeight: 400,
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
          className="mt-7 max-w-[580px] leading-relaxed"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "clamp(15px, 1.5vw, 18px)",
            color: "#666",
          }}
        >
          AI-powered integration infrastructure for hospitals, clinics, and
          health networks. Connect your HIS, EHR, and billing systems without
          replacing what already works.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary CTA — ghost pill */}
          <a
            href="#"
            className="group flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-normal text-white transition-all duration-300"
            style={{
              fontFamily: "var(--font-dm-sans)",
              border: "1px solid #333",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#333";
            }}
          >
            Start Exploring →
          </a>

          {/* Secondary CTA — filled green */}
          <Link
            href="/demo"
            className="group relative flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-medium text-black transition-all duration-300"
            style={{
              fontFamily: "var(--font-dm-sans)",
              background: "#10B981",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0EA47A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#10B981";
            }}
          >
            View Live Demo →
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
