"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

/* ─── Node definitions ──────────────────────────────────────────────── */
const NODE_DEFS = [
  { label: "HIS",          r: 14,  g: 165, b: 233, angleDeg: 215, distF: 0.285 },
  { label: "EHR",          r: 16,  g: 185, b: 129, angleDeg: 182, distF: 0.255 },
  { label: "BILLING",      r: 0,   g: 255, b: 208, angleDeg: 148, distF: 0.295 },
  { label: "LAB SYSTEMS",  r: 34,  g: 211, b: 238, angleDeg: 110, distF: 0.270 },
  { label: "PHARMACY",     r: 6,   g: 182, b: 212, angleDeg:  55, distF: 0.285 },
  { label: "DIAGNOSTICS",  r: 129, g: 140, b: 248, angleDeg:   5, distF: 0.265 },
  { label: "RADIOLOGY AI", r: 139, g:  92, b: 246, angleDeg: 320, distF: 0.280 },
  { label: "CLINICAL DSS", r: 167, g: 139, b: 250, angleDeg: 268, distF: 0.245 },
] as const;

const PRIMARY_DELAYS = [0, 600, 1200, 1800, 2400, 3000, 3600, 4200];

const SECONDARY_PAIRS: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [5, 6], [6, 7], [0, 7],
];
const SECONDARY_DELAYS = [6200, 7000, 7800, 8600, 9400, 10200, 11000, 11800];


/* ─── Helpers ───────────────────────────────────────────────────────── */
function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function quadBezier(
  t: number,
  x0: number, y0: number,
  cpx: number, cpy: number,
  x1: number, y1: number
): [number, number] {
  const u = 1 - t;
  return [
    u * u * x0 + 2 * u * t * cpx + t * t * x1,
    u * u * y0 + 2 * u * t * cpy + t * t * y1,
  ];
}

/* ─── Canvas types ──────────────────────────────────────────────────── */
interface Particle {
  progress: number;
  speed: number;
  opacity: number;
  radius: number;
  jitterPhase: number;
  jitterAmp: number;
}

interface Connection {
  fromIdx: number; // -1 = centre orb
  toIdx: number;
  activateAt: number; // ms after init
  active: boolean;
  formProgress: number; // 0→1 backbone draw-in
  cpOffsetX: number;
  cpOffsetY: number;
  driftSeed: number;
  particles: Particle[];
  targetCount: number;
  spawnAccum: number;
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function DemoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initTimeRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "running">("idle");
  const [textPhase, setTextPhase] = useState<"hidden" | "showing" | "faded">("hidden");
  const [showScrollHint, setShowScrollHint] = useState(false);

