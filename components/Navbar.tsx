"use client";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    ["Home", "/"],
    ["Tools", "/tools"],
    ["How it works", "/how-it-works"],
    ["Blog", "/blog"],
  ] as const;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "var(--glass-bg)",
        WebkitBackdropFilter: "blur(16px)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 16px",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #6c63ff, #38bdf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🪣</div>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 17, color: "var(--text)", letterSpacing: "-0.02em" }}>
              pdf<span style={{ color: "var(--accent)" }}>bucket</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {navLinks.map(([label, href]) => (
              <Link key={label} href={href} style={{
                color: "var(--muted)", textDecoration: "none", padding: "8px 14px",
                borderRadius: 8, fontSize: 14, fontWeight: 500,
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side: ThemeToggle + CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <ThemeToggle />
            <Link href="/tools" className="btn-primary cta-btn" style={{ textDecoration: "none" }}>
              Use Free Tools ↗
            </Link>
            {/* Hamburger — only shown on mobile via CSS */}
            <button
              type="button"
              aria-label="Toggle menu"
              className="mobile-menu-btn"
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text)",
                borderRadius: 8,
                width: 40,
                height: 40,
                cursor: "pointer",
                fontSize: 20,
                lineHeight: 1,
                display: "none", /* shown via CSS */
                alignItems: "center",
                justifyContent: "center",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                userSelect: "none",
              }}
              onClick={() => setOpen(o => !o)}
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div style={{
            background: "var(--bg)",
            borderTop: "1px solid var(--border)",
            padding: "12px 16px 20px",
          }}>
            {navLinks.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  color: "var(--text)",
                  textDecoration: "none",
                  padding: "14px 0",
                  fontSize: 16,
                  fontWeight: 500,
                  borderBottom: "1px solid var(--border)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
