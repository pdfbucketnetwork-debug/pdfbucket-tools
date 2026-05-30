"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setResult("");
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.width); setOrigH(img.height);
      setWidth(img.width); setHeight(img.height);
    };
    img.src = url;
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] }, multiple: false });

  const handleW = (v: number) => {
    setWidth(v);
    if (keepRatio && origW > 0) setHeight(Math.round(v * origH / origW));
  };
  const handleH = (v: number) => {
    setHeight(v);
    if (keepRatio && origH > 0) setWidth(Math.round(v * origW / origH));
  };

  const resize = () => {
    if (!file) return;
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      setResult(canvas.toDataURL("image/png"));
      setLoading(false);
    };
    img.src = preview;
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = result; a.download = `resized_${file?.name}`; a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {!file ? (
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div style={{ fontSize: 40, marginBottom: 12 }}>📐</div>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, marginBottom: 6 }}>Drop image to resize</p>
          <p style={{ color: "#8888a0", fontSize: 13, marginBottom: 16 }}>Supports PNG, JPG, WEBP</p>
          <button type="button" className="btn-primary" style={{ padding: "8px 24px", fontSize: 13, pointerEvents: "none" }}>Browse Files</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 6 }}>ORIGINAL — {origW}×{origH}</p>
              <img src={preview} style={{ width: "100%", borderRadius: 10, maxHeight: 160, objectFit: "cover" }} />
            </div>
            {result && (
              <div style={{ flex: 1, minWidth: 120 }}>
                <p style={{ fontSize: 12, color: "#22c55e", marginBottom: 6 }}>RESIZED — {width}×{height}</p>
                <img src={result} style={{ width: "100%", borderRadius: 10, maxHeight: 160, objectFit: "cover" }} />
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>WIDTH (px)</label>
              <input type="number" value={width} onChange={e => handleW(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8888a0", display: "block", marginBottom: 6 }}>HEIGHT (px)</label>
              <input type="number" value={height} onChange={e => handleH(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#8888a0", cursor: "pointer" }}>
            <input type="checkbox" checked={keepRatio} onChange={e => setKeepRatio(e.target.checked)} />
            Keep aspect ratio
          </label>

          {/* Preset sizes */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["Instagram", 1080, 1080], ["Story", 1080, 1920], ["Twitter", 1200, 675], ["HD", 1920, 1080]].map(([label, w, h]) => (
              <button key={String(label)} className="btn-outline" onClick={() => { setWidth(Number(w)); setHeight(Number(h)); }}
                style={{ padding: "6px 12px", fontSize: 12 }}>
                {String(label)} {w}×{h}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={resize} disabled={loading} style={{ flex: 1 }}>
              {loading ? "Resizing..." : "Resize Image"}
            </button>
            {result && <button className="btn-outline" onClick={download}>⬇ Download</button>}
            <button className="btn-outline" onClick={() => { setFile(null); setResult(""); }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
