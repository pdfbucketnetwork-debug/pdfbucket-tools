"use client";
import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Download, Loader2, FileType2 } from "lucide-react";
// @ts-ignore
import mammoth from "mammoth";
// @ts-ignore
import html2pdf from "html2pdf.js";

export default function DocumentToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"]
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setError("");
    },
  });

  const handleConvert = async () => {
    if (!file || !contentRef.current) return;
    setIsProcessing(true);
    setError("");

    try {
      let htmlContent = "";

      if (file.name.endsWith(".txt")) {
        const text = await file.text();
        htmlContent = `<div style="font-family: Arial, sans-serif; white-space: pre-wrap; padding: 40px; font-size: 14px; line-height: 1.6;">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
      } else if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        htmlContent = `<div style="font-family: Arial, sans-serif; padding: 40px; font-size: 14px; line-height: 1.6;">${result.value}</div>`;
      }

      contentRef.current.innerHTML = htmlContent;

      // Use html2pdf to convert the hidden div
      const opt = {
        margin: 0,
        filename: file.name.replace(/\.[^/.]+$/, "") + ".pdf",
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in" as const, format: "letter" as const, orientation: "portrait" as const }
      };

      const pdfBlob = await html2pdf().set(opt).from(contentRef.current).output("blob");
      setResultUrl(URL.createObjectURL(pdfBlob));
      
    } catch (err) {
      console.error(err);
      setError("Failed to convert document. Please ensure it is a valid .docx or .txt file.");
    } finally {
      setIsProcessing(false);
      if (contentRef.current) contentRef.current.innerHTML = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hidden div for html2pdf rendering */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px", width: "800px" }}>
        <div ref={contentRef}></div>
      </div>

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
          <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Drop DOCX or TXT file here</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Converts Word and Text documents to PDF</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, border: "1px solid var(--border)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "var(--bg2)", padding: 10, borderRadius: 8 }}>
                <FileText size={24} color="var(--accent)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{file.name}</p>
                <p style={{ color: "var(--muted)", fontSize: 12 }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            {!isProcessing && !resultUrl && (
              <button
                onClick={() => { setFile(null); setResultUrl(null); }}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}
              >
                Change
              </button>
            )}
          </div>

          {error && <p style={{ color: "red", fontSize: 14, textAlign: "center" }}>{error}</p>}

          {!resultUrl && (
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="btn-primary"
              style={{ width: "100%", padding: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={18} /> Converting...</>
              ) : (
                <><FileType2 size={18} /> Convert to PDF</>
              )}
            </button>
          )}

          {resultUrl && (
            <div style={{ textAlign: "center" }}>
              <a
                href={resultUrl}
                download={file.name.replace(/\.[^/.]+$/, "") + ".pdf"}
                className="btn-primary"
                style={{ display: "inline-flex", textDecoration: "none", gap: 8, padding: "12px 24px" }}
              >
                <Download size={18} /> Download PDF
              </a>
              <button
                onClick={() => { setFile(null); setResultUrl(null); }}
                style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
              >
                Convert another file
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
