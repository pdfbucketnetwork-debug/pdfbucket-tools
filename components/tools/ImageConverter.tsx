"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FORMATS = ["PNG", "JPEG", "WEBP"];

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [target, setTarget] = useState("WEBP");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setResult("");
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] }, multiple: false });

  const convert = () => {
    if (!file) return;
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const mime = target === "JPEG" ? "image/jpeg" : target === "WEBP" ? "image/webp" : "image/png";
      setResult(canvas.toDataURL(mime, 0.92));
      setLoading(false);
    };
    img.src = preview;
  };

  const download = () => {
    const ext = target.toLowerCase() === "jpeg" ? "jpg" : target.toLowerCase();
    const a = document.createElement("a");
    a.href = result; a.download = `converted.${ext}`; a.click();
  };

  const currentFormat = file?.type.split("/")[1]?.toUpperCase() || "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {!file ? (
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔄</div>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, marginBottom: 6 }}>Drop image to convert</p>
          <p style={{ color: "#8888a0", fontSize: 13, marginBottom: 16 }}>PNG ↔ JPEG ↔ WEBP</p>
          <button type="button" className="btn-primary" style={{ padding: "8px 24px", fontSize: 13, pointerEvents: "none" }}>Browse Files</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img src={preview} style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover" }} />
            <div>
              <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14 }}>{file.name}</p>
              <p style={{ color: "#8888a0", fontSize: 12 }}>Current format: <span style={{ color: "#6c63ff" }}>{currentFormat}</span></p>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 10 }}>CONVERT TO</p>
            <div style={{ display: "flex", gap: 8 }}>
              {FORMATS.filter(f => f !== currentFormat).map(fmt => (
                <button key={fmt} onClick={() => setTarget(fmt)} style={{
                  padding: "10px 20px", borderRadius: 8, border: "1px solid",
                  borderColor: target === fmt ? "#6c63ff" : "rgba(255,255,255,0.1)",
                  background: target === fmt ? "rgba(108,99,255,0.15)" : "transparent",
                  color: target === fmt ? "#9f7aea" : "#8888a0",
                  cursor: "pointer", fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 13,
                  transition: "all 0.2s"
                }}>{fmt}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={convert} disabled={loading} style={{ flex: 1 }}>
              {loading ? "Converting..." : `Convert to ${target}`}
            </button>
            {result && <button className="btn-outline" onClick={download}>⬇ Download</button>}
            <button className="btn-outline" onClick={() => { setFile(null); setResult(""); }}>✕</button>
          </div>

          {result && (
            <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#22c55e" }}>
              ✅ Converted to {target} successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
