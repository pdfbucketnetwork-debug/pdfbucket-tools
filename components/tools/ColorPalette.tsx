"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

function getColors(img: HTMLImageElement, count = 8): string[] {
  const canvas = document.createElement("canvas");
  const size = 80;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const colorMap: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    if (data[i + 3] < 128) continue;
    const key = `${r},${g},${b}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }
  return Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([k]) => {
      const [r, g, b] = k.split(",").map(Number);
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    });
}

export default function ColorPalette() {
  const [preview, setPreview] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [copied, setCopied] = useState<string>("");

  const onDrop = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => setColors(getColors(img));
    img.src = url;
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] }, multiple: false });

  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {!preview ? (
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎨</div>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, marginBottom: 6 }}>Drop an image</p>
          <p style={{ color: "#8888a0", fontSize: 13, marginBottom: 16 }}>Extract dominant color palette</p>
          <button type="button" className="btn-primary" style={{ padding: "8px 24px", fontSize: 13, pointerEvents: "none" }}>Browse Files</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <img src={preview} style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 12 }} />

          {colors.length > 0 && (
            <>
              <p style={{ fontSize: 12, color: "#8888a0" }}>DOMINANT COLORS — click to copy hex</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {colors.map((color, i) => (
                  <button key={i} onClick={() => copy(color)} style={{
                    background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6
                  }}>
                    <div style={{
                      width: "100%", paddingBottom: "100%", borderRadius: 10, background: color,
                      border: copied === color ? "2px solid #22c55e" : "1px solid rgba(255,255,255,0.1)",
                      position: "relative", transition: "transform 0.15s"
                    }}>
                      {copied === color && (
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✓</span>
                      )}
                    </div>
                    <span style={{ fontSize: 10, color: "#8888a0", fontFamily: "monospace" }}>{color}</span>
                  </button>
                ))}
              </div>
              
              {/* Color bar */}
              <div style={{ height: 32, borderRadius: 8, display: "flex", overflow: "hidden" }}>
                {colors.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
              </div>
            </>
          )}

          <button className="btn-outline" onClick={() => { setPreview(""); setColors([]); }}>✕ Clear</button>
        </div>
      )}
    </div>
  );
}
