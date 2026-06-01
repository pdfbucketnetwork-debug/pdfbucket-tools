"use client";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, Download, Loader2, Type, Image as ImageIcon, Eraser, Settings2, X } from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

type OverlayType = "text" | "image" | "whiteout";

interface Point { x: number; y: number; }

interface Overlay {
  id: string;
  type: OverlayType;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number;
  height: number;
  value?: string; // for text
  file?: File; // for image
  dataUrl?: string; // for image preview
  points?: Point[]; // for whiteout paths
}

export default function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const [numPages, setNumPages] = useState<number>(0);
  const [mode, setMode] = useState<OverlayType | null>(null);
  
  // Store overlays per page (1-indexed based on react-pdf)
  const [overlays, setOverlays] = useState<Record<number, Overlay[]>>({});
  
  // State for image upload when in image mode
  const [pendingImage, setPendingImage] = useState<{ file: File, dataUrl: string } | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);
  const containerRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setError("");
      setOverlays({});
      setMode(null);
    },
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const getCoordinates = (e: React.PointerEvent<HTMLDivElement>, rect: DOMRect) => {
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const handlePointerDown = (pageNumber: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (!mode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = getCoordinates(e, rect);

    if (mode === "whiteout") {
      setIsDrawing(true);
      const newId = Date.now().toString();
      setCurrentPathId(newId);
      const newOverlay: Overlay = {
        id: newId,
        type: "whiteout",
        x: coords.x,
        y: coords.y,
        width: 0, height: 0,
        points: [coords]
      };
      setOverlays(prev => ({ ...prev, [pageNumber]: [...(prev[pageNumber] || []), newOverlay] }));
      e.currentTarget.setPointerCapture(e.pointerId);
    } else {
      // Text or Image click-to-place
      if (mode === "image" && !pendingImage) {
        alert("Please upload an image first using the sidebar.");
        return;
      }
      const newOverlay: Overlay = {
        id: Date.now().toString(),
        type: mode,
        x: coords.x,
        y: coords.y,
        width: mode === "image" ? 30 : 20,
        height: mode === "image" ? 20 : 5,
        value: mode === "text" ? "" : undefined, // Empty starting value
        file: mode === "image" ? pendingImage?.file : undefined,
        dataUrl: mode === "image" ? pendingImage?.dataUrl : undefined,
      };
      setOverlays(prev => ({ ...prev, [pageNumber]: [...(prev[pageNumber] || []), newOverlay] }));
      
      // Reset mode after placing image so they don't accidentally place 10
      if (mode === "image") setMode(null);
    }
  };

  const handlePointerMove = (pageNumber: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || mode !== "whiteout" || !currentPathId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = getCoordinates(e, rect);

    setOverlays(prev => {
      const pageOverlays = prev[pageNumber] || [];
      const updated = pageOverlays.map(o => {
        if (o.id === currentPathId && o.points) {
          return { ...o, points: [...o.points, coords] };
        }
        return o;
      });
      return { ...prev, [pageNumber]: updated };
    });
  };

  const handlePointerUp = (pageNumber: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (isDrawing) {
      setIsDrawing(false);
      setCurrentPathId(null);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const updateOverlay = (pageNumber: number, id: string, updates: Partial<Overlay>) => {
    setOverlays(prev => ({
      ...prev,
      [pageNumber]: prev[pageNumber].map(o => o.id === id ? { ...o, ...updates } : o)
    }));
  };

  const removeOverlay = (pageNumber: number, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOverlays(prev => ({
      ...prev,
      [pageNumber]: prev[pageNumber].filter(o => o.id !== id)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingImage({ file, dataUrl: event.target?.result as string });
      setMode("image");
    };
    reader.readAsDataURL(file);
  };

  const handleExport = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const [pageStr, pageOverlays] of Object.entries(overlays)) {
        const pageIndex = parseInt(pageStr) - 1; 
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        for (const overlay of pageOverlays) {
          if (overlay.type === "text" && overlay.value) {
            const absoluteX = (overlay.x / 100) * width;
            const absoluteY = height - ((overlay.y / 100) * height);
            page.drawText(overlay.value, {
              x: absoluteX,
              y: absoluteY - 16, 
              size: 16,
              color: rgb(0, 0, 0),
            });
          } else if (overlay.type === "whiteout" && overlay.points && overlay.points.length > 0) {
            // Convert percentage points to absolute coords
            let pathSvg = "";
            overlay.points.forEach((pt, i) => {
              const absX = (pt.x / 100) * width;
              const absY = height - ((pt.y / 100) * height);
              if (i === 0) pathSvg += `M ${absX} ${absY} `;
              else pathSvg += `L ${absX} ${absY} `;
            });
            
            page.drawSvgPath(pathSvg, {
              color: undefined, 
              borderColor: rgb(1, 1, 1),
              borderWidth: 15,
            });
          } else if (overlay.type === "image" && overlay.file) {
            const absoluteX = (overlay.x / 100) * width;
            const absoluteY = height - ((overlay.y / 100) * height);
            const imageBytes = await overlay.file.arrayBuffer();
            let pdfImage;
            if (overlay.file.type === "image/png") {
              pdfImage = await pdfDoc.embedPng(imageBytes);
            } else {
              pdfImage = await pdfDoc.embedJpg(imageBytes);
            }
            const w = (overlay.width / 100) * width;
            const h = (overlay.height / 100) * height;
            page.drawImage(pdfImage, {
              x: absoluteX,
              y: absoluteY - h,
              width: w,
              height: h,
            });
          }
        }
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes as any], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError("Failed to edit PDF. Ensure the file is not encrypted.");
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
          <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Upload PDF to Edit Visually</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Click anywhere on your PDF to sketch whiteout, write text, or place images natively.</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          
          {/* Sidebar Tools */}
          <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 24 }}>
            <div style={{ border: "1px solid var(--border)", padding: 24, borderRadius: 12, background: "var(--surface)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Settings2 size={18} /> Tools
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  onClick={() => setMode("text")}
                  style={{ padding: 12, borderRadius: 8, border: `1px solid ${mode === "text" ? "var(--accent)" : "var(--border)"}`, background: mode === "text" ? "var(--accent-hover-bg)" : "var(--bg2)", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontWeight: 500, color: mode === "text" ? "var(--accent)" : "var(--text)", textAlign: "left", transition: "all 0.1s" }}
                >
                  <Type size={18} /> Add Text Tool
                </button>
                
                <button
                  onClick={() => setMode("whiteout")}
                  style={{ padding: 12, borderRadius: 8, border: `1px solid ${mode === "whiteout" ? "var(--accent)" : "var(--border)"}`, background: mode === "whiteout" ? "var(--accent-hover-bg)" : "var(--bg2)", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontWeight: 500, color: mode === "whiteout" ? "var(--accent)" : "var(--text)", textAlign: "left", transition: "all 0.1s" }}
                >
                  <Eraser size={18} /> Eraser (Sketch)
                </button>

                <div style={{ padding: 12, borderRadius: 8, border: `1px solid ${mode === "image" ? "var(--accent)" : "var(--border)"}`, background: mode === "image" ? "var(--accent-hover-bg)" : "var(--bg2)", transition: "all 0.1s" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 500, color: mode === "image" ? "var(--accent)" : "var(--text)", cursor: "pointer" }}>
                    <ImageIcon size={18} /> Upload Image
                    <input type="file" accept="image/png, image/jpeg" style={{ display: "none" }} onChange={handleImageUpload} />
                  </label>
                  {pendingImage && (
                    <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>Ready: {pendingImage.file.name}</div>
                  )}
                </div>
              </div>

              {mode === "whiteout" && (
                <p style={{ marginTop: 16, fontSize: 13, color: "var(--muted)" }}>Click and drag to physically sketch whiteout strokes over the text.</p>
              )}
              {mode === "text" && (
                <p style={{ marginTop: 16, fontSize: 13, color: "var(--muted)" }}>Click anywhere to spawn a native cursor, just like a notes app.</p>
              )}

              {error && <p style={{ color: "red", fontSize: 14, marginTop: 16 }}>{error}</p>}

              {!resultUrl ? (
                <button
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="btn-primary"
                  style={{ width: "100%", marginTop: 24, padding: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
                >
                  {isProcessing ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : <><Download size={18} /> Export PDF</>}
                </button>
              ) : (
                <div style={{ marginTop: 24 }}>
                  <a href={resultUrl} download={file.name.replace(/\.pdf$/i, "") + "-edited.pdf"} className="btn-primary" style={{ display: "flex", justifyContent: "center", textDecoration: "none", gap: 8, padding: 16 }}>
                    <Download size={18} /> Download Result
                  </a>
                </div>
              )}
            </div>
            
            <button onClick={() => { setFile(null); setResultUrl(null); setOverlays({}); }} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14, textDecoration: "underline" }}>
              Start Over with New PDF
            </button>
          </div>

          {/* Visual PDF Canvas */}
          <div style={{ flex: "2 1 500px", border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg2)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", height: "80vh", overflowY: "auto", position: "relative", cursor: mode === "whiteout" ? "cell" : mode ? "crosshair" : "default" }}>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div style={{ padding: 40, textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "0 auto" }} /> Loading PDF Visuals...</div>}
            >
              {Array.from(new Array(numPages), (el, index) => {
                const pageNum = index + 1;
                return (
                  <div key={`page_${pageNum}`} style={{ position: "relative", marginBottom: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", background: "white" }}>
                    <Page 
                      pageNumber={pageNum} 
                      renderTextLayer={false} 
                      renderAnnotationLayer={false}
                      width={600}
                    />
                    
                    {/* Interaction Layer for Drawing & Clicking */}
                    <div 
                      ref={(el) => { containerRefs.current[pageNum] = el; }}
                      onPointerDown={(e) => handlePointerDown(pageNum, e)}
                      onPointerMove={(e) => handlePointerMove(pageNum, e)}
                      onPointerUp={(e) => handlePointerUp(pageNum, e)}
                      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, touchAction: "none" }}
                    >
                      {/* Render Whiteout SVG Layer */}
                      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
                        {(overlays[pageNum] || []).filter(o => o.type === "whiteout" && o.points).map(overlay => {
                          const pointsStr = overlay.points!.map(pt => `${pt.x}%,${pt.y}%`).join(' ');
                          return (
                            <polyline 
                              key={overlay.id} 
                              points={pointsStr} 
                              stroke="white" 
                              strokeWidth="15" 
                              fill="none" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                            />
                          );
                        })}
                      </svg>

                      {/* Render Text & Image Overlays */}
                      {(overlays[pageNum] || []).filter(o => o.type !== "whiteout").map(overlay => (
                        <div 
                          key={overlay.id} 
                          className="overlay-element"
                          style={{ 
                            position: "absolute", 
                            left: `${overlay.x}%`, 
                            top: `${overlay.y}%`, 
                            width: overlay.type === "image" ? `${overlay.width}%` : "max-content", 
                            height: overlay.type === "image" ? `${overlay.height}%` : "auto",
                          }}
                          onPointerDown={(e) => e.stopPropagation()} // Prevent spawning new element when clicking existing
                        >
                          <style>{`
                            .overlay-element .delete-btn { opacity: 0; transition: opacity 0.2s; }
                            .overlay-element:hover .delete-btn { opacity: 1; }
                          `}</style>
                          
                          <button 
                            className="delete-btn"
                            onClick={(e) => removeOverlay(pageNum, overlay.id, e)} 
                            style={{ position: "absolute", top: -10, right: overlay.type === "image" ? -10 : -20, background: "rgba(255,50,50,0.9)", color: "white", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
                          >
                            <X size={12} />
                          </button>
                          
                          {overlay.type === "text" && (
                            <input 
                              type="text" 
                              value={overlay.value || ""} 
                              onChange={(e) => updateOverlay(pageNum, overlay.id, { value: e.target.value })}
                              placeholder=""
                              style={{ 
                                width: Math.max(50, (overlay.value?.length || 0) * 10 + 20) + "px", 
                                background: "transparent", 
                                border: "none", 
                                outline: "none", 
                                fontSize: 16, 
                                fontFamily: "sans-serif",
                                color: "black",
                                padding: "0 2px"
                              }}
                              autoFocus
                            />
                          )}
                          
                          {overlay.type === "image" && (
                            <img src={overlay.dataUrl} style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} alt="Stamp" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
}
