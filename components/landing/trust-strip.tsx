"use client";

const LOGOS = [
  "Apollo Hospitals",
  "Aster DM",
  "KIMS",
  "Narayana Health",
  "Manipal",
] as const;

export function TrustStrip() {
  return (
    <section className="relative border-t border-white/6 bg-[#0A0A0F] py-14 px-6">
      {/* Top gradient fade from hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,212,170,0.15) 30%, rgba(139,92,246,0.15) 70%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        <p
          className="mb-10 text-center text-[10px] tracking-[0.25em] uppercase text-white/25"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Trusted by leading healthcare institutions
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {LOGOS.map((name) => (
            <div
              key={name}
              className="group flex items-center justify-center px-6 py-3.5 transition-all duration-300"
              style={{
                minWidth: "130px",
                borderTop: "1px solid #1A1A1A",
              }}
            >
              <span
                className="text-[12px] font-light text-white/25 group-hover:text-white/45 transition-colors duration-300 whitespace-nowrap"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
