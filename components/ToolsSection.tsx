import Link from "next/link";
import { toolsData } from "@/lib/toolsData";

export default function ToolsSection() {
  return (
    <section id="tools" style={{ padding: "80px 16px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>🔧 10+ Tools, All Free</span>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>
          Everything in one bucket
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
          No downloads. No signup. All tools run directly in your browser.
        </p>
      </div>

      {/* Tool grid */}
      <div className="tool-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {toolsData.map(tool => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="tool-card"
            style={{
              textAlign: "left",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              textDecoration: "none",
              color: "inherit",
              display: "block"
            }}
          >
            {tool.tag && (
              <span style={{
                position: "absolute", top: 16, right: 16,
                background: "rgba(108,99,255,0.15)", color: "var(--accent2)",
                fontSize: 10, fontFamily: "Syne, sans-serif", fontWeight: 700,
                padding: "3px 8px", borderRadius: 50, letterSpacing: "0.06em"
              }}>{tool.tag}</span>
            )}
            <div className="icon-box" style={{ background: `${tool.color}18` }}>
              <span>{tool.icon}</span>
            </div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{tool.label}</h3>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>{tool.desc}</p>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, color: tool.color, fontSize: 13, fontWeight: 600 }}>
              Use Tool <span>→</span>
            </div>
          </Link>
        ))}

        {/* Coming soon cards */}
        {[["🎵", "MP4 → MP3", "Extract audio from videos"], ["🌫️", "Background Remover", "AI-powered background removal"]].map(([icon, label, desc]) => (
          <div key={String(label)} className="tool-card" style={{ opacity: 0.5, cursor: "not-allowed" }}>
            <span style={{
              position: "absolute", top: 16, right: 16,
              background: "var(--border)", color: "var(--muted)",
              fontSize: 10, fontFamily: "Syne, sans-serif", fontWeight: 700,
              padding: "3px 8px", borderRadius: 50, letterSpacing: "0.06em"
            }}>SOON</span>
            <div className="icon-box" style={{ background: "var(--border)" }}><span>{icon}</span></div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{label}</h3>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
