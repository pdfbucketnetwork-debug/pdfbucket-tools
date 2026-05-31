import Link from "next/link";
import { toolsData } from "@/lib/toolsData";

const highlightKeywords = (text: string) => {
  const keywords = ["png", "jpeg", "jpg", "webp", "mp4", "mp3", "ai", "ocr", "qr", "url", "hex", "audio", "video", "videos", "image", "images", "file", "text", "colors", "background", "handwritten", "quality", "dimension", "social"];
  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (keywords.includes(part.toLowerCase())) {
      return <span key={i} style={{ color: "var(--text)", fontWeight: 600, opacity: 1 }}>{part}</span>;
    }
    return part;
  });
};

export default function ToolsSection() {
  return (
    <section id="tools" style={{ padding: "100px 16px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2.6rem", fontWeight: 700, marginBottom: 16 }}>
          Everything in one bucket
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 500, margin: "0 auto", fontWeight: 400 }}>
          No downloads. No signup. All tools run directly in your browser.
        </p>
      </div>

      {/* Tool grid */}
      <div className="tool-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {toolsData.map(tool => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="tool-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block"
            }}
          >
            {tool.tag && (
              <span style={{
                position: "absolute", top: 16, right: 16,
                background: "var(--bg2)", color: "var(--text)",
                border: "1px solid var(--border)",
                fontSize: 11, fontFamily: "Inter, sans-serif", fontWeight: 500,
                padding: "4px 10px", borderRadius: 100, letterSpacing: "0.02em"
              }}>{tool.tag}</span>
            )}
            
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div className="icon-box" style={{ background: "var(--bg2)", border: "1px solid var(--border)", margin: 0, width: 44, height: 44 }}>
                <span>{tool.icon}</span>
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 17, margin: 0 }}>{tool.label}</h3>
            </div>
            
            <p style={{ color: "var(--text)", opacity: 0.75, fontSize: 14.5, lineHeight: 1.6 }}>
              {highlightKeywords(tool.desc)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
