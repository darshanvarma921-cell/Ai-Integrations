"use client";

export function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 pb-8">
      <span
        className="text-[9px] tracking-[0.3em] uppercase text-white/25"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        Scroll Down
      </span>
      <div className="flex flex-col items-center gap-0.5">
        <span className="animate-scroll-chevron block h-3 w-px bg-gradient-to-b from-white/0 via-white/30 to-white/50" />
        <svg
          className="animate-scroll-chevron text-white/25"
          style={{ animationDelay: "0.2s" }}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
