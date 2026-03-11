"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Capability = {
  readonly title: string;
  readonly body: string;
};

const PANEL_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function FocusRail({ items }: { items: readonly Capability[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Desktop rail */}
      <div
        style={{
          display: "flex",
          gap: 6,
          height: 420,
        }}
        className="focus-rail-desktop"
      >
        {items.map((item, i) => {
          const expanded = i === active;
          return (
            <motion.div
              key={item.title}
              layout
              animate={{ flex: expanded ? 4 : 1 }}
              transition={{ duration: 0.4, ease: PANEL_EASE }}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              style={{
                position: "relative",
                background: expanded ? "#111118" : "transparent",
                border: "1px solid",
                borderColor: expanded ? "#1A1A1A" : "#1A1A1A",
                borderRadius: 12,
                cursor: expanded ? "default" : "pointer",
                overflow: "hidden",
                minWidth: 0,
              }}
              whileHover={!expanded ? { borderColor: "#2A2A2A" } : undefined}
            >
              {/* Expanded content */}
              <AnimatePresence mode="wait">
                {expanded && (
                  <motion.div
                    key={`expanded-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: 32,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 500,
                        fontSize: 13,
                        color: "#00D4AA",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 600,
                        fontSize: 26,
                        color: "#FFFFFF",
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 300,
                        fontSize: 15,
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {item.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Compressed content — vertical title */}
              <AnimatePresence mode="wait">
                {!expanded && (
                  <motion.div
                    key={`compressed-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingBottom: 32,
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 500,
                        fontSize: 12,
                        color: "#00D4AA",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 500,
                        fontSize: 15,
                        color: "rgba(255,255,255,0.65)",
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        whiteSpace: "nowrap",
                        transition: "color 0.2s",
                      }}
                      className="focus-rail-label"
                    >
                      {item.title}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile accordion */}
      <div className="focus-rail-mobile">
        {items.map((item, i) => {
          const expanded = i === active;
          return (
            <div
              key={item.title}
              style={{
                border: "1px solid #1A1A1A",
                borderRadius: 10,
                background: expanded ? "#111118" : "transparent",
                overflow: "hidden",
                transition: "background 0.3s",
              }}
            >
              <button
                onClick={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "16px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#00D4AA",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: 16,
                    color: expanded ? "#FFFFFF" : "rgba(255,255,255,0.65)",
                    transition: "color 0.2s",
                  }}
                >
                  {item.title}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: PANEL_EASE }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 300,
                        fontSize: 15,
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.7,
                        padding: "0 20px 20px 20px",
                        margin: 0,
                      }}
                    >
                      {item.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <style>{`
        .focus-rail-desktop { display: flex !important; }
        .focus-rail-mobile { display: none !important; }
        .focus-rail-desktop > div:hover .focus-rail-label {
          color: rgba(255,255,255,1) !important;
        }
        @media (max-width: 768px) {
          .focus-rail-desktop { display: none !important; }
          .focus-rail-mobile {
            display: flex !important;
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}
