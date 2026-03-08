'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Cluster definitions ────────────────────────────────────────────────────────
// cx/cy as fraction of viewport. ordered=true → teal family, false → purple family
const CLUSTERS = [
  { label: 'HIS',         cx: 0.20, cy: 0.60, ordered: true,  n: 50, r: 16,  g: 185, b: 129  },
  { label: 'EHR',         cx: 0.38, cy: 0.74, ordered: true,  n: 50, r: 0,   g: 255, b: 208  },
  { label: 'BILLING',     cx: 0.16, cy: 0.38, ordered: true,  n: 44, r: 14,  g: 165, b: 233  },
  { label: 'LAB SYSTEMS', cx: 0.68, cy: 0.30, ordered: false, n: 52, r: 139, g: 92,  b: 246  },
  { label: 'PHARMACY',    cx: 0.82, cy: 0.64, ordered: false, n: 44, r: 167, g: 139, b: 250  },
] as const;

// ── Types ──────────────────────────────────────────────────────────────────────
interface Neuron {
  id:        number;
  x:         number;
  y:         number;
  homeX:     number;
  homeY:     number;
  clusterId: number;
  ordered:   boolean;
  vx:        number;
  vy:        number;
  // Six sine seeds for drift (3 per axis, incommensurate freqs → never repeating)
  s:         [number, number, number, number, number, number];
  // Cross-cluster influence (from original Entropy mechanic)
  influence: number;
  // Potential / firing
  potential: number;
  pFreq1:    number;
  pFreq2:    number;
  pPhase1:   number;
  pPhase2:   number;
  fireTimer: number;   // countdown from 30
  // RGB colour
  cr: number;
  cg: number;
  cb: number;
  neighbors: number[];
}

interface Pulse {
  fromId: number;
  toId:   number;
  t:      number;
  speed:  number;
  cpBase: number;  // Bézier control-point perpendicular offset
  cpSeed: number;  // drift seed for the offset
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const rng = () => Math.random();
const TAU = Math.PI * 2;

function qBez(
  t: number,
  x0: number, y0: number,
  cpx: number, cpy: number,
  x1: number, y1: number,
) {
  const m = 1 - t;
  return { x: m*m*x0 + 2*m*t*cpx + t*t*x1, y: m*m*y0 + 2*m*t*cpy + t*t*y1 };
}

function bezierCP(ax: number, ay: number, bx: number, by: number, offset: number) {
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  const dx = bx - ax,       dy = by - ay;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  return { cpx: mx - dy/len * offset, cpy: my + dx/len * offset };
}

function clamp255(n: number) {
  return Math.round(Math.max(0, Math.min(255, n)));
}

// ── Neural canvas ──────────────────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ── Build neurons ────────────────────────────────────────────────────────
    const neurons: Neuron[] = [];
    let uid = 0;

    for (let ci = 0; ci < CLUSTERS.length; ci++) {
      const def = CLUSTERS[ci];
      const spread = Math.min(W, H) * 0.19;
      for (let i = 0; i < def.n; i++) {
        const angle = rng() * TAU;
        const r     = Math.sqrt(rng()) * spread; // uniform disk distribution
        const hx    = def.cx * W + Math.cos(angle) * r;
        const hy    = def.cy * H + Math.sin(angle) * r;
        neurons.push({
          id: uid++,
          x: hx, y: hy, homeX: hx, homeY: hy,
          clusterId: ci, ordered: def.ordered,
          vx: 0, vy: 0,
          s: [rng()*TAU, rng()*TAU, rng()*TAU, rng()*TAU, rng()*TAU, rng()*TAU],
          influence: 0,
          potential: rng() * 0.5,
          pFreq1:  0.004 + rng() * 0.008,
          pFreq2:  0.011 + rng() * 0.012,
          pPhase1: rng() * TAU,
          pPhase2: rng() * TAU,
          fireTimer: 0,
          cr: def.r, cg: def.g, cb: def.b,
          neighbors: [],
        });
      }
    }

    const TOTAL = neurons.length;

