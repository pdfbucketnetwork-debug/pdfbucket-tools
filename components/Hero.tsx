"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section style={{ 
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "100px 24px 60px"
    }}>
      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} className="pulse-slow" />
      <div style={{
        position: "absolute", bottom: "10%", right: "10%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        
        {/* Tag */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <span className="tag">⚡ 100% Free · No Signup · Browser-Based</span>
        </div>

        {/* Title */}
        <h1 className="hero-title" style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "3.4rem",
          lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24, color: "var(--text)"
        }}>
          Drop any file.{" "}
          <span style={{ 
            background: "linear-gradient(135deg, #6c63ff, #38bdf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Get what you need.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 300 }}>
          10+ powerful tools — compress, convert, resize, remove backgrounds, generate QR codes and more. 
          All free. All instant. Zero uploads to any server.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/tools" className="btn-primary" style={{ fontSize: 15, padding: "14px 32px", textDecoration: "none" }}>
            Explore Tools
          </Link>
          <Link href="/how-it-works" className="btn-outline" style={{ fontSize: 15, padding: "14px 32px", textDecoration: "none" }}>
            How it works →
          </Link>
        </div>

        {/* Stats */}
        <div style={{ 
          display: "flex", gap: 40, justifyContent: "center", marginTop: 64, flexWrap: "wrap"
        }}>
          {[["10+", "Free Tools"], ["0", "Server Uploads"], ["100%", "Browser-Based"], ["∞", "No Limits"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "var(--text)", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
