"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function TextExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setText(""); setProgress(0);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [] }, multiple: false
  });

  const extract = async () => {
    if (!file) return;
    setLoading(true); setProgress(0);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        }
      });
      const { data: { text: extracted } } = await worker.recognize(file);
      await worker.terminate();
      setText(extracted.trim());
    } catch (e) {
      setText("Error extracting text. Please try a clearer image.");
    }
    setLoading(false);
  };

  const copyText = () => navigator.clipboard.writeText(text);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {!file ? (
        <div {...getRootProps()} className={`drop-zone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
          <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, marginBottom: 6 }}>Drop image with text</p>
          <p style={{ color: "#8888a0", fontSize: 13, marginBottom: 16 }}>Screenshots, photos of documents, signs</p>
          <button type="button" className="btn-primary" style={{ padding: "8px 24px", fontSize: 13, pointerEvents: "none" }}>Browse Files</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <img src={preview} style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 10, background: "rgba(255,255,255,0.03)" }} />

          {loading && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#8888a0" }}>Extracting text...</span>
                <span style={{ fontSize: 13, color: "#6c63ff" }}>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {text && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#8888a0" }}>EXTRACTED TEXT</span>
                <button className="btn-outline" onClick={copyText} style={{ padding: "5px 12px", fontSize: 12 }}>Copy</button>
              </div>
              <textarea value={text} onChange={e => setText(e.target.value)}
                style={{ width: "100%", minHeight: 140, resize: "vertical", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace" }} />
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={extract} disabled={loading} style={{ flex: 1 }}>
              {loading ? "Processing..." : "Extract Text (OCR)"}
            </button>
            <button className="btn-outline" onClick={() => { setFile(null); setText(""); }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
