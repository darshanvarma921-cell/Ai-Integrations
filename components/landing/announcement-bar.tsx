"use client";

export function AnnouncementBar() {
  return (
    <div className="relative z-50 flex items-center justify-center px-4 py-2.5 bg-[#0A0A0F] border-b border-white/5">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(255,255,255,0.45)" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#00D4AA] animate-pulse-dot"
            style={{ flexShrink: 0 }}
          />
          Now partnering with leading hospital networks across India
          <span
            className="animate-banner-arrow ml-1 font-bold"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            →
          </span>
        </span>
      </div>
    </div>
  );
}
