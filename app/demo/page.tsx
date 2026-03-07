'use client';

import { useEffect, useRef } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

const C_TEAL   = '#00FFD0';
const C_PURPLE = '#8B5CF6';
const C_GREEN  = '#10B981';
const C_WHITE  = '#FFFFFF';
const BG       = '#0A0A0F';

const CLUSTER_DEFS = [
  { label: 'HIS',          rx: 0.10, ry: 0.38, ordered: true,  count: 28 },
  { label: 'EHR',          rx: 0.28, ry: 0.65, ordered: true,  count: 28 },
  { label: 'Billing',      rx: 0.46, ry: 0.28, ordered: true,  count: 24 },
  { label: 'Lab Systems',  rx: 0.70, ry: 0.58, ordered: false, count: 24 },
  { label: 'Pharmacy',     rx: 0.86, ry: 0.30, ordered: false, count: 20 },
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Neuron {
  id:       number;
  x:        number;
  y:        number;
  baseX:    number;
  baseY:    number;
  clusterId: number;
  ordered:  boolean;
  potential: number;
  fireTimer: number;
  freq:     number;
  amp:      number;
  phaseX:   number;
  phaseY:   number;
  vx:       number;
  vy:       number;
  connections: number[];
}

interface Pulse {
  fromId:   number;
  toId:     number;
  t:        number;
  speed:    number;
  color:    string;
  cpx:      number;
  cpy:      number;
}

interface DeferredFire {
  id:    number;
  frame: number;
}

interface Commands {
  addConnection:    () => void;
  triggerSync:      () => void;
  injectDisruption: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function qBez(
  t: number,
  x0: number, y0: number,
  cpx: number, cpy: number,
  x1: number, y1: number,
) {
  const mt = 1 - t;
  return {
    x: mt * mt * x0 + 2 * mt * t * cpx + t * t * x1,
    y: mt * mt * y0 + 2 * mt * t * cpy + t * t * y1,
  };
}

function getCP(
  ax: number, ay: number,
  bx: number, by: number,
  offset: number,
): { cpx: number; cpy: number } {
  const mx  = (ax + bx) / 2;
  const my  = (ay + by) / 2;
  const dx  = bx - ax;
  const dy  = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { cpx: mx + (-dy / len) * offset, cpy: my + (dx / len) * offset };
}

function hex2(n: number) {
  return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
}

// ─── Neural Visualization ────────────────────────────────────────────────────

function NeuralViz({ commandsRef }: { commandsRef: React.MutableRefObject<Commands> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ── Build neurons ────────────────────────────────────────────
    const neurons: Neuron[] = [];
    let uid = 0;

    for (let ci = 0; ci < CLUSTER_DEFS.length; ci++) {
      const def = CLUSTER_DEFS[ci];
      const spread = Math.min(W, H) * 0.09;
      for (let i = 0; i < def.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r     = Math.random() * spread;
        const bx    = def.rx * W + Math.cos(angle) * r;
        const by    = def.ry * H + Math.sin(angle) * r;
        neurons.push({
          id: uid++,
          x: bx, y: by, baseX: bx, baseY: by,
          clusterId: ci,
          ordered:   def.ordered,
          potential: Math.random() * 0.4,
          fireTimer: 0,
          freq:      0.003 + Math.random() * 0.005,
          amp:       2 + Math.random() * 4,
          phaseX:    Math.random() * Math.PI * 2,
          phaseY:    Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          connections: [],
        });
      }
    }

    // ── Connections & CP offsets ─────────────────────────────────
    // cpOffsets: stored per-pair so curves are stable across frames
    const cpOffsets = new Map<string, number>();

    const buildConnections = () => {
      for (const n of neurons) {
        const sorted = neurons
          .filter(m => m.id !== n.id)
          .map(m => ({ id: m.id, d: Math.hypot(n.x - m.x, n.y - m.y) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 4)
          .map(d => d.id);
        n.connections = sorted;
        for (const nid of sorted) {
          const key = `${Math.min(n.id, nid)}_${Math.max(n.id, nid)}`;
          if (!cpOffsets.has(key)) {
            cpOffsets.set(key, (Math.random() - 0.5) * 70);
          }
        }
      }
    };
    buildConnections();

    const cpKey     = (a: number, b: number) => `${Math.min(a, b)}_${Math.max(a, b)}`;
    const getOffset = (a: number, b: number) => cpOffsets.get(cpKey(a, b)) ?? 0;

    // ── Pulses & deferred fires ──────────────────────────────────
    const pulses:   Pulse[]         = [];
    const deferred: DeferredFire[]  = [];
    let   disruptionFrames = 0;

    const addPulse = (from: Neuron, to: Neuron, color: string) => {
      if (pulses.length > 90) return; // cap for performance
      const offset = getOffset(from.id, to.id);
      const { cpx, cpy } = getCP(from.x, from.y, to.x, to.y, offset);
      pulses.push({ fromId: from.id, toId: to.id, t: 0, speed: 0.012 + Math.random() * 0.007, color, cpx, cpy });
    };

    let currentFrame = 0;

    const fireNeuron = (n: Neuron, cascade: boolean) => {
      if (n.fireTimer > 0) return;
      n.potential = 1.0;
      n.fireTimer = 12;
      if (cascade) {
        for (const nid of n.connections) {
          const nb = neurons[nid];
          if (!nb) continue;
          addPulse(n, nb, n.ordered ? C_TEAL : C_PURPLE);
          deferred.push({ id: nid, frame: currentFrame + 18 + Math.floor(Math.random() * 14) });
        }
      }
    };

    // ── Expose commands to React ─────────────────────────────────
    commandsRef.current = {
      addConnection: () => {
        const ordered = neurons.filter(n => n.ordered);
        const chaotic = neurons.filter(n => !n.ordered);
        const a = ordered[Math.floor(Math.random() * ordered.length)];
        const b = chaotic[Math.floor(Math.random() * chaotic.length)];
        if (!a || !b) return;
        if (!a.connections.includes(b.id)) a.connections.push(b.id);
        if (!b.connections.includes(a.id)) b.connections.push(a.id);
        cpOffsets.set(cpKey(a.id, b.id), (Math.random() - 0.5) * 80);
        addPulse(a, b, C_GREEN);
        fireNeuron(a, false);
        fireNeuron(b, false);
      },
      triggerSync: () => {
        const ordered = neurons.filter(n => n.ordered);
        ordered.forEach((n, i) => {
          deferred.push({ id: n.id, frame: currentFrame + i * 2 });
        });
      },
      injectDisruption: () => {
        disruptionFrames = 220;
        for (const n of neurons.filter(n => !n.ordered)) {
          n.vx += (Math.random() - 0.5) * 9;
          n.vy += (Math.random() - 0.5) * 9;
          n.potential = Math.random();
        }
      },
    };

    // ── Animation loop ───────────────────────────────────────────
    let animId = 0;

    const animate = () => {
      currentFrame++;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Faint grid — ordered zone only, fades toward boundary
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W * 0.62; gx += 38) {
        const a = (1 - gx / (W * 0.62)) * 0.035;
        ctx.strokeStyle = `rgba(0,212,170,${a})`;
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 38) {
        ctx.strokeStyle = 'rgba(0,212,170,0.018)';
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W * 0.62, gy); ctx.stroke();
      }

      // Radial vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(10,10,15,0.5)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // ── Process deferred fires ───────────────────────────────
      for (let i = deferred.length - 1; i >= 0; i--) {
        if (currentFrame >= deferred[i].frame) {
          const n = neurons[deferred[i].id];
          if (n) {
            n.potential = Math.min(1.0, n.potential + 0.4);
            if (n.potential > 0.6 && n.fireTimer === 0) fireNeuron(n, true);
          }
          deferred.splice(i, 1);
        }
      }

      // Occasionally rebuild connections (throttled)
      if (currentFrame % 90 === 0) buildConnections();

      // ── Update neurons ───────────────────────────────────────
      for (const n of neurons) {
        if (n.ordered) {
          // Smooth sine drift around base position
          n.x = n.baseX + Math.sin(currentFrame * n.freq       + n.phaseX) * n.amp;
          n.y = n.baseY + Math.sin(currentFrame * n.freq * 1.3 + n.phaseY) * n.amp;
        } else {
          const chaos = disruptionFrames > 0 ? 2.2 : 1.0;
          n.vx += (Math.random() - 0.5) * 0.4 * chaos;
          n.vy += (Math.random() - 0.5) * 0.4 * chaos;
          n.vx *= 0.94; n.vy *= 0.94;
          n.x  += n.vx; n.y  += n.vy;
          // Soft pull back to base
          n.x += (n.baseX - n.x) * 0.004;
          n.y += (n.baseY - n.y) * 0.004;
          // Keep in right 40%
          const minX = W * 0.55;
          if (n.x < minX) { n.vx += 0.6; n.x = minX; }
          if (n.x > W - 5) n.vx -= 0.6;
          if (n.y < 5)     n.vy += 0.6;
          if (n.y > H - 5) n.vy -= 0.6;
        }

        // Layered sine potential fluctuation
        n.potential +=
          (Math.sin(currentFrame * n.freq * 2   + n.phaseX) * 0.06 +
           Math.sin(currentFrame * n.freq * 5.1 + n.phaseY) * 0.03) * 0.012;
        n.potential = Math.max(0, Math.min(1, n.potential));

        // Auto-fire at threshold
        if (n.potential > 0.72 && n.fireTimer === 0) {
          if (Math.random() < (n.ordered ? 0.04 : 0.02)) fireNeuron(n, true);
        }
        if (n.fireTimer > 0) n.fireTimer--;
        if (n.potential > 0.5) n.potential -= 0.006;
      }

      if (disruptionFrames > 0) disruptionFrames--;

      // ── Draw connections (Bézier) ────────────────────────────
      ctx.lineWidth = 0.8;
      for (const n of neurons) {
        for (const nid of n.connections) {
          if (nid <= n.id) continue; // deduplicate
          const m = neurons[nid];
          if (!m) continue;
          const offset = getOffset(n.id, m.id);
          const { cpx, cpy } = getCP(n.x, n.y, m.x, m.y, offset);
          const isCross = n.ordered !== m.ordered;
          const alpha   = isCross ? 0.18 : n.ordered ? 0.12 : 0.09;
          ctx.strokeStyle = n.ordered
            ? `rgba(0,212,170,${alpha})`
            : `rgba(139,92,246,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.quadraticCurveTo(cpx, cpy, m.x, m.y);
          ctx.stroke();
        }
      }

      // ── Update & draw pulses ─────────────────────────────────
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }

        const from = neurons[p.fromId];
        const to   = neurons[p.toId];
        if (!from || !to) { pulses.splice(i, 1); continue; }

        const pos   = qBez(p.t,              from.x, from.y, p.cpx, p.cpy, to.x, to.y);
        const trail = qBez(Math.max(0, p.t - 0.09), from.x, from.y, p.cpx, p.cpy, to.x, to.y);

        // Glowing trail
        const grad = ctx.createLinearGradient(trail.x, trail.y, pos.x, pos.y);
        grad.addColorStop(0, `${p.color}00`);
        grad.addColorStop(1, `${p.color}BB`);
        ctx.beginPath();
        ctx.moveTo(trail.x, trail.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 2;
        ctx.stroke();

        // Bright head dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle   = p.color;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Draw neurons ─────────────────────────────────────────
      for (const n of neurons) {
        const firing = n.fireTimer > 0;
        const fi     = n.fireTimer / 12;
        const r      = 2.5 + fi * 2.5;
        const color  = n.ordered ? C_TEAL : C_PURPLE;
        const alpha  = 0.35 + n.potential * 0.45 + fi * 0.3;

        ctx.shadowBlur  = firing ? 20 : (n.potential > 0.55 ? 7 : 0);
        ctx.shadowColor = color;

        // Halo
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.5);
        halo.addColorStop(0, `${color}${hex2((firing ? 0.4 : 0.14) * 255)}`);
        halo.addColorStop(1, `${color}00`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = firing ? C_WHITE : `${color}${hex2(alpha * 255)}`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Cluster labels ───────────────────────────────────────
      ctx.font      = '10px "Inter", system-ui, sans-serif';
      ctx.textAlign = 'center';
      for (let ci = 0; ci < CLUSTER_DEFS.length; ci++) {
        const def = CLUSTER_DEFS[ci];
        const cn  = neurons.filter(n => n.clusterId === ci);
        if (!cn.length) continue;
        const cx = cn.reduce((s, n) => s + n.x, 0) / cn.length;
        const cy = cn.reduce((s, n) => s + n.y, 0) / cn.length;
        // push label above the cluster bounding radius
        let maxR = 0;
        for (const n of cn) {
          const d = Math.hypot(n.x - cx, n.y - cy);
          if (d > maxR) maxR = d;
        }
        ctx.fillStyle = def.ordered
          ? 'rgba(0,255,208,0.48)'
          : 'rgba(139,92,246,0.48)';
        ctx.fillText(def.label.toUpperCase(), cx, cy - maxR - 12);
      }

      // ── Dividing line ────────────────────────────────────────
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx.lineWidth   = 1;
      ctx.setLineDash([3, 9]);
      ctx.beginPath();
      ctx.moveTo(W * 0.60, 0);
      ctx.lineTo(W * 0.60, H);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const prevW = W;
      const prevH = H;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      // Remap base positions proportionally
      for (const n of neurons) {
        n.baseX = (n.baseX / prevW) * W;
        n.baseY = (n.baseY / prevH) * H;
        n.x = n.baseX;
        n.y = n.baseY;
      }
      buildConnections();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [commandsRef]);

  return (
    <div ref={wrapRef} className="w-full h-full">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

// ─── Demo Page ───────────────────────────────────────────────────────────────

const FEATURE_CARDS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFD0" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: 'Real-Time Data Flow',
    desc:  'Watch live data packets traverse between connected hospital systems — HIS to EHR to billing — with zero manual handoffs.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFD0" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'Adaptive Integration',
    desc:  'See how the AI layer learns system patterns and optimises routing, even when legacy systems behave unpredictably.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFD0" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Self-Healing Networks',
    desc:  'Observe the platform automatically reroute and recover when connections drop or systems go offline.',
  },
];

const CONTROLS = [
  { label: '+ Add Connection',    key: 'addConnection'    as const, color: C_GREEN  },
  { label: '⚡ Trigger Sync',     key: 'triggerSync'      as const, color: C_TEAL   },
  { label: '↯ Inject Disruption', key: 'injectDisruption' as const, color: C_PURPLE },
];

export default function DemoPage() {
  const commandsRef = useRef<Commands>({
    addConnection:    () => {},
    triggerSync:      () => {},
    injectDisruption: () => {},
  });

  return (
    <div
      className="min-h-screen bg-[#0A0A0F] text-white"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-5">
          <a
            href="/"
            className="text-sm text-white/40 hover:text-white/75 transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </a>
          <a href="/" className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            </span>
            <span className="text-[15px] font-bold tracking-tight">Adopt AI</span>
          </a>
        </div>
        <a
          href="#"
          className="inline-flex items-center rounded-full px-5 py-2 text-[13px] font-semibold text-[#0A0A0F]"
          style={{ background: '#10B981', boxShadow: '0 0 18px rgba(16,185,129,0.35)' }}
        >
          Book a Demo
        </a>
      </nav>

      {/* ── Visualization + overlay text ────────────────────────── */}
      <div className="relative w-full" style={{ height: '650px' }}>
        <NeuralViz commandsRef={commandsRef} />

        {/* Overlay text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
          style={{ paddingBottom: '80px' }}
        >
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-3"
            style={{ color: '#10B981', fontFamily: "'Space Mono', monospace" }}
          >
            Live Simulation
          </p>
          <h1
            className="text-3xl md:text-5xl font-semibold text-center mb-3"
            style={{ textShadow: '0 0 48px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.9)' }}
          >
            See AI Integration in Action
          </h1>
          <p
            className="text-sm md:text-base text-center max-w-md px-6"
            style={{ color: '#9CA3AF', textShadow: '0 0 20px rgba(0,0,0,0.95)' }}
          >
            Watch how Adopt AI connects fragmented hospital systems into a unified intelligence layer.
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0A0A0F, transparent)' }}
        />
      </div>

      {/* ── Interactive controls ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3 px-6 py-8">
        {CONTROLS.map(({ label, key, color }) => (
          <button
            key={key}
            onClick={() => commandsRef.current[key]()}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{ background: '#111118', border: '1px solid #1E293B', color: '#9CA3AF' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = color;
              el.style.color       = color;
              el.style.boxShadow   = `0 0 14px ${color}30`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = '#1E293B';
              el.style.color       = '#9CA3AF';
              el.style.boxShadow   = 'none';
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Legend ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-6 pb-8">
        {[
          { color: C_TEAL,   label: 'Integrated Systems' },
          { color: C_PURPLE, label: 'Legacy / Fragmented' },
          { color: C_GREEN,  label: 'New Connections' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
            {label}
          </div>
        ))}
      </div>

      {/* ── Feature cards ────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 md:px-12 pb-16 max-w-5xl mx-auto"
      >
        {FEATURE_CARDS.map(({ icon, title, desc }) => (
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

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <div
        className="text-center pb-16 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
          Ready to connect your systems?
        </h2>
        <a
          href="#"
          className="inline-flex items-center rounded-full px-8 py-3.5 text-sm font-bold text-[#0A0A0F]"
          style={{ background: '#10B981', boxShadow: '0 0 24px rgba(16,185,129,0.4)' }}
        >
          Book a Demo
        </a>
        <p className="mt-10 text-[11px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
          © 2025 OneMed AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
