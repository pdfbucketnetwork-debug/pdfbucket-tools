"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const links = [
    ["Tools", "/tools"],
    ["How it works", "/how-it-works"],
    ["Blog", "/blog"],
    ["About Us", "/about"],
    ["Contact", "/contact"],
    ["Privacy", "/privacy"],
    ["Terms", "/terms"],
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "48px 24px 32px", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Image src="/logo.png" alt="PDFBucket Logo" width={48} height={48} style={{ objectFit: "contain", transform: "scale(1.2)", transformOrigin: "center left" }} />
              <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", letterSpacing: "-0.01em" }}>
                pdf<span style={{ color: "var(--accent)" }}>bucket</span>.online
              </span>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 280, lineHeight: 1.6 }}>
              Free browser-based image tools. No signup. No uploads. 100% private.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {links.map(([label, href]) => (
              <Link key={label} href={href} className="footer-link">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "var(--muted)", fontSize: 12 }}>
            © 2025 pdfbucket.online · All tools free forever · Made with ❤️
          </p>
          <p style={{ color: "var(--muted)", fontSize: 12 }}>
            🔒 Your files never leave your browser
          </p>
        </div>
      </div>
    </footer>
  );
}
