"use client";
import { useState, useEffect, useRef } from "react";

export default function QRGenerator() {
  const [text, setText] = useState("https://pdfbucket.online");
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#000000");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    if (!text.trim()) return;
    const QRCode = (await import("qrcode")).default;
    const canvas = canvasRef.current;
    if (!canvas) return;
    await QRCode.toCanvas(canvas, text, {
      width: size, margin: 2,
      color: { dark: fg, light: bg }
    });
    setGenerated(true);
  };

  const download = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png"); a.download = "qr-code.png"; a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>URL OR TEXT</label>
        <input type="text" value={text} onChange={e => setText(e.target.value)}
          placeholder="https://yoursite.com" style={{ width: "100%" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>SIZE: {size}px</label>
          <input type="range" min={128} max={512} step={64} value={size}
            onChange={e => setSize(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>COLORS</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, color: "#8888a0" }}>QR</span>
              <input type="color" value={fg} onChange={e => setFg(e.target.value)}
                style={{ width: 32, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", background: "none" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, color: "#8888a0" }}>BG</span>
              <input type="color" value={bg} onChange={e => setBg(e.target.value)}
                style={{ width: 32, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", background: "none" }} />
            </div>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={generate}>Generate QR Code</button>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <canvas ref={canvasRef} style={{ 
          borderRadius: 12, display: generated ? "block" : "none",
          border: "1px solid rgba(255,255,255,0.1)"
        }} />
      </div>

      {generated && (
        <button className="btn-outline" onClick={download} style={{ textAlign: "center" }}>
          ⬇ Download QR Code (PNG)
        </button>
      )}
    </div>
  );
}
