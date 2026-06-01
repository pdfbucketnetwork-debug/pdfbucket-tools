"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, Download, Loader2, Settings2, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
      setResultUrl(null);
      setError("");
    },
  });

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError("Failed to process PDFs. One of the files might be encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResultUrl(null);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newFiles = [...files];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      setFiles(newFiles);
    } else if (direction === "down" && index < files.length - 1) {
      const newFiles = [...files];
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
      setFiles(newFiles);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 16, padding: "32px 24px", textAlign: "center",
          background: isDragActive ? "var(--bg2)" : "var(--surface)",
          cursor: "pointer", transition: "all 0.2s"
        }}
      >
        <input {...getInputProps()} />
        <UploadCloud size={32} style={{ color: "var(--accent)", margin: "0 auto 12px" }} />
        <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Add PDF Files</p>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Upload multiple PDFs to merge and reorder them</p>
      </div>

      {files.length > 0 && !resultUrl && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {files.map((file, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <File size={20} color="var(--accent)" />
                <span style={{ fontSize: 14, fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {file.name}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => moveFile(i, "up")} disabled={i === 0} style={{ padding: 4, background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.3 : 1 }}>
                  ↑
                </button>
                <button onClick={() => moveFile(i, "down")} disabled={i === files.length - 1} style={{ padding: 4, background: "none", border: "none", cursor: i === files.length - 1 ? "default" : "pointer", opacity: i === files.length - 1 ? 0.3 : 1 }}>
                  ↓
                </button>
                <button onClick={() => removeFile(i)} style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "red" }}>
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {error && <p style={{ color: "red", fontSize: 14, textAlign: "center" }}>{error}</p>}

          <button
            onClick={handleMerge}
            disabled={isProcessing || files.length === 0}
            className="btn-primary"
            style={{ width: "100%", padding: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 12 }}
          >
            {isProcessing ? (
              <><Loader2 className="animate-spin" size={18} /> Processing...</>
            ) : (
              <><Settings2 size={18} /> Merge & Create PDF</>
            )}
          </button>
        </div>
      )}

      {resultUrl && (
        <div style={{ textAlign: "center", padding: 24, border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)" }}>
          <p style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: "var(--success)" }}>PDF Merged Successfully!</p>
          <a
            href={resultUrl}
            download="merged-document.pdf"
            className="btn-primary"
            style={{ display: "inline-flex", textDecoration: "none", gap: 8, padding: "12px 24px" }}
          >
            <Download size={18} /> Download Merged PDF
          </a>
          <button
            onClick={() => { setFiles([]); setResultUrl(null); }}
            style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
