"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        background: scrolled ? "var(--glass-bg)" : "transparent",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          height: 72, display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--accent)", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🪣</div>
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)", letterSpacing: "-0.02em" }}>
              pdf<span style={{ color: "var(--accent)" }}>bucket</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {navLinks.map(([label, href]) => (
              <Link key={label} href={href} className="nav-link">
                {label}
              </Link>
            ))}
          </div>

          {/* Right side: ThemeToggle + CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <ThemeToggle />
            <Link href="/tools" className="btn-primary cta-btn" style={{ textDecoration: "none", padding: "10px 24px", fontSize: 14 }}>
              Try Free
            </Link>
            {/* Hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              className="mobile-menu-btn"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text)",
                borderRadius: 100,
                width: 44,
                height: 44,
                cursor: "pointer",
                fontSize: 20,
                display: "none",
                alignItems: "center",
                justifyContent: "center",
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
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px 24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
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
                  padding: "16px 16px",
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: "Inter, sans-serif",
                  borderRadius: 12,
                  marginBottom: 4,
                  background: "var(--bg2)"
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
