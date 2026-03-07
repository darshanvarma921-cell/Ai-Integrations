"use client";

import { useEffect, useRef, useCallback } from "react";

interface GlobeParticle {
  // Spherical coords
  theta: number; // polar angle
  phi: number;   // azimuthal angle
  // Computed 3D position
  x3: number;
  y3: number;
  z3: number;
  // Screen position (after projection)
  sx: number;
  sy: number;
  depth: number; // 0 = back, 1 = front
  // Drift state — data flowing between systems
  drifting: boolean;
  driftPhase: number;
  driftDuration: number;
  driftOffset: { x: number; y: number; z: number };
  driftTimer: number;
  // Visual
  size: number;
  baseAlpha: number;
}

interface EntropyGlobeProps {
  className?: string;
}

const TEAL   = { r: 0,   g: 212, b: 170 };
const PURPLE = { r: 139, g: 92,  b: 246 };
const WHITE  = { r: 255, g: 255, b: 255 };

function lerpColor(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number
) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function rgba(c: { r: number; g: number; b: number }, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${Math.max(0, Math.min(1, a))})`;
}

// Fibonacci sphere distribution — evenly spreads N points on sphere surface
function fibonacciSphere(n: number): Array<{ theta: number; phi: number }> {
  const points: Array<{ theta: number; phi: number }> = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;           // y in [-1, 1]
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.acos(Math.max(-1, Math.min(1, y)));
    const phi = (2 * Math.PI * i) / goldenRatio;
    points.push({ theta, phi: phi % (2 * Math.PI) });
  }
  return points;
}

export function EntropyGlobe({ className = "" }: EntropyGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GlobeParticle[]>([]);
  const rotationRef = useRef(0);
  const animationIdRef = useRef<number>(0);
  const sizeRef = useRef({ w: 700, h: 700 });

  const initParticles = useCallback((count: number) => {
    const positions = fibonacciSphere(count);
    return positions.map((pos, i): GlobeParticle => ({
      theta: pos.theta,
      phi: pos.phi,
      x3: 0, y3: 0, z3: 0,
      sx: 0, sy: 0, depth: 0,
      drifting: false,
      driftPhase: 0,
      driftDuration: 90 + Math.random() * 60,
      driftOffset: { x: 0, y: 0, z: 0 },
      driftTimer: 0,
      size: 1.5 + Math.random() * 1.2,
      baseAlpha: 0.6 + Math.random() * 0.4,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      const container = canvas.parentElement;
      const W = container ? container.clientWidth  : 700;
      const H = container ? container.clientHeight : 700;
      sizeRef.current = { w: W, h: H };
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
    };

    setSize();

    const PARTICLE_COUNT = 320;
    particlesRef.current = initParticles(PARTICLE_COUNT);

    // Randomly schedule drifts
    particlesRef.current.forEach((p, i) => {
      if (Math.random() < 0.12) {
        setTimeout(() => { startDrift(p); }, Math.random() * 8000);
      }
    });

    function startDrift(p: GlobeParticle) {
      if (p.drifting) return;
      p.drifting = true;
      p.driftTimer = 0;
      p.driftPhase = 0;
      const mag = 0.15 + Math.random() * 0.25;
      const angle = Math.random() * Math.PI * 2;
      p.driftOffset = {
        x: Math.cos(angle) * mag,
        y: (Math.random() - 0.5) * mag * 0.6,
        z: Math.sin(angle) * mag,
      };
    }

    let frameCount = 0;

    function animate() {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const SPHERE_R    = Math.min(w, h) * 0.38; // ~266px on 700px canvas
      const cx          = w / 2;
      const cy          = h / 2;
      const focalLength = SPHERE_R * 2.8;
      const rotSpeed    = 0.0028;

      rotationRef.current += rotSpeed;
      const rot = rotationRef.current;

      // Randomly trigger new drifts
      if (frameCount % 180 === 0) {
        const p = particlesRef.current[Math.floor(Math.random() * particlesRef.current.length)];
        startDrift(p);
      }

      // Update + project particles
      particlesRef.current.forEach((p) => {
        // Update drift
        if (p.drifting) {
          p.driftTimer++;
          const half = p.driftDuration / 2;
          if (p.driftTimer < half) {
            p.driftPhase = p.driftTimer / half; // 0→1 (out)
          } else if (p.driftTimer < p.driftDuration) {
            p.driftPhase = 1 - (p.driftTimer - half) / half; // 1→0 (back)
          } else {
            p.drifting = false;
            p.driftPhase = 0;
            p.driftTimer = 0;
            // Re-schedule
            setTimeout(() => { startDrift(p); }, 3000 + Math.random() * 12000);
          }
        }

        // 3D sphere coords
        const sinTheta = Math.sin(p.theta);
        const cosTheta = Math.cos(p.theta);
        const phi      = p.phi + rot;
        const sinPhi   = Math.sin(phi);
        const cosPhi   = Math.cos(phi);

        let bx = SPHERE_R * sinTheta * cosPhi;
        let by = SPHERE_R * cosTheta;
        let bz = SPHERE_R * sinTheta * sinPhi;

        // Apply drift
        if (p.drifting && p.driftPhase > 0) {
          const eased = p.driftPhase < 0.5
            ? 2 * p.driftPhase * p.driftPhase
            : 1 - Math.pow(-2 * p.driftPhase + 2, 2) / 2;
          bx += p.driftOffset.x * SPHERE_R * eased;
          by += p.driftOffset.y * SPHERE_R * eased;
          bz += p.driftOffset.z * SPHERE_R * eased;
        }

        p.x3 = bx; p.y3 = by; p.z3 = bz;

        // Perspective projection
        const zOff    = focalLength + bz;
        const scale   = zOff > 0 ? focalLength / zOff : 0;
        p.sx    = cx + bx * scale;
        p.sy    = cy + by * scale;
        p.depth = (bz + SPHERE_R) / (2 * SPHERE_R); // 0=back, 1=front
      });

      // Sort back-to-front for correct painter's order
      const sorted = [...particlesRef.current].sort((a, b) => a.depth - b.depth);

      // Connection lines (drawn first, under particles)
      const CONNECTION_DIST_3D = SPHERE_R * 0.38;
      const LINE_ALPHA_MAX = 0.18;

      for (let i = 0; i < sorted.length; i++) {
        const a = sorted[i];
        for (let j = i + 1; j < sorted.length; j++) {
          const b = sorted[j];

          const dx = a.x3 - b.x3;
          const dy = a.y3 - b.y3;
          const dz = a.z3 - b.z3;
          const dist3d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3d < CONNECTION_DIST_3D) {
            const t = 1 - dist3d / CONNECTION_DIST_3D;
            const avgDepth = (a.depth + b.depth) / 2;
            const alpha = t * t * LINE_ALPHA_MAX * (0.3 + avgDepth * 0.7);

            // Teal-tinted lines
            const lineColor = rgba(TEAL, alpha);
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      // Particles
      sorted.forEach((p) => {
        // depth-based coloring: back=purple/dim, front=teal/bright
        const d = p.depth;
        let color: { r: number; g: number; b: number };
        if (d < 0.4) {
          color = lerpColor(PURPLE, WHITE, d / 0.4 * 0.5);
        } else if (d < 0.7) {
          color = lerpColor(WHITE, TEAL, (d - 0.4) / 0.3);
        } else {
          color = lerpColor(TEAL, WHITE, (d - 0.7) / 0.3 * 0.4);
        }

        const alpha = p.baseAlpha * (0.15 + d * 0.85);
        const radius = p.size * (0.5 + d * 0.8);

        // Soft glow for front particles
        if (d > 0.7) {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, radius * 3.5);
          gradient.addColorStop(0, rgba(color, alpha * 0.5));
          gradient.addColorStop(1, rgba(color, 0));
          ctx.arc(p.sx, p.sy, radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = rgba(color, alpha);
        ctx.fill();
      });

      frameCount++;
      animationIdRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      setSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [initParticles]);

  return (
    <div className={`relative ${className}`} style={{ width: "100%", height: "100%" }}>
      {/* Radial glow behind globe */}
      <div
        className="animate-radial-breathe pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(0,212,170,0.12) 0%, rgba(139,92,246,0.08) 45%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />
      {/* Equator light streak */}
      <div
        className="animate-equator-pulse pointer-events-none absolute z-10"
        style={{
          left: "15%",
          right: "15%",
          top: "50%",
          transform: "translateY(-50%)",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 30%, rgba(0,212,170,0.8) 50%, rgba(255,255,255,0.6) 70%, transparent 100%)",
          filter: "blur(1px)",
        }}
      />
      <canvas ref={canvasRef} className="relative z-[5] block" />
    </div>
  );
}
