"use client";
import Link from "next/link";
export default function Footer() {
  return (
    <footer style={{ 
      borderTop: "1px solid var(--border)",
      padding: "40px 24px", marginTop: 20
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #6c63ff, #38bdf8)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
          }}>🪣</div>
          <div>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
              pdf<span style={{ color: "var(--accent)" }}>bucket</span>.online
            </span>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>Free file tools for everyone</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[["Tools", "/tools"], ["How it works", "/how-it-works"], ["Free Forever", "/free-forever"], ["Privacy Policy", "/privacy"], ["Contact", "mailto:hello@pdfbucket.online"]].map(([label, href]) => (
            <Link key={String(label)} href={String(href)} style={{ color: "var(--muted)", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
              {label}
            </Link>
          ))}
        </div>

        <p style={{ color: "var(--muted)", fontSize: 12 }}>
          © 2025 pdfbucket.online · Made with ❤️
        </p>
      </div>
    </footer>
  );
}
