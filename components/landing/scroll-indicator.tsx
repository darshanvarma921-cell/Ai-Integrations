"use client";

export function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 pb-8">
      <span
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "#444",
        }}
      >
        Scroll Down
      </span>
      <svg
        className="animate-scroll-chevron"
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        style={{ opacity: 0.2 }}
      >
        <path
          d="M1 1L5 5L9 1"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
