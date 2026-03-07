"use client";

import { useEffect, useRef } from "react";

interface EntropyGlobeProps {
  className?: string;
}

const TEAL   = { r: 0,   g: 212, b: 170 };
const PURPLE = { r: 139, g: 92,  b: 246 };

function rgba(c: { r: number; g: number; b: number }, a: number) {
  const clamped = Math.max(0, Math.min(1, a));
  return `rgba(${c.r},${c.g},${c.b},${clamped})`;
}

export function EntropyGlobe({ className = "" }: EntropyGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;

    const setSize = () => {
      const container = canvas.parentElement;
      W = container ? container.clientWidth  : 700;
      H = container ? container.clientHeight : 700;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();

    interface Particle {
      x: number;
      y: number;
      originalX: number;
      originalY: number;
      vx: number;
      vy: number;
      ordered: boolean;
      influence: number;
      neighbors: Particle[];
    }

    let particles: Particle[] = [];

    const buildParticles = () => {
      particles = [];
      const GRID = 28;
      const spacingX = W / GRID;
      const spacingY = H / GRID;

      for (let i = 0; i < GRID; i++) {
        for (let j = 0; j < GRID; j++) {
          const x = spacingX * i + spacingX * 0.5;
          const y = spacingY * j + spacingY * 0.5;
          const ordered = x < W * 0.5;
          particles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            ordered,
            influence: 0,
            neighbors: [],
          });
        }
      }
    };

    buildParticles();

    const NEIGHBOR_DIST = 80;
    const updateNeighbors = () => {
      for (const p of particles) {
        p.neighbors = particles.filter((q) => {
          if (q === p) return false;
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          return dx * dx + dy * dy < NEIGHBOR_DIST * NEIGHBOR_DIST;
        });
      }
    };
    updateNeighbors();

    let frame = 0;

    const update = () => {
      for (const p of particles) {
        if (p.ordered) {
          const dx = p.originalX - p.x;
          const dy = p.originalY - p.y;

          let chaosX = 0;
          let chaosY = 0;
          let maxStr = 0;
          for (const n of p.neighbors) {
            if (!n.ordered) {
              const dist = Math.hypot(p.x - n.x, p.y - n.y);
              const str = Math.max(0, 1 - dist / NEIGHBOR_DIST);
              chaosX += n.vx * str;
              chaosY += n.vy * str;
              maxStr = Math.max(maxStr, str);
            }
          }
          p.influence = Math.max(p.influence, maxStr);

          const inv = 1 - p.influence;
          p.x += dx * 0.05 * inv + chaosX * p.influence;
          p.y += dy * 0.05 * inv + chaosY * p.influence;
          p.influence *= 0.98;
        } else {
          p.vx += (Math.random() - 0.5) * 0.6;
          p.vy += (Math.random() - 0.5) * 0.6;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x  += p.vx;
          p.y  += p.vy;

          if (p.x < W * 0.5) { p.vx = Math.abs(p.vx);  p.x = W * 0.5; }
          if (p.x > W)       { p.vx = -Math.abs(p.vx); p.x = W; }
          if (p.y < 0)       { p.vy = Math.abs(p.vy);  p.y = 0; }
          if (p.y > H)       { p.vy = -Math.abs(p.vy); p.y = H; }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const LINE_DIST = 55;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (const b of a.neighbors) {
          if (b < a) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > LINE_DIST) continue;
          const t = 1 - dist / LINE_DIST;
          if (a.ordered && b.ordered) {
            ctx.strokeStyle = rgba(TEAL, t * 0.22);
          } else if (!a.ordered && !b.ordered) {
            ctx.strokeStyle = rgba(PURPLE, t * 0.22);
          } else {
            ctx.strokeStyle = rgba(TEAL, t * 0.28);
          }
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        const alpha = p.ordered ? 0.75 - p.influence * 0.4 : 0.7;
        const color = p.ordered ? TEAL : PURPLE;
        const r = p.ordered ? 1.6 : 1.4;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        grd.addColorStop(0, rgba(color, alpha * 0.35));
        grd.addColorStop(1, rgba(color, 0));
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(color, alpha);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(W * 0.5, 0);
      ctx.lineTo(W * 0.5, H);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const animate = () => {
      frame++;
      if (frame % 25 === 0) updateNeighbors();
      update();
      draw();
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      setSize();
      buildParticles();
      updateNeighbors();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width: "100%", height: "100%" }}>
      <div
        className="animate-radial-breathe pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,212,170,0.08) 0%, rgba(139,92,246,0.06) 50%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="animate-equator-pulse pointer-events-none absolute z-10"
        style={{
          left: "15%", right: "15%",
          top: "50%", transform: "translateY(-50%)",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,212,170,0.5) 30%, rgba(139,92,246,0.5) 70%, transparent 100%)",
          filter: "blur(1px)",
        }}
      />
      <canvas ref={canvasRef} className="relative z-[5] block" />
    </div>
  );
}