    // ── Connection Bézier offset cache (stable per pair) ────────────────────
    // Key: min(a,b)*1000 + max(a,b)  — collision-free for N < 1000
    const cpCache = new Map<number, { base: number; seed: number }>();
    const cpKey   = (a: number, b: number) => Math.min(a, b) * 1000 + Math.max(a, b);

    const getCP = (n: Neuron, m: Neuron, frame: number) => {
      const k = cpKey(n.id, m.id);
      let entry = cpCache.get(k);
      if (!entry) {
        entry = { base: (rng() - 0.5) * 80, seed: rng() * TAU };
        cpCache.set(k, entry);
      }
      // Control point slowly breathes over time
      const liveOffset = entry.base + 16 * Math.sin(frame * 0.0041 + entry.seed);
      return bezierCP(n.x, n.y, m.x, m.y, liveOffset);
    };

    // ── Neighbor rebuild (throttled) ─────────────────────────────────────────
    const neighborDist = () => Math.min(W, H) * 0.22;

    const buildNeighbors = () => {
      const nd = neighborDist();
      for (const n of neurons) {
        const nearby: { id: number; d: number }[] = [];
        for (let j = 0; j < TOTAL; j++) {
          if (j === n.id) continue;
          const m  = neurons[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < nd) nearby.push({ id: j, d });
        }
        nearby.sort((a, b) => a.d - b.d);
        n.neighbors = nearby.slice(0, 5).map(e => e.id);
        // Seed cp cache for new pairs
        for (const id of n.neighbors) {
          const k = cpKey(n.id, id);
          if (!cpCache.has(k)) cpCache.set(k, { base: (rng()-0.5)*80, seed: rng()*TAU });
        }
      }
    };
    buildNeighbors();

    // ── Pulses ───────────────────────────────────────────────────────────────
    const pulses: Pulse[] = [];
    const MAX_PULSES = 120;

    const fireNeuron = (n: Neuron, frame: number) => {
      if (n.fireTimer > 0) return;
      n.potential  = 1.0;
      n.fireTimer  = 30;
      // Cascade: push energy into neighbors
      for (const nid of n.neighbors) {
        neurons[nid].potential = Math.min(1.0, neurons[nid].potential + 0.30);
      }
      // Spawn travel pulses
      if (pulses.length < MAX_PULSES) {
        for (const nid of n.neighbors) {
          if (pulses.length >= MAX_PULSES) break;
          const k     = cpKey(n.id, nid);
          const entry = cpCache.get(k);
          if (!entry) continue;
          pulses.push({
            fromId: n.id, toId: nid,
            t: 0, speed: 0.013 + rng() * 0.009,
            cpBase: entry.base, cpSeed: entry.seed,
          });
        }
      }
      void frame; // used only for context; pulses carry their own cp data
    };

    // ── Animation loop ───────────────────────────────────────────────────────
    let frame = 0, animId = 0;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // ── Background ────────────────────────────────────────────────────────
      ctx.fillStyle = '#08080D';
      ctx.fillRect(0, 0, W, H);