  /* ── Scroll fade ─────────────────────────────────────────── */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onScroll = () => {
      const ratio = Math.min(window.scrollY / 400, 1);
      canvas.style.opacity = String(1 - ratio * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Canvas animation ────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let cx = 0, cy = 0;

    /* Node world positions (computed on resize) */
    let nodePos: { x: number; y: number }[] = [];

    const setSize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W * 0.5;
      cy = H * 0.48;

      const minDim = Math.min(W, H);
      nodePos = NODE_DEFS.map((nd) => {
        const rad = (nd.angleDeg * Math.PI) / 180;
        return {
          x: cx + Math.cos(rad) * nd.distF * minDim,
          y: cy + Math.sin(rad) * nd.distF * minDim,
        };
      });
    };
    setSize();

    /* Build connections */
    const connections: Connection[] = [];

    // Primary: centre → each node
    NODE_DEFS.forEach((nd, i) => {
      const angle = (nd.angleDeg * Math.PI) / 180;
      const perp = angle + Math.PI / 2;
      const cpOff = (Math.random() * 0.5 + 0.3) * Math.min(W, H) * 0.12;
      connections.push({
        fromIdx: -1,
        toIdx: i,
        activateAt: PRIMARY_DELAYS[i],
        active: false,
        formProgress: 0,
        cpOffsetX: Math.cos(perp) * cpOff * (Math.random() > 0.5 ? 1 : -1),
        cpOffsetY: Math.sin(perp) * cpOff * (Math.random() > 0.5 ? 1 : -1),
        driftSeed: Math.random() * 1000,
        particles: [],
        targetCount: 12,
        spawnAccum: 0,
      });
    });

    // Secondary: node → node
    SECONDARY_PAIRS.forEach(([a, b], i) => {
      const posA = nodePos[a] ?? { x: 0, y: 0 };
      const posB = nodePos[b] ?? { x: 0, y: 0 };
      const dx = posB.x - posA.x;
      const dy = posB.y - posA.y;
      const perp = Math.atan2(dy, dx) + Math.PI / 2;
      const cpOff = (Math.random() * 0.5 + 0.2) * 60;
      connections.push({
        fromIdx: a,
        toIdx: b,
        activateAt: SECONDARY_DELAYS[i],
        active: false,
        formProgress: 0,
        cpOffsetX: Math.cos(perp) * cpOff * (Math.random() > 0.5 ? 1 : -1),
        cpOffsetY: Math.sin(perp) * cpOff * (Math.random() > 0.5 ? 1 : -1),
        driftSeed: Math.random() * 1000,
        particles: [],
        targetCount: 8,
        spawnAccum: 0,
      });
    });

    /* Orb pulse state */
    let heartbeat = 0;

    /* Spawn a particle */
    const spawnParticle = (): Particle => ({
      progress: 0,
      speed: 0.003 + Math.random() * 0.003,
      opacity: 0.5 + Math.random() * 0.5,
      radius: 1.0 + Math.random() * 1.2,
      jitterPhase: Math.random() * Math.PI * 2,
      jitterAmp: 1.5 + Math.random() * 2.5,
    });

    /* Get endpoints for a connection */
    const getEndpoints = (conn: Connection) => {
      const fromX = conn.fromIdx === -1 ? cx : (nodePos[conn.fromIdx]?.x ?? cx);
      const fromY = conn.fromIdx === -1 ? cy : (nodePos[conn.fromIdx]?.y ?? cy);
      const toX = nodePos[conn.toIdx]?.x ?? cx;
      const toY = nodePos[conn.toIdx]?.y ?? cy;
      return { fromX, fromY, toX, toY };
    };

    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const now = Date.now();
      const elapsed = initTimeRef.current !== null ? now - initTimeRef.current : -1;
      const running = elapsed >= 0;

      ctx.clearRect(0, 0, W, H);

      /* ── Background ── */
      const bgGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.65);
      bgGrd.addColorStop(0, "rgba(14,6,30,1)");
      bgGrd.addColorStop(1, "rgba(6,3,15,1)");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, W, H);

      /* ── Centre orb ── */
      const orbPulse = running
        ? Math.min(1, elapsed / 1500)
        : 0.5 + 0.5 * Math.sin(now / 900);
      const orbR = running ? 28 + orbPulse * 8 : 22 + 6 * Math.abs(Math.sin(now / 900));
      const orbGlow = running ? Math.min(1, elapsed / 2000) : 0.3 + 0.2 * Math.abs(Math.sin(now / 900));

      const glowGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbR * 5);
      glowGrd.addColorStop(0, `rgba(0,212,170,${orbGlow * 0.18})`);
      glowGrd.addColorStop(0.5, `rgba(139,92,246,${orbGlow * 0.08})`);
      glowGrd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, orbR * 5, 0, Math.PI * 2);
      ctx.fillStyle = glowGrd;
      ctx.fill();

      const orbBodyGrd = ctx.createRadialGradient(cx - orbR * 0.3, cy - orbR * 0.3, 0, cx, cy, orbR);
      orbBodyGrd.addColorStop(0, `rgba(100,255,220,${0.9 * orbGlow + 0.1})`);
      orbBodyGrd.addColorStop(0.6, `rgba(0,212,170,${0.7 * orbGlow + 0.1})`);
      orbBodyGrd.addColorStop(1, `rgba(0,150,120,${0.4 * orbGlow})`);
      ctx.shadowBlur = 20 * orbGlow;
      ctx.shadowColor = "rgba(0,212,170,0.6)";
      ctx.beginPath();
      ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
      ctx.fillStyle = orbBodyGrd;
      ctx.fill();
      ctx.shadowBlur = 0;

      /* ── Node orbs ── */
      const phase3 = running && elapsed > 12000;
      NODE_DEFS.forEach((nd, i) => {
        const pos = nodePos[i];
        if (!pos) return;

        const primaryConn = connections[i];
        const lit = primaryConn.active ? Math.min(1, primaryConn.formProgress + 0.3) : 0.15;
        const nodeR = 10 + (phase3 ? 3 * Math.sin(now / 600 + i * 0.8) : 0);

        const ng = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nodeR * 3.5);
        ng.addColorStop(0, rgba(nd.r, nd.g, nd.b, lit * 0.25));
        ng.addColorStop(1, rgba(nd.r, nd.g, nd.b, 0));
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeR * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = ng;
        ctx.fill();

        ctx.shadowBlur = lit * 12;
        ctx.shadowColor = rgba(nd.r, nd.g, nd.b, 0.8);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeR, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(nd.r, nd.g, nd.b, 0.15 + lit * 0.6);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        const idg = ctx.createRadialGradient(pos.x - nodeR * 0.3, pos.y - nodeR * 0.3, 0, pos.x, pos.y, nodeR * 0.7);
        idg.addColorStop(0, rgba(nd.r, nd.g, nd.b, 0.4 + lit * 0.5));
        idg.addColorStop(1, rgba(nd.r, nd.g, nd.b, 0.1 + lit * 0.2));
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeR * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = idg;
        ctx.fill();

        ctx.font = `10px 'DM Sans', sans-serif`;
        ctx.fillStyle = rgba(nd.r, nd.g, nd.b, 0.4 + lit * 0.55);
        ctx.textAlign = "center";
        ctx.fillText(nd.label, pos.x, pos.y + nodeR + 14);
      });

      /* ── Connections + particles ── */
      connections.forEach((conn) => {
        if (!running) return;

        if (!conn.active && elapsed >= conn.activateAt) {
          conn.active = true;
        }
        if (!conn.active) return;

        const { fromX, fromY, toX, toY } = getEndpoints(conn);
        const drift = Math.sin(now / 4000 + conn.driftSeed) * 0.15;
        const cpx = lerp(fromX, toX, 0.5) + conn.cpOffsetX * (1 + drift);
        const cpy = lerp(fromY, toY, 0.5) + conn.cpOffsetY * (1 + drift);

        conn.formProgress = Math.min(1, conn.formProgress + 0.012);

        const nd = NODE_DEFS[conn.toIdx];
        const connAlpha = conn.fromIdx === -1 ? 0.18 : 0.12;

        // Backbone
        if (conn.formProgress > 0.05) {
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          const steps = 40;
          const limit = Math.floor(conn.formProgress * steps);
          for (let s = 1; s <= limit; s++) {
            const t = s / steps;
            const [bx, by] = quadBezier(t, fromX, fromY, cpx, cpy, toX, toY);
            ctx.lineTo(bx, by);
          }
          ctx.strokeStyle = rgba(nd.r, nd.g, nd.b, connAlpha * conn.formProgress);
          ctx.lineWidth = conn.fromIdx === -1 ? 0.8 : 0.6;
          ctx.stroke();
        }

        // Particles
        const spawnRate = 0.08 + (phase3 ? 0.06 : 0);
        conn.spawnAccum += spawnRate;
        while (conn.spawnAccum >= 1 && conn.particles.length < conn.targetCount + (phase3 ? 6 : 0)) {
          conn.particles.push(spawnParticle());
          conn.spawnAccum -= 1;
        }

        const speedBoost = phase3 ? 1.4 : 1;
        conn.particles = conn.particles.filter((p) => {
          p.progress += p.speed * speedBoost;
          if (p.progress >= 1) return false;

          const [bx, by] = quadBezier(p.progress, fromX, fromY, cpx, cpy, toX, toY);
          const eps = 0.01;
          const tNext = Math.min(p.progress + eps, 1);
          const [nx, ny] = quadBezier(tNext, fromX, fromY, cpx, cpy, toX, toY);
          const tang = Math.atan2(ny - by, nx - bx);
          const jitter = Math.sin(p.jitterPhase + p.progress * 18) * p.jitterAmp;
          const px2 = bx + Math.cos(tang + Math.PI / 2) * jitter;
          const py2 = by + Math.sin(tang + Math.PI / 2) * jitter;

          const endFade = Math.min(p.progress / 0.1, 1) * Math.min((1 - p.progress) / 0.1, 1);
          const alpha = p.opacity * endFade * (phase3 ? 1 : 0.85);

          ctx.beginPath();
          ctx.arc(px2, py2, p.radius * (phase3 ? 1.15 : 1), 0, Math.PI * 2);
          ctx.fillStyle = rgba(nd.r, nd.g, nd.b, alpha);
          ctx.fill();

          return true;
        });
      });

      /* ── Phase 3 heartbeat ── */
      if (phase3) {
        heartbeat += 0.04;
        const waveAlpha = 0.12 + 0.08 * Math.sin(heartbeat);
        const waveR = W * 0.18 + W * 0.08 * Math.sin(heartbeat * 0.7);
        const wg = ctx.createRadialGradient(cx, cy, waveR * 0.6, cx, cy, waveR);
        wg.addColorStop(0, `rgba(0,212,170,0)`);
        wg.addColorStop(0.7, `rgba(0,212,170,${waveAlpha})`);
        wg.addColorStop(1, `rgba(0,212,170,0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
        ctx.fillStyle = wg;
        ctx.fill();
      }
    };

    animate();

    const onResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      setSize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ── Init click ── */
  const handleInit = () => {
    initTimeRef.current = Date.now();
    setPhase("running");
    setTextPhase("showing");
    setTimeout(() => setTextPhase("faded"), 4200); // 0.6s fade-in + 3s display + buffer
    setTimeout(() => setShowScrollHint(true), 14000);
  };

  return (
    <main className="relative bg-[#06030F] text-white">
      {/* Fixed canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ transition: "opacity 0.3s" }}
      />

      {/* Viewport overlay */}
      <div className="relative z-10 flex h-screen flex-col items-center justify-center pointer-events-none select-none">

        {/* LIVE SIMULATION label — always visible */}
        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-10"
          style={{ color: "rgba(0,212,170,0.5)", fontFamily: "var(--font-dm-sans)" }}
        >
          Live Simulation
        </p>

        {/* One-shot headline + subtitle (fades in on init, fades out after 3s) */}
        {textPhase !== "hidden" && (
          <div className="text-center mb-10 absolute" style={{ top: "38%" }}>
            <motion.h1
              initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
              animate={
                textPhase === "showing"
                  ? { opacity: 1, filter: "blur(0px)", y: 0 }
                  : { opacity: 0, filter: "blur(8px)", y: -8 }
              }
              transition={{ duration: textPhase === "showing" ? 0.6 : 0.8, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 700,
                fontSize: "clamp(26px, 4vw, 56px)",
                lineHeight: 1.1,
                color: "#ffffff",
                letterSpacing: "-0.025em",
              }}
            >
              See AI Integration in Action
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
              animate={
                textPhase === "showing"
                  ? { opacity: 1, filter: "blur(0px)", y: 0 }
                  : { opacity: 0, filter: "blur(6px)", y: -6 }
              }
              transition={{
                duration: textPhase === "showing" ? 0.6 : 0.8,
                delay: textPhase === "showing" ? 0.4 : 0,
                ease: "easeOut",
              }}
              className="mt-4 max-w-[480px] mx-auto"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: "clamp(14px, 1.4vw, 17px)",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
              }}
            >
              Watch how Adopt AI connects hospital systems and AI tools into a unified intelligence layer.
            </motion.p>
          </div>
        )}

        {/* Init button */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.button
              key="init-btn"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={handleInit}
              className="pointer-events-auto relative overflow-hidden rounded-full px-8 py-4 text-[14px] font-semibold text-[#0A0A0F] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #00D4AA 0%, #8B5CF6 100%)",
                boxShadow: "0 0 30px rgba(0,212,170,0.35), 0 0 60px rgba(139,92,246,0.15)",
                fontFamily: "var(--font-dm-sans)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Initialise Visualisation
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scroll hint */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-10 flex flex-col items-center gap-2"
            >
              <p
                className="text-[11px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-dm-sans)" }}
              >
                Scroll to learn more
              </p>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                style={{ color: "rgba(0,212,170,0.5)" }}
              >
                ↓
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Below-fold ── */}
      <div className="relative z-10 min-h-screen bg-gradient-to-b from-[#06030F] via-[#0A0618] to-[#0D0A1A] px-6 py-32">
        <div className="mx-auto max-w-5xl">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-20 text-center"
          >
            <p
              className="mb-4 text-[11px] tracking-[0.35em] uppercase"
              style={{ color: "rgba(0,212,170,0.6)", fontFamily: "var(--font-dm-sans)" }}
            >
              What You Just Saw
            </p>
            <h2
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 700,
                fontSize: "clamp(28px, 4vw, 52px)",
                lineHeight: 1.15,
                color: "#ffffff",
                letterSpacing: "-0.025em",
              }}
            >
              Integration that adapts to you —<br />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>not the other way around.</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "⚡",
                title: "Real-Time Data Flow",
                body: "Watch live data move between HIS, EHR, billing, labs, and pharmacy systems simultaneously — no batch processing, no overnight jobs, no gaps in the record.",
                color: { r: 0, g: 212, b: 170 },
              },
              {
                icon: "🔌",
                title: "Plug-In Any AI Tool",
                body: "Radiology AI, clinical decision support, predictive analytics — connect any AI product to your hospital's existing infrastructure without custom builds or vendor lock-in.",
                color: { r: 139, g: 92, b: 246 },
              },
              {
                icon: "🔄",
                title: "Self-Healing Networks",
                body: "When systems update, APIs change, or new tools come online, the platform automatically adapts routing and maintains data flow without manual intervention.",
                color: { r: 34, g: 211, b: 238 },
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="rounded-2xl p-8"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${rgba(card.color.r, card.color.g, card.color.b, 0.15)}`,
                }}
              >
                <div className="mb-5 text-3xl">{card.icon}</div>
                <h3
                  className="mb-3 text-[17px] font-bold"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: rgba(card.color.r, card.color.g, card.color.b, 0.95),
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-dm-sans)" }}
                >
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-24 flex flex-col items-center gap-6 text-center"
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 600,
                fontSize: "clamp(18px, 2.5vw, 28px)",
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "-0.015em",
              }}
            >
              Ready to connect your systems —<br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>and the AI tools that will transform them?</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="rounded-full px-7 py-3.5 text-[14px] font-bold text-[#0A0A0F] transition-all duration-300 hover:opacity-90"
                style={{
                  background: "#00D4AA",
                  fontFamily: "var(--font-dm-sans)",
                  boxShadow: "0 0 24px rgba(0,212,170,0.4)",
                }}
              >
                Book a Demo
              </a>
              <Link
                href="/"
                className="rounded-full px-7 py-3.5 text-[14px] font-medium text-white transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.04)",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
