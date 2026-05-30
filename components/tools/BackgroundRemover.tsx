"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { removeBackground, Config } from "@imgly/background-removal";
import { UploadCloud, Image as ImageIcon, Download, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const f = acceptedFiles[0];
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setResultUrl(null);
      setMessage("");
    },
  });

  const handleRemoveBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setMessage("Initializing AI model (this may take a moment on first run)...");

    try {
      const config: Config = {
        progress: (key, current, total) => {
          if (total > 0) {
            setProgress((current / total) * 100);
            setMessage(`Processing: ${key}...`);
          }
        },
      };

      const blob = await removeBackground(file, config);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setMessage("Background removed successfully!");
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. The image might be too complex or unsupported.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {!file ? (
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 16, padding: "64px 24px", textAlign: "center",
            background: isDragActive ? "var(--bg2)" : "var(--surface)",
            cursor: "pointer", transition: "all 0.2s"
          }}
        >
          <input {...getInputProps()} />
          <UploadCloud size={48} style={{ color: "var(--accent)", margin: "0 auto 16px" }} />
          <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Drop an image here</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Supports JPG, PNG, WEBP (Max 10MB)</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Preview Area */}
          <div style={{ 
            position: "relative", width: "100%", height: 300, 
            borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)",
            background: "repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px",
          }}>
            <Image
              src={resultUrl || previewUrl!}
              alt="Preview"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, border: "1px solid var(--border)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "var(--bg2)", padding: 10, borderRadius: 8 }}>
                <ImageIcon size={24} color="var(--accent)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200, whiteSpace: "nowrap" }}>
                  {file.name}
                </p>
                <p style={{ color: "var(--muted)", fontSize: 12 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!isProcessing && !resultUrl && (
              <button
                onClick={() => { setFile(null); setPreviewUrl(null); setResultUrl(null); }}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}
              >
                Change
              </button>
            )}
          </div>

          {!resultUrl && (
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="btn-primary"
              style={{ width: "100%", padding: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {progress > 0 ? `Processing (${progress.toFixed(0)}%)` : "Initializing AI..."}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Remove Background
                </>
              )}
            </button>
          )}

          {isProcessing && (
            <div style={{ background: "var(--bg2)", height: 8, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ background: "var(--accent)", height: "100%", width: `${progress}%`, transition: "width 0.2s" }} />
            </div>
          )}

          {message && <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>{message}</p>}

          {resultUrl && (
            <div style={{ textAlign: "center" }}>
              <a
                href={resultUrl}
                download={file.name.replace(/\.[^/.]+$/, "") + "-transparent.png"}
                className="btn-primary"
                style={{ display: "inline-flex", textDecoration: "none", gap: 8, padding: "12px 24px" }}
              >
                <Download size={18} /> Download Transparent PNG
              </a>
              <button
                onClick={() => { setFile(null); setPreviewUrl(null); setResultUrl(null); }}
                style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
              >
                Process another image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