      // Radial vignette: lighter at centre, dark edges
      const vg = ctx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, Math.max(W, H)*0.72);
      vg.addColorStop(0,   'rgba(13,13,20,0.5)');
      vg.addColorStop(0.5, 'rgba(8,8,13,0)');
      vg.addColorStop(1,   'rgba(0,0,5,0.65)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // Faint dot grid — lower-left quadrant, fades toward upper-right
      for (let gx = 0; gx < W * 0.65; gx += 38) {
        for (let gy = H * 0.22; gy < H; gy += 38) {
          const fx = 1 - gx / (W * 0.65);
          const fy = (gy / H - 0.22) / 0.78;
          const a  = fx * fy * 0.055;
          if (a < 0.003) continue;
          ctx.beginPath();
          ctx.arc(gx, gy, 0.7, 0, TAU);
          ctx.fillStyle = `rgba(0,212,170,${a})`;
          ctx.fill();
        }
      }

      // ── Throttled neighbor rebuild ────────────────────────────────────────
      if (frame % 30 === 0) buildNeighbors();

      // ── Update neurons ────────────────────────────────────────────────────
      const nd = neighborDist();

      for (const n of neurons) {
        // Sine-wave drift with incommensurate frequencies (never repeating)
        const driftX =
          0.32 * Math.sin(frame * 0.0071 + n.s[0]) +
          0.20 * Math.sin(frame * 0.0133 + n.s[1]) +
          0.14 * Math.cos(frame * 0.0237 + n.s[2]);
        const driftY =
          0.32 * Math.sin(frame * 0.0091 + n.s[3]) +
          0.20 * Math.cos(frame * 0.0157 + n.s[4]) +
          0.14 * Math.sin(frame * 0.0271 + n.s[5]);

        // Spring toward home — teal clusters tighter, purple looser
        const k  = n.ordered ? 0.022 : 0.010;
        const sx = (n.homeX - n.x) * k;
        const sy = (n.homeY - n.y) * k;

        // Cross-cluster neighbor influence (original Entropy mechanic)
        // Nearby neurons from OTHER clusters push their velocity into this one,
        // creating interference patterns at cluster boundaries
        let cx = 0, cy = 0, maxInf = 0;
        for (const nid of n.neighbors) {
          const nb = neurons[nid];
          if (nb.clusterId === n.clusterId) continue;
          const dx  = n.x - nb.x, dy = n.y - nb.y;
          const d   = Math.sqrt(dx*dx + dy*dy) || 1;
          const str = Math.max(0, 1 - d / nd);
          cx      += nb.vx * str;
          cy      += nb.vy * str;
          maxInf   = Math.max(maxInf, str);
        }
        n.influence = Math.max(n.influence, maxInf);

        // Combine: spring (modulated by influence) + cross-cluster chaos + drift
        n.vx = sx * (1 - n.influence) + cx * n.influence * 0.35 + driftX;
        n.vy = sy * (1 - n.influence) + cy * n.influence * 0.35 + driftY;
        n.influence *= 0.98; // decay (from original)

        n.x += n.vx;
        n.y += n.vy;

        // Soft boundary
        const pad = 30;
        if (n.x < pad)     n.x += (pad     - n.x) * 0.08;
        if (n.x > W - pad) n.x += (W - pad - n.x) * 0.08;
        if (n.y < pad)     n.y += (pad     - n.y) * 0.08;
        if (n.y > H - pad) n.y += (H - pad - n.y) * 0.08;

        // Potential fluctuation — layered sine waves
        n.potential +=
          0.25 * Math.sin(frame * n.pFreq1 + n.pPhase1) * 0.012 +
          0.18 * Math.sin(frame * n.pFreq2 + n.pPhase2) * 0.009;
        n.potential = Math.max(0, Math.min(1, n.potential));

        // Auto-fire at threshold — teal more rhythmic, purple more sporadic
        if (n.potential > 0.72 && n.fireTimer === 0) {
          if (Math.random() < (n.ordered ? 0.05 : 0.02)) fireNeuron(n, frame);
        }
        if (n.fireTimer > 0) {
          n.fireTimer--;
          n.potential = Math.max(0, n.potential - 0.022);
        }
      }

      // ── Draw connections (NO shadowBlur here — too expensive) ─────────────
      ctx.shadowBlur = 0;
      ctx.lineWidth  = 0.9;

      for (const n of neurons) {
        for (const nid of n.neighbors) {
          if (nid <= n.id) continue; // deduplicate each pair
          const m = neurons[nid];
          const { cpx, cpy } = getCP(n, m, frame);

          const firing    = n.fireTimer > 0 || m.fireTimer > 0;
          const baseAlpha = 0.09 + Math.max(n.potential, m.potential) * 0.07 + (firing ? 0.10 : 0);
          const cr        = (n.cr + m.cr) >> 1;
          const cg        = (n.cg + m.cg) >> 1;
          const cb        = (n.cb + m.cb) >> 1;

          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${baseAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.quadraticCurveTo(cpx, cpy, m.x, m.y);
          ctx.stroke();
        }
      }

      // ── Update & draw pulses ──────────────────────────────────────────────
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p    = pulses[i];
        p.t       += p.speed;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }

        const from = neurons[p.fromId];
        const to   = neurons[p.toId];
        if (!from || !to) { pulses.splice(i, 1); continue; }

        const liveOff    = p.cpBase + 16 * Math.sin(frame * 0.0041 + p.cpSeed);
        const { cpx, cpy } = bezierCP(from.x, from.y, to.x, to.y, liveOff);
        const pos        = qBez(p.t, from.x, from.y, cpx, cpy, to.x, to.y);
        const trail      = qBez(Math.max(0, p.t - 0.10), from.x, from.y, cpx, cpy, to.x, to.y);

        // Glowing trail
        const grad = ctx.createLinearGradient(trail.x, trail.y, pos.x, pos.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, 'rgba(255,255,255,0.65)');
        ctx.beginPath();
        ctx.moveTo(trail.x, trail.y);
        ctx.lineTo(pos.x,   pos.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // Head dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.0, 0, TAU);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fill();
      }

      // ── Draw neurons ──────────────────────────────────────────────────────
      for (const n of neurons) {
        const fi    = n.fireTimer / 30;           // 0..1 while firing
        const r     = 2.8 + fi * 1.8;
        const alpha = 0.35 + n.potential * 0.50 + fi * 0.20;

        // Glow — only pay the shadowBlur cost when necessary
        if (n.fireTimer > 0) {
          ctx.shadowBlur  = 12 + fi * 14;
          ctx.shadowColor = `rgba(${n.cr},${n.cg},${n.cb},0.9)`;
        } else if (n.potential > 0.55) {
          ctx.shadowBlur  = 5;
          ctx.shadowColor = `rgba(${n.cr},${n.cg},${n.cb},0.5)`;
        } else {
          ctx.shadowBlur = 0;
        }

        // Brief white flash at firing peak
        let fillStyle: string;
        if (fi > 0.60) {
          const t  = (fi - 0.60) / 0.40;
          const fr = clamp255(n.cr + (255 - n.cr) * t);
          const fg = clamp255(n.cg + (255 - n.cg) * t);
          const fb = clamp255(n.cb + (255 - n.cb) * t);
          fillStyle = `rgba(${fr},${fg},${fb},${Math.min(1, alpha + 0.2)})`;
        } else {
          fillStyle = `rgba(${n.cr},${n.cg},${n.cb},${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, TAU);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // ── Cluster labels (on canvas, drift with centroid) ───────────────────
      ctx.font      = '10px "Space Mono","Courier New",monospace';
      ctx.textAlign = 'center';

      for (let ci = 0; ci < CLUSTERS.length; ci++) {
        const def = CLUSTERS[ci];
        const cn  = neurons.filter(n => n.clusterId === ci);
        if (!cn.length) continue;

        let cxAvg = 0, cyAvg = 0;
        for (const n of cn) { cxAvg += n.x; cyAvg += n.y; }
        cxAvg /= cn.length;
        cyAvg /= cn.length;

        let maxR = 0;
        for (const n of cn) {
          const d = Math.hypot(n.x - cxAvg, n.y - cyAvg);
          if (d > maxR) maxR = d;
        }

        ctx.fillStyle = `rgba(${def.r},${def.g},${def.b},0.28)`;
        ctx.fillText(def.label, cxAvg, cyAvg - maxR - 14);
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const pw = W, ph = H;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      for (const n of neurons) {
        n.homeX = (n.homeX / pw) * W;
        n.homeY = (n.homeY / ph) * H;
        n.x     = n.homeX;
        n.y     = n.homeY;
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

// ── Feature card data ──────────────────────────────────────────────────────────
const CARDS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFD0" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: 'Real-Time Data Flow',
    desc:  'Data packets traverse between connected hospital systems — HIS to EHR to billing — with zero manual handoffs.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFD0" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'Adaptive Integration',
    desc:  'The AI layer learns system patterns and optimises routing, even when legacy systems behave unpredictably.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFD0" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Self-Healing Networks',
    desc:  'The platform automatically reroutes and recovers when connections drop or systems go offline.',
  },
] as const;

// ── Page ───────────────────────────────────────────────────────────────────────
const HEADLINES = [
  'See AI Integration in Action',
  'Connecting Every System',
  'Unifying Patient Data Flows',
  'Intelligence Across Silos',
];

export default function DemoPage() {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeadlineIndex(prev => (prev + 1) % HEADLINES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative min-h-screen"
      style={{ background: '#08080D', fontFamily: "'Inter',system-ui,-apple-system,sans-serif" }}
    >
      {/* Canvas fills the screen behind everything */}
      <NeuralCanvas />

      {/* ── Fixed top bar ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/75 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-[#10B981] opacity-50" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-white">Adopt AI</span>
          </Link>
        </div>
        <a
          href="#"
          className="rounded-full px-5 py-2 text-[13px] font-semibold text-[#08080D]"
          style={{ background: '#10B981', boxShadow: '0 0 18px rgba(16,185,129,0.35)' }}
        >
          Book a Demo
        </a>
      </nav>

      {/* ── First viewport: hero text overlay ─────────────────────────────── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 pt-24 pb-12 pointer-events-none">
        {/* Top spacer */}
        <div />

        {/* Centre content */}
        <div className="flex flex-col items-center text-center gap-4">
          {/* LIVE SIMULATION label — blur-fades in first */}
          <motion.p
            className="text-[11px] tracking-[0.3em] uppercase font-medium"
            style={{ color: '#10B981', fontFamily: "'Space Mono','Courier New',monospace" }}
            initial={{ opacity: 0, filter: 'blur(4px)', y: 4 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          >
            Live Simulation
          </motion.p>

          {/* Cycling headline — fixed-height container prevents layout shift */}
          <div className="flex items-center justify-center min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={headlineIndex}
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white max-w-2xl leading-tight"
                style={{ textShadow: '0 0 48px rgba(0,0,0,0.9)' }}
                initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -8 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {HEADLINES[headlineIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subtitle — blur-fades in once on load */}
          <motion.p
            className="text-base max-w-md leading-relaxed"
            style={{ color: '#9CA3AF', textShadow: '0 0 24px rgba(0,0,0,0.95)' }}
            initial={{ opacity: 0, filter: 'blur(6px)', y: 6 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
          >
            Watch how Adopt AI connects fragmented hospital systems into a unified intelligence layer.
          </motion.p>
        </div>

        {/* Bottom: stats + scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, filter: 'blur(4px)', y: 4 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.6, delay: 1.6, ease: 'easeOut' }}
        >
          <p
            className="text-[11px] tracking-[0.2em] uppercase"
            style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'Space Mono','Courier New',monospace" }}
          >
            5 Systems · 240 Nodes · Real-Time Sync
          </p>
          <div className="flex flex-col items-center gap-1.5">
            <span
              className="text-[9px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.18)', fontFamily: "'Space Mono','Courier New',monospace" }}
            >
              Scroll Down
            </span>
            {/* CSS-only bounce — no JS */}
            <svg
              className="animate-bounce"
              width="12" height="8" viewBox="0 0 12 8" fill="none"
              style={{ color: 'rgba(255,255,255,0.18)' }}
            >
              <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ── Below fold: cards + CTA ───────────────────────────────────────── */}
      <section
        className="relative z-10 px-6 pb-20"
        style={{ background: '#08080D', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="mx-auto max-w-5xl pt-16">

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {CARDS.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl p-6 flex flex-col gap-3"
                style={{ background: '#111118', border: '1px solid #1E293B' }}
              >
                <div>{icon}</div>
                <h3 className="text-white font-semibold text-sm">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className="text-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3rem' }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
              Ready to connect your systems?
            </h2>
            <a
              href="#"
              className="inline-flex items-center rounded-full px-8 py-3.5 text-sm font-bold text-[#08080D]"
              style={{ background: '#10B981', boxShadow: '0 0 24px rgba(16,185,129,0.4)' }}
            >
              Book a Demo
            </a>
            <p className="mt-10 text-[11px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
              © 2025 OneMed AI. All rights reserved.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
