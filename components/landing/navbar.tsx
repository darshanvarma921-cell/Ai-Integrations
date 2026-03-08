"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = ["Platform", "Solutions", "About", "Contact"] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      style={{
        paddingTop: scrolled ? "0" : "2.5rem", // offset for banner
        background: scrolled
          ? "rgba(10,10,15,0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00D4AA]" />
          </span>
          <span className="text-[15px] font-normal tracking-tight text-white">
            Adopt AI
          </span>
        </a>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] font-normal text-[#9CA3AF] hover:text-white transition-colors duration-200"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#"
          className="hidden md:inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-normal text-white transition-all duration-300 hover:border-white"
          style={{
            border: "1px solid #333",
            background: "transparent",
            fontFamily: "var(--font-dm-sans)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#ffffff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#333";
          }}
        >
          Book a Demo
        </a>

        {/* Mobile hamburger placeholder */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Open menu"
        >
          <span className="block h-px w-5 bg-white/60" />
          <span className="block h-px w-5 bg-white/60" />
        </button>
      </div>
    </nav>
  );
}
