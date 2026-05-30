"use client";
import { useState, useRef } from "react";

const FONTS = [
  { label: "Natural", css: "'Caveat', cursive" },
  { label: "Neat", css: "'Kalam', cursive" },
  { label: "Bold", css: "'Permanent Marker', cursive" },
  { label: "Elegant", css: "'Dancing Script', cursive" },
];

export default function TextHandwriting() {
  const [text, setText] = useState("Hello, World!\nThis is handwriting...");
  const [fontIdx, setFontIdx] = useState(0);
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#1a1a2e");
  const [bgColor, setBgColor] = useState("#fffef0");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const lines = text.split("\n");
    const padding = 40;
    canvas.width = 700;
    canvas.height = lines.length * (fontSize * 1.6) + padding * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ruled lines
    ctx.strokeStyle = "rgba(180,180,220,0.3)";
    ctx.lineWidth = 1;
    for (let y = padding + fontSize * 1.6; y < canvas.height - padding; y += fontSize * 1.6) {
      ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(canvas.width - padding, y); ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${FONTS[fontIdx].css}`;
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + i * (fontSize * 1.6));
    });
    setGenerated(true);
  };

  const download = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png"); a.download = "handwriting.png"; a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Kalam:wght@400&family=Permanent+Marker&family=Dancing+Script:wght@600&display=swap');`}</style>
      
      <div>
        <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>YOUR TEXT</label>
        <textarea value={text} onChange={e => setText(e.target.value)}
          style={{ width: "100%", minHeight: 90, resize: "vertical", fontSize: 14, fontFamily: FONTS[fontIdx].css }} />
      </div>

      <div>
        <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 8 }}>HANDWRITING STYLE</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FONTS.map((f, i) => (
            <button key={i} onClick={() => setFontIdx(i)} style={{
              padding: "8px 16px", borderRadius: 8,
              border: `1px solid ${fontIdx === i ? "#6c63ff" : "rgba(255,255,255,0.1)"}`,
              background: fontIdx === i ? "rgba(108,99,255,0.12)" : "transparent",
              color: fontIdx === i ? "#9f7aea" : "#8888a0",
              fontFamily: f.css, fontSize: 16, cursor: "pointer"
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>SIZE: {fontSize}px</label>
          <input type="range" min={18} max={56} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>INK</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            style={{ width: "100%", height: 34, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>PAPER</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
            style={{ width: "100%", height: 34, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }} />
        </div>
      </div>

      <button className="btn-primary" onClick={generate}>Generate Handwriting</button>

      <canvas ref={canvasRef} style={{ 
        width: "100%", borderRadius: 12, display: generated ? "block" : "none",
        border: "1px solid rgba(255,255,255,0.1)"
      }} />

      {generated && (
        <button className="btn-outline" onClick={download}>⬇ Download PNG</button>
      )}
    </div>
  );
}
