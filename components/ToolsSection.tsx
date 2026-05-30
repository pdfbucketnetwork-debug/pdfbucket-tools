"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const tools = [
  { id: "compress", icon: "🗜️", label: "Image Compressor", desc: "Reduce image file size without quality loss", color: "#6c63ff", tag: "Popular" },
  { id: "resize", icon: "📐", label: "Image Resizer", desc: "Resize to any dimension or social preset", color: "#38bdf8", tag: "" },
  { id: "convert", icon: "🔄", label: "Format Converter", desc: "Convert between PNG, JPEG, WEBP instantly", color: "#a78bfa", tag: "" },
  { id: "qr", icon: "📱", label: "QR Code Generator", desc: "Create custom QR codes for any URL or text", color: "#34d399", tag: "New" },
  { id: "ocr", icon: "📝", label: "Text Extractor (OCR)", desc: "Extract text from images and screenshots", color: "#f59e0b", tag: "" },
  { id: "palette", icon: "🎨", label: "Color Palette", desc: "Extract dominant colors from any image", color: "#f472b6", tag: "Fun" },
  { id: "handwriting", icon: "✍️", label: "Text → Handwriting", desc: "Convert typed text to handwritten style", color: "#fb923c", tag: "Viral" },
];

const toolComponents: Record<string, React.ComponentType> = {
  compress: dynamic(() => import("./tools/ImageCompressor"), { ssr: false }),
  resize: dynamic(() => import("./tools/ImageResizer"), { ssr: false }),
  convert: dynamic(() => import("./tools/ImageConverter"), { ssr: false }),
  qr: dynamic(() => import("./tools/QRGenerator"), { ssr: false }),
  ocr: dynamic(() => import("./tools/TextExtractor"), { ssr: false }),
  palette: dynamic(() => import("./tools/ColorPalette"), { ssr: false }),
  handwriting: dynamic(() => import("./tools/TextHandwriting"), { ssr: false }),
};

export default function ToolsSection() {
  const [active, setActive] = useState<string | null>(null);
  const ActiveTool = active ? toolComponents[active] : null;
  const activeTool = tools.find(t => t.id === active);

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

      {!active ? (
        /* Tool grid */
        <div className="tool-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {tools.map(tool => (
            <button
              key={tool.id}
              type="button"
              className="tool-card"
              onClick={() => setActive(tool.id)}
              style={{
                textAlign: "left",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
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
            </button>
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
      ) : (
        /* Active tool view */
        <div>
          <button
            type="button"
            onClick={() => setActive(null)}
            style={{
              background: "none", border: "1px solid var(--border)", color: "var(--muted)",
              borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontSize: 13,
              marginBottom: 24, display: "flex", alignItems: "center", gap: 6,
              WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
            }}
          >
            ← Back to Tools
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
            <div className="icon-box" style={{ background: `${activeTool?.color}18`, marginBottom: 0 }}>
              {activeTool?.icon}
            </div>
            <div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
                {activeTool?.label}
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 13 }}>{activeTool?.desc}</p>
            </div>
          </div>

          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: 28, maxWidth: 640
          }}>
            {ActiveTool && <ActiveTool />}
          </div>
        </div>
      )}
    </section>
  );
}
