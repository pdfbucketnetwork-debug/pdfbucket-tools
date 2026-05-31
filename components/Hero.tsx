"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section style={{ 
      minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "120px 24px 60px",
      background: "var(--bg)"
    }}>
      <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        
        {/* Subtle pill tag */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--bg2)", color: "var(--text)",
            border: "1px solid var(--border)", padding: "6px 16px",
            borderRadius: 100, fontSize: 13, fontWeight: 500,
            fontFamily: "Inter, sans-serif", letterSpacing: "0.01em"
          }}>
            <span style={{ color: "var(--accent)" }}>●</span> 100% Free · No Signup
          </span>
        </div>

        {/* Massive clean Title */}
        <h1 className="hero-title" style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "4.2rem",
          lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, color: "var(--text)"
        }}>
          All your file tools.<br/>
          <span style={{ color: "var(--accent)" }}>One click away.</span>
        </h1>

        {/* Clean Subtitle */}
        <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 580, margin: "0 auto 48px", lineHeight: 1.6, fontWeight: 400 }}>
          Compress, convert, resize, and process images and files instantly. 
          Everything runs entirely in your browser—secure, private, and unbelievably fast.
        </p>

        {/* Minimal CTAs */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/tools" className="btn-primary" style={{ textDecoration: "none" }}>
            Explore Tools
          </Link>
          <Link href="/how-it-works" className="btn-outline" style={{ textDecoration: "none" }}>
            How it works
          </Link>
        </div>

        {/* Refined Stats */}
        <div style={{ 
          display: "flex", gap: 48, justifyContent: "center", marginTop: 80, flexWrap: "wrap",
          paddingTop: 48, borderTop: "1px solid var(--border)", maxWidth: 640, margin: "80px auto 0"
        }}>
          {[["10+", "Free Tools"], ["0", "Uploads"], ["100%", "Private"], ["∞", "No Limits"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "2rem", color: "var(--text)", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 8, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
