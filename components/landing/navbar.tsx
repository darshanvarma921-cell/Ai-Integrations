"use client";

import Link from "next/link";

const NAV_LINKS = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
] as const;

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        height: 72,
        padding: "0 48px",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2"
        style={{ textDecoration: "none" }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#10B981",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 15,
            color: "#FFFFFF",
            letterSpacing: "0.03em",
          }}
        >
          Adopt AI
        </span>
      </Link>

      {/* Center nav links */}
      <div className="hidden md:flex items-center" style={{ gap: 48 }}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: 13,
              color: "#888",
              letterSpacing: "0.03em",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Book a Demo — plain text link */}
      <a
        href="#"
        className="hidden md:inline"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 400,
          fontSize: 13,
          color: "#888",
          letterSpacing: "0.03em",
          textDecoration: "none",
          transition: "color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
      >
        Book a Demo
      </a>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Open menu"
      >
        <span className="block h-px w-5 bg-white/60" />
        <span className="block h-px w-5 bg-white/60" />
      </button>
    </nav>
  );
}
