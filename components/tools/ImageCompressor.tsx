"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setOriginal(file);
    setCompressed(null);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [] }, multiple: false
  });

  const compress = async () => {
    if (!original) return;
    setLoading(true);
    try {
      const result = await imageCompression(original, {
        maxSizeMB: 10,
        useWebWorker: true,
        initialQuality: quality / 100,
      });
      setCompressed(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const download = () => {
    if (!compressed) return;
    const url = URL.createObjectURL(compressed);
    const a = document.createElement("a");
    a.href = url; a.download = `compressed_${original?.name}`; a.click();
  };

  const fmt = (bytes: number) => bytes > 1024 * 1024 
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB` 
    : `${(bytes / 1024).toFixed(1)} KB`;

  const saving = original && compressed 
    ? Math.round((1 - compressed.size / original.size) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {!original ? (
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, marginBottom: 6 }}>Drop your image here</p>
          <p style={{ color: "#8888a0", fontSize: 13, marginBottom: 16 }}>PNG, JPG, WEBP, GIF supported</p>
          <button type="button" className="btn-primary" style={{ padding: "8px 24px", fontSize: 13, pointerEvents: "none" }}>Browse Files</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Preview */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 8 }}>ORIGINAL</p>
              <img src={preview} style={{ width: "100%", borderRadius: 10, maxHeight: 180, objectFit: "cover" }} />
              <p style={{ fontSize: 13, color: "#8888a0", marginTop: 6 }}>{fmt(original.size)}</p>
            </div>
            {compressed && (
              <div style={{ flex: 1, minWidth: 140 }}>
                <p style={{ fontSize: 12, color: "#22c55e", marginBottom: 8 }}>COMPRESSED ✓</p>
                <img src={URL.createObjectURL(compressed)} style={{ width: "100%", borderRadius: 10, maxHeight: 180, objectFit: "cover" }} />
                <p style={{ fontSize: 13, color: "#22c55e", marginTop: 6 }}>{fmt(compressed.size)} · {saving}% smaller</p>
              </div>
            )}
          </div>

          {/* Quality slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 13, color: "#8888a0" }}>Quality</label>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#6c63ff" }}>{quality}%</span>
            </div>
            <input type="range" min={10} max={100} value={quality}
              onChange={e => setQuality(Number(e.target.value))} style={{ width: "100%" }} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={compress} disabled={loading} style={{ flex: 1 }}>
              {loading ? "Compressing..." : "Compress Image"}
            </button>
            {compressed && (
              <button className="btn-outline" onClick={download}>⬇ Download</button>
            )}
            <button className="btn-outline" onClick={() => { setOriginal(null); setCompressed(null); }}>✕ Clear</button>
          </div>

          {compressed && (
            <div style={{ 
              background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#22c55e"
            }}>
              🎉 Saved {fmt(original.size - compressed.size)} — {saving}% reduction in file size!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
