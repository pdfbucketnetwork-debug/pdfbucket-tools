"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud, Download, Loader2, Type, Image as ImageIcon,
  Eraser, X, Pen, Square, Circle, Minus, ArrowRight,
  Highlighter, PenTool, Undo2, Redo2, ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight, Bold, Italic, Trash2, Check
} from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

// ─── Types ───
type ToolMode = "select" | "text" | "draw" | "rect" | "circle" | "line" | "arrow" | "highlight" | "image" | "signature" | "eraser";

interface Point { x: number; y: number; }

interface Overlay {
  id: string;
  type: ToolMode;
  page: number;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  // Text
  value?: string;
  fontSize?: number;
  fontColor?: string;
  bold?: boolean;
  italic?: boolean;
  bgWhiteout?: boolean;
  // Draw / eraser
  points?: Point[];
  strokeColor?: string;
  strokeWidth?: number;
  // Shape
  fillColor?: string;
  // Image
  dataUrl?: string;
  // Highlight
  highlightColor?: string;
  opacity?: number;
  // Signature
  signatureDataUrl?: string;
}

type HistoryEntry = {
  overlays: Record<number, Overlay[]>;
};

// ─── Helper: Wrap Text for PDF Export ───
const wrapText = (text: string, maxWidth: number, font: any, fontSize: number): string[] => {
  const paragraphs = text.split("\n");
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (!para) {
      lines.push("");
      continue;
    }
    const words = para.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  return lines;
};

// ─── Constants ───
const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const HIGHLIGHT_COLORS = ["#FBBF24", "#34D399", "#60A5FA", "#F472B6", "#FB923C"];
const DRAW_COLORS = ["#000000", "#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
const STROKE_WIDTHS = [1, 2, 3, 5, 8];

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export default function PdfEditor() {
  // ─── File State ───
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ─── PDF State ───
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);

  // ─── Tool State ───
  const [mode, setMode] = useState<ToolMode>("select");
  const [overlays, setOverlays] = useState<Record<number, Overlay[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ─── Text Tool Options ───
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontBold, setFontBold] = useState(false);
  const [fontItalic, setFontItalic] = useState(false);
  const [textBgWhiteout, setTextBgWhiteout] = useState(false);

  // ─── Draw / Shape Options ───
  const [drawColor, setDrawColor] = useState("#000000");
  const [drawWidth, setDrawWidth] = useState(3);
  const [shapeFill, setShapeFill] = useState("transparent");
  const [shapeStroke, setShapeStroke] = useState("#000000");
  const [eraserType, setEraserType] = useState<"brush" | "box">("brush");

  // ─── Highlight ───
  const [highlightColor, setHighlightColor] = useState("#FBBF24");

  // ─── Drawing State ───
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingOverlayId, setDrawingOverlayId] = useState<string | null>(null);
  const [shapeStart, setShapeStart] = useState<Point | null>(null);

  // ─── Drag State ───
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });

  // ─── Resize State ───
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState<string>("");
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; ox: number; oy: number; ow: number; oh: number } | null>(null);

  // ─── History ───
  const [history, setHistory] = useState<HistoryEntry[]>([{ overlays: {} }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // ─── Image Upload ───
  const [pendingImage, setPendingImage] = useState<{ file: File; dataUrl: string } | null>(null);

  // ─── Signature Modal ───
  const [showSignature, setShowSignature] = useState(false);
  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [sigText, setSigText] = useState("");
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sigDrawing, setSigDrawing] = useState(false);

  // ─── Toast ───
  const [toast, setToast] = useState<string | null>(null);

  const pageContainerRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(null);
    if (toastTimer) clearTimeout(toastTimer);
    setTimeout(() => setToast(msg), 10);
    toastTimer = setTimeout(() => setToast(null), 2000);
  }, []);

  // ─── Dropzone ───
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (accepted) => {
      if (accepted[0]) {
        setFile(accepted[0]);
        setResultUrl(null);
        setError("");
        setOverlays({});
        setMode("select");
        setCurrentPage(1);
        setZoom(1);
        setHistory([{ overlays: {} }]);
        setHistoryIndex(0);
        setSelectedId(null);
      }
    },
  });

  // ─── History Management ───
  const pushHistory = useCallback((newOverlays: Record<number, Overlay[]>) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { overlays: JSON.parse(JSON.stringify(newOverlays)) }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setOverlays(JSON.parse(JSON.stringify(history[newIndex].overlays)));
    setSelectedId(null);
    showToast("Undone");
  }, [historyIndex, history, showToast]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setOverlays(JSON.parse(JSON.stringify(history[newIndex].overlays)));
    setSelectedId(null);
    showToast("Redone");
  }, [historyIndex, history, showToast]);

  // ─── Keyboard Shortcuts ───
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          deleteSelected();
        }
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        setMode("select");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, undo, redo]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    const newOverlays = { ...overlays };
    for (const page of Object.keys(newOverlays)) {
      const p = Number(page);
      newOverlays[p] = newOverlays[p].filter(o => o.id !== selectedId);
    }
    setOverlays(newOverlays);
    pushHistory(newOverlays);
    setSelectedId(null);
    showToast("Element deleted");
  }, [selectedId, overlays, pushHistory, showToast]);

  // ─── Coordinate Helpers ───
  const getCoords = (e: React.PointerEvent<HTMLDivElement>, rect: DOMRect): Point => ({
    x: ((e.clientX - rect.left) / rect.width) * 100,
    y: ((e.clientY - rect.top) / rect.height) * 100,
  });

  // ─── Canvas Interaction Handlers ───
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = getCoords(e, rect);
    const pageNum = currentPage;

    if (mode === "select") {
      setSelectedId(null);
      return;
    }

    if (mode === "text") {
      const target = e.target as HTMLElement;
      const textSpan = target.closest('.react-pdf__Page__textLayer span, .react-pdf__Page__textLayer div');
      if (textSpan && textSpan.textContent && textSpan.textContent.trim()) {
        e.preventDefault();
        e.stopPropagation();

        const pageWrapper = e.currentTarget;
        const pageRect = pageWrapper.getBoundingClientRect();
        const spanRect = textSpan.getBoundingClientRect();

        const x = ((spanRect.left - pageRect.left) / pageRect.width) * 100;
        const y = ((spanRect.top - pageRect.top) / pageRect.height) * 100;
        const w = (spanRect.width / pageRect.width) * 100;
        const h = (spanRect.height / pageRect.height) * 100;

        let fSize = 16;
        const styleFontSize = window.getComputedStyle(textSpan).fontSize;
        if (styleFontSize) {
          fSize = parseFloat(styleFontSize) / zoom;
        }

        const id = `overlay_${Date.now()}`;
        const newOverlay: Overlay = {
          id, type: "text", page: pageNum,
          x: x - 0.2, y: y - 0.2, width: w + 1.5, height: h + 0.4,
          value: textSpan.textContent.trim(), fontSize: Math.round(fSize), fontColor: "#000000",
          bgWhiteout: true,
        };

        const newOverlays = { ...overlays, [pageNum]: [...(overlays[pageNum] || []), newOverlay] };
        setOverlays(newOverlays);
        pushHistory(newOverlays);
        setSelectedId(id);
        return;
      }

      // Deselect previous text if clicking elsewhere
      setSelectedId(null);
      const id = `overlay_${Date.now()}`;
      const newOverlay: Overlay = {
        id, type: "text", page: pageNum,
        x: coords.x, y: coords.y - 1.2, width: 25, height: 6,
        value: "", fontSize, fontColor, bold: fontBold, italic: fontItalic,
        bgWhiteout: textBgWhiteout,
      };
      const newOverlays = { ...overlays, [pageNum]: [...(overlays[pageNum] || []), newOverlay] };
      setOverlays(newOverlays);
      pushHistory(newOverlays);
      setSelectedId(id);
      // Stay in text mode so user can click again to add more text
      return;
    }

    if (mode === "image") {
      if (!pendingImage) {
        showToast("Upload an image first");
        return;
      }
      const id = `overlay_${Date.now()}`;
      const newOverlay: Overlay = {
        id, type: "image", page: pageNum,
        x: coords.x - 10, y: coords.y - 8,
        width: 20, height: 16,
        dataUrl: pendingImage.dataUrl,
      };
      const newOverlays = { ...overlays, [pageNum]: [...(overlays[pageNum] || []), newOverlay] };
      setOverlays(newOverlays);
      pushHistory(newOverlays);
      setPendingImage(null);
      setMode("select");
      setSelectedId(id);
      showToast("Image placed");
      return;
    }

    if (mode === "signature") {
      setShowSignature(true);
      return;
    }

    if (mode === "draw") {
      setIsDrawing(true);
      const id = `overlay_${Date.now()}`;
      setDrawingOverlayId(id);
      const newOverlay: Overlay = {
        id, type: "draw", page: pageNum,
        x: 0, y: 0, width: 100, height: 100,
        points: [coords],
        strokeColor: drawColor,
        strokeWidth: drawWidth,
      };
      const newOverlays = { ...overlays, [pageNum]: [...(overlays[pageNum] || []), newOverlay] };
      setOverlays(newOverlays);
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (mode === "eraser") {
      setIsDrawing(true);
      const id = `overlay_${Date.now()}`;
      setDrawingOverlayId(id);
      if (eraserType === "box") {
        setShapeStart(coords);
        const newOverlay: Overlay = {
          id, type: "rect", page: pageNum,
          x: coords.x, y: coords.y, width: 0, height: 0,
          strokeColor: "#FFFFFF", strokeWidth: 0,
          fillColor: "#FFFFFF",
        };
        const newOverlays = { ...overlays, [pageNum]: [...(overlays[pageNum] || []), newOverlay] };
        setOverlays(newOverlays);
      } else {
        const newOverlay: Overlay = {
          id, type: "eraser", page: pageNum,
          x: 0, y: 0, width: 100, height: 100,
          points: [coords],
          strokeColor: "#FFFFFF",
          strokeWidth: 15,
        };
        const newOverlays = { ...overlays, [pageNum]: [...(overlays[pageNum] || []), newOverlay] };
        setOverlays(newOverlays);
      }
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (mode === "highlight") {
      setIsDrawing(true);
      setShapeStart(coords);
      const id = `overlay_${Date.now()}`;
      setDrawingOverlayId(id);
      const newOverlay: Overlay = {
        id, type: "highlight", page: pageNum,
        x: coords.x, y: coords.y, width: 0, height: 0,
        highlightColor, opacity: 0.35,
      };
      const newOverlays = { ...overlays, [pageNum]: [...(overlays[pageNum] || []), newOverlay] };
      setOverlays(newOverlays);
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    // Shape tools
    if (["rect", "circle", "line", "arrow"].includes(mode)) {
      setIsDrawing(true);
      setShapeStart(coords);
      const id = `overlay_${Date.now()}`;
      setDrawingOverlayId(id);
      const newOverlay: Overlay = {
        id, type: mode, page: pageNum,
        x: coords.x, y: coords.y, width: 0, height: 0,
        strokeColor: shapeStroke, strokeWidth: drawWidth,
        fillColor: shapeFill,
        points: mode === "line" || mode === "arrow" ? [coords, coords] : undefined,
      };
      const newOverlays = { ...overlays, [pageNum]: [...(overlays[pageNum] || []), newOverlay] };
      setOverlays(newOverlays);
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawingOverlayId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = getCoords(e, rect);
    const pageNum = currentPage;

    if (mode === "draw" || (mode === "eraser" && eraserType === "brush")) {
      setOverlays(prev => {
        const pageOverlays = prev[pageNum] || [];
        return {
          ...prev,
          [pageNum]: pageOverlays.map(o =>
            o.id === drawingOverlayId && o.points
              ? { ...o, points: [...o.points, coords] }
              : o
          )
        };
      });
      return;
    }

    if (shapeStart && (mode === "highlight" || mode === "rect" || mode === "circle" || (mode === "eraser" && eraserType === "box"))) {
      const x = Math.min(shapeStart.x, coords.x);
      const y = Math.min(shapeStart.y, coords.y);
      const w = Math.abs(coords.x - shapeStart.x);
      const h = Math.abs(coords.y - shapeStart.y);
      setOverlays(prev => ({
        ...prev,
        [pageNum]: (prev[pageNum] || []).map(o =>
          o.id === drawingOverlayId ? { ...o, x, y, width: w, height: h } : o
        )
      }));
      return;
    }

    if (shapeStart && (mode === "line" || mode === "arrow")) {
      setOverlays(prev => ({
        ...prev,
        [pageNum]: (prev[pageNum] || []).map(o =>
          o.id === drawingOverlayId ? { ...o, points: [shapeStart, coords] } : o
        )
      }));
      return;
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDrawing) {
      setIsDrawing(false);
      if (drawingOverlayId) {
        pushHistory(overlays);
      }
      setDrawingOverlayId(null);
      setShapeStart(null);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // ─── Drag & Drop Handlers ───
  const handleElementPointerDown = (overlayId: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (mode !== "select" && mode !== "text") return;

    setSelectedId(overlayId);
    const overlay = findOverlay(overlayId);
    if (!overlay) return;

    const parent = e.currentTarget.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const coords = getCoords(e, rect);

    setIsDragging(true);
    setDragOffset({ x: coords.x - overlay.x, y: coords.y - overlay.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleElementPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !selectedId) return;
    const parent = e.currentTarget.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const coords = getCoords(e, rect);

    const overlay = findOverlay(selectedId);
    if (!overlay) return;

    const newX = Math.max(0, Math.min(100 - overlay.width, coords.x - dragOffset.x));
    const newY = Math.max(0, Math.min(100 - overlay.height, coords.y - dragOffset.y));

    setOverlays(prev => ({
      ...prev,
      [overlay.page]: (prev[overlay.page] || []).map(o =>
        o.id === selectedId ? { ...o, x: newX, y: newY } : o
      )
    }));
  };

  const handleElementPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      pushHistory(overlays);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // ─── Resize Handlers ───
  const handleResizeStart = (corner: string, overlayId: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const overlay = findOverlay(overlayId);
    if (!overlay) return;
    const parent = e.currentTarget.closest('.pdf-page-wrapper') as HTMLElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const coords = getCoords(e, rect);

    setIsResizing(true);
    setResizeCorner(corner);
    setResizeStart({ x: coords.x, y: coords.y, ox: overlay.x, oy: overlay.y, ow: overlay.width, oh: overlay.height });
    setSelectedId(overlayId);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing || !selectedId || !resizeStart) return;
    const parent = e.currentTarget.closest('.pdf-page-wrapper') as HTMLElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const coords = getCoords(e, rect);

    const dx = coords.x - resizeStart.x;
    const dy = coords.y - resizeStart.y;
    const overlay = findOverlay(selectedId);
    if (!overlay) return;

    let newX = resizeStart.ox, newY = resizeStart.oy;
    let newW = resizeStart.ow, newH = resizeStart.oh;

    if (resizeCorner.includes("e")) newW = Math.max(2, resizeStart.ow + dx);
    if (resizeCorner.includes("s")) newH = Math.max(2, resizeStart.oh + dy);
    if (resizeCorner.includes("w")) { newX = resizeStart.ox + dx; newW = Math.max(2, resizeStart.ow - dx); }
    if (resizeCorner.includes("n")) { newY = resizeStart.oy + dy; newH = Math.max(2, resizeStart.oh - dy); }

    setOverlays(prev => ({
      ...prev,
      [overlay.page]: (prev[overlay.page] || []).map(o =>
        o.id === selectedId ? { ...o, x: newX, y: newY, width: newW, height: newH } : o
      )
    }));
  };

  const handleResizeEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizing) {
      setIsResizing(false);
      setResizeStart(null);
      pushHistory(overlays);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // ─── Helpers ───
  const findOverlay = useCallback((id: string): Overlay | null => {
    for (const pageOverlays of Object.values(overlays)) {
      const found = pageOverlays.find(o => o.id === id);
      if (found) return found;
    }
    return null;
  }, [overlays]);

  useEffect(() => {
    if (selectedId) {
      const selected = findOverlay(selectedId);
      if (selected && selected.type === "text") {
        setFontSize(selected.fontSize || 16);
        setFontColor(selected.fontColor || "#000000");
        setFontBold(!!selected.bold);
        setFontItalic(!!selected.italic);
        setTextBgWhiteout(!!selected.bgWhiteout);
      }
    }
  }, [selectedId, findOverlay]);

  const updateOverlay = (id: string, updates: Partial<Overlay>) => {
    const overlay = findOverlay(id);
    if (!overlay) return;
    const newOverlays = {
      ...overlays,
      [overlay.page]: (overlays[overlay.page] || []).map(o =>
        o.id === id ? { ...o, ...updates } : o
      )
    };
    setOverlays(newOverlays);
    pushHistory(newOverlays);
  };

  // ─── Image Upload Handler ───
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingImage({ file: f, dataUrl: ev.target?.result as string });
      setMode("image");
      showToast("Click on PDF to place image");
    };
    reader.readAsDataURL(f);
  };

  // ─── Signature Handlers ───
  const sigStartDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    setSigDrawing(true);
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(
      (e.clientX - rect.left) * (canvas.width / rect.width),
      (e.clientY - rect.top) * (canvas.height / rect.height)
    );
    canvas.setPointerCapture(e.pointerId);
  };

  const sigDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!sigDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(
      (e.clientX - rect.left) * (canvas.width / rect.width),
      (e.clientY - rect.top) * (canvas.height / rect.height)
    );
    ctx.stroke();
  };

  const sigEndDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setSigDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas) canvas.releasePointerCapture(e.pointerId);
  };

  const clearSigCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const placeSignature = () => {
    let dataUrl = "";
    if (sigMode === "draw") {
      const canvas = sigCanvasRef.current;
      if (!canvas) return;
      dataUrl = canvas.toDataURL("image/png");
    } else {
      // Type mode: render text to canvas
      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = 400;
      tmpCanvas.height = 120;
      const ctx = tmpCanvas.getContext("2d")!;
      ctx.font = "italic 40px 'Georgia', serif";
      ctx.fillStyle = "#000";
      ctx.fillText(sigText || "Signature", 20, 75);
      dataUrl = tmpCanvas.toDataURL("image/png");
    }

    const id = `overlay_${Date.now()}`;
    const newOverlay: Overlay = {
      id, type: "signature", page: currentPage,
      x: 30, y: 70, width: 25, height: 10,
      signatureDataUrl: dataUrl, dataUrl,
    };
    const newOverlays = { ...overlays, [currentPage]: [...(overlays[currentPage] || []), newOverlay] };
    setOverlays(newOverlays);
    pushHistory(newOverlays);
    setShowSignature(false);
    setMode("select");
    setSelectedId(id);
    showToast("Signature placed — drag to reposition");
  };

  // ─── Export Handler ───
  const handleExport = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Embed fonts
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const helveticaBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

      for (const [pageStr, pageOverlays] of Object.entries(overlays)) {
        const pageIndex = parseInt(pageStr) - 1;
        if (pageIndex < 0 || pageIndex >= pages.length) continue;
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        for (const overlay of pageOverlays) {
          const absX = (overlay.x / 100) * width;
          const absY = height - ((overlay.y / 100) * height);

          if (overlay.type === "text" && overlay.value) {
            let font = helvetica;
            if (overlay.bold && overlay.italic) font = helveticaBoldOblique;
            else if (overlay.bold) font = helveticaBold;
            else if (overlay.italic) font = helveticaOblique;

            const color = hexToRgb(overlay.fontColor || "#000000");
            const fSize = overlay.fontSize || 16;
            const lineHeight = fSize * 1.4;

            const w = (overlay.width / 100) * width;
            const h = (overlay.height / 100) * height;

            // Draw whiteout background block if enabled
            if (overlay.bgWhiteout) {
              page.drawRectangle({
                x: absX,
                y: absY - h,
                width: w,
                height: h,
                color: rgb(1, 1, 1),
              });
            }

            // Wrap and draw text lines to fit the bounding box width
            const lines = wrapText(overlay.value, w - 8, font, fSize);
            lines.forEach((line, lineIdx) => {
              if (!line) return; // skip empty lines but keep spacing
              page.drawText(line, {
                x: absX + 4,
                y: absY - fSize - 4 - (lineIdx * lineHeight),
                size: fSize,
                font,
                color: rgb(color.r, color.g, color.b),
              });
            });
          }

          if ((overlay.type === "draw" || overlay.type === "eraser") && overlay.points && overlay.points.length > 1) {
            const color = hexToRgb(overlay.strokeColor || "#000000");
            let pathD = "";
            overlay.points.forEach((pt, i) => {
              const px = (pt.x / 100) * width;
              const py = height - ((pt.y / 100) * height);
              if (i === 0) pathD += `M ${px} ${py} `;
              else pathD += `L ${px} ${py} `;
            });
            page.drawSvgPath(pathD, {
              borderColor: rgb(color.r, color.g, color.b),
              borderWidth: overlay.strokeWidth || 3,
              color: undefined,
            });
          }

          if (overlay.type === "rect") {
            const color = hexToRgb(overlay.strokeColor || "#000000");
            const w = (overlay.width / 100) * width;
            const h = (overlay.height / 100) * height;
            const fillC = overlay.fillColor && overlay.fillColor !== "transparent"
              ? hexToRgb(overlay.fillColor) : undefined;
            page.drawRectangle({
              x: absX,
              y: absY - h,
              width: w,
              height: h,
              borderColor: (overlay.strokeWidth === 0 || overlay.strokeColor === "transparent") ? undefined : rgb(color.r, color.g, color.b),
              borderWidth: overlay.strokeWidth ?? 2,
              color: fillC ? rgb(fillC.r, fillC.g, fillC.b) : undefined,
              opacity: fillC ? (overlay.fillColor === "#FFFFFF" ? 1.0 : 0.3) : undefined,
            });
          }

          if (overlay.type === "circle") {
            const color = hexToRgb(overlay.strokeColor || "#000000");
            const w = (overlay.width / 100) * width;
            const h = (overlay.height / 100) * height;
            page.drawEllipse({
              x: absX + w / 2,
              y: absY - h / 2,
              xScale: w / 2,
              yScale: h / 2,
              borderColor: rgb(color.r, color.g, color.b),
              borderWidth: overlay.strokeWidth || 2,
              color: undefined,
            });
          }

          if ((overlay.type === "line" || overlay.type === "arrow") && overlay.points && overlay.points.length === 2) {
            const color = hexToRgb(overlay.strokeColor || "#000000");
            const p1x = (overlay.points[0].x / 100) * width;
            const p1y = height - ((overlay.points[0].y / 100) * height);
            const p2x = (overlay.points[1].x / 100) * width;
            const p2y = height - ((overlay.points[1].y / 100) * height);
            page.drawLine({
              start: { x: p1x, y: p1y },
              end: { x: p2x, y: p2y },
              color: rgb(color.r, color.g, color.b),
              thickness: overlay.strokeWidth || 2,
            });

            if (overlay.type === "arrow") {
              const angle = Math.atan2(p2y - p1y, p2x - p1x);
              const headLen = 12;
              const a1x = p2x - headLen * Math.cos(angle - Math.PI / 6);
              const a1y = p2y - headLen * Math.sin(angle - Math.PI / 6);
              const a2x = p2x - headLen * Math.cos(angle + Math.PI / 6);
              const a2y = p2y - headLen * Math.sin(angle + Math.PI / 6);
              page.drawLine({ start: { x: p2x, y: p2y }, end: { x: a1x, y: a1y }, color: rgb(color.r, color.g, color.b), thickness: overlay.strokeWidth || 2 });
              page.drawLine({ start: { x: p2x, y: p2y }, end: { x: a2x, y: a2y }, color: rgb(color.r, color.g, color.b), thickness: overlay.strokeWidth || 2 });
            }
          }

          if (overlay.type === "highlight") {
            const color = hexToRgb(overlay.highlightColor || "#FBBF24");
            const w = (overlay.width / 100) * width;
            const h = (overlay.height / 100) * height;
            page.drawRectangle({
              x: absX,
              y: absY - h,
              width: w,
              height: h,
              color: rgb(color.r, color.g, color.b),
              opacity: overlay.opacity || 0.35,
            });
          }

          if ((overlay.type === "image" || overlay.type === "signature") && overlay.dataUrl) {
            try {
              const resp = await fetch(overlay.dataUrl);
              const imgBytes = await resp.arrayBuffer();
              let pdfImage;
              if (overlay.dataUrl.startsWith("data:image/png")) {
                pdfImage = await pdfDoc.embedPng(imgBytes);
              } else {
                pdfImage = await pdfDoc.embedJpg(imgBytes);
              }
              const w = (overlay.width / 100) * width;
              const h = (overlay.height / 100) * height;
              page.drawImage(pdfImage, {
                x: absX,
                y: absY - h,
                width: w,
                height: h,
              });
            } catch {
              console.warn("Failed to embed image overlay", overlay.id);
            }
          }
        }
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes as any], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      showToast("PDF exported successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to export PDF. Ensure the file is not encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Rendering Helpers ───
  const hexToRgb = (hex: string) => {
    const c = hex.replace("#", "");
    return {
      r: parseInt(c.substring(0, 2), 16) / 255,
      g: parseInt(c.substring(2, 4), 16) / 255,
      b: parseInt(c.substring(4, 6), 16) / 255,
    };
  };

  const pageWidth = Math.round(600 * zoom);

  const getCursor = () => {
    if (mode === "draw" || mode === "eraser") return "crosshair";
    if (mode === "text") return "text";
    if (["rect", "circle", "line", "arrow", "highlight"].includes(mode)) return "crosshair";
    if (mode === "image") return "copy";
    return "default";
  };

  const currentPageOverlays = overlays[currentPage] || [];

  // ─── Render ───
  if (!file) {
    return (
      <div
        {...getRootProps()}
        className={`pdf-drop-zone ${isDragActive ? "dragging" : ""}`}
      >
        <input {...getInputProps()} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <UploadCloud size={56} style={{ color: "var(--accent)", marginBottom: 8 }} />
          <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 6 }}>
            Upload PDF to Edit
          </p>
          <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 400, lineHeight: 1.5 }}>
            Drag & drop your PDF here, or click to browse.
            Add text, draw, shapes, highlights, images, and signatures — all in your browser.
          </p>
          <div style={{
            display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap"
          }}>
            {["✏️ Text", "🖊️ Draw", "🔷 Shapes", "🖍️ Highlight", "🖼️ Images", "✍️ Sign"].map(tag => (
              <span key={tag} className="tag" style={{ fontSize: 12, padding: "4px 10px" }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-editor-layout">
      {/* ═══ Main Toolbar ═══ */}
      <div className="pdf-toolbar">
        {/* Tool group: Selection */}
        <div className="pdf-toolbar-group">
          <ToolBtn icon={<ChevronLeft size={14} />} label="" active={false}
            onClick={() => { setFile(null); setResultUrl(null); setOverlays({}); setSelectedId(null); }}
            title="Back / New File"
          />
        </div>
        <div className="pdf-toolbar-divider" />

        {/* Tool group: Editing tools */}
        <div className="pdf-toolbar-group">
          <ToolBtn icon={<Type size={16} />} label="Text" active={mode === "text"}
            onClick={() => setMode(mode === "text" ? "select" : "text")} title="Add Text (click to place)" />
          <ToolBtn icon={<Pen size={16} />} label="Draw" active={mode === "draw"}
            onClick={() => setMode(mode === "draw" ? "select" : "draw")} title="Freehand Drawing" />
          <ToolBtn icon={<Eraser size={16} />} label="Eraser" active={mode === "eraser"}
            onClick={() => setMode(mode === "eraser" ? "select" : "eraser")} title="White-out Eraser" />
        </div>
        <div className="pdf-toolbar-divider" />

        {/* Tool group: Shapes */}
        <div className="pdf-toolbar-group">
          <ToolBtn icon={<Square size={16} />} label="Rect" active={mode === "rect"}
            onClick={() => setMode(mode === "rect" ? "select" : "rect")} title="Draw Rectangle" />
          <ToolBtn icon={<Circle size={16} />} label="Circle" active={mode === "circle"}
            onClick={() => setMode(mode === "circle" ? "select" : "circle")} title="Draw Ellipse" />
          <ToolBtn icon={<Minus size={16} />} label="Line" active={mode === "line"}
            onClick={() => setMode(mode === "line" ? "select" : "line")} title="Draw Line" />
          <ToolBtn icon={<ArrowRight size={16} />} label="Arrow" active={mode === "arrow"}
            onClick={() => setMode(mode === "arrow" ? "select" : "arrow")} title="Draw Arrow" />
        </div>
        <div className="pdf-toolbar-divider" />

        {/* Tool group: Annotation */}
        <div className="pdf-toolbar-group">
          <ToolBtn icon={<Highlighter size={16} />} label="Highlight" active={mode === "highlight"}
            onClick={() => setMode(mode === "highlight" ? "select" : "highlight")} title="Highlight Area" />
          <label style={{ margin: 0 }}>
            <ToolBtn icon={<ImageIcon size={16} />} label="Image" active={mode === "image"}
              onClick={() => {}} title="Upload & Place Image" />
            <input type="file" accept="image/png,image/jpeg" style={{ display: "none" }}
              onChange={handleImageUpload} />
          </label>
          <ToolBtn icon={<PenTool size={16} />} label="Sign" active={mode === "signature"}
            onClick={() => { setMode("signature"); setShowSignature(true); }} title="Add Signature" />
        </div>
        <div className="pdf-toolbar-divider" />

        {/* Undo/Redo */}
        <div className="pdf-toolbar-group">
          <ToolBtn icon={<Undo2 size={16} />} label="" active={false} onClick={undo}
            disabled={historyIndex <= 0} title="Undo (Ctrl+Z)" />
          <ToolBtn icon={<Redo2 size={16} />} label="" active={false} onClick={redo}
            disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Shift+Z)" />
        </div>

        <div style={{ flex: 1 }} />

        {/* Delete selected */}
        {selectedId && (
          <ToolBtn icon={<Trash2 size={16} />} label="Delete" active={false}
            onClick={deleteSelected} title="Delete Selected (Del)" />
        )}

        {/* Export */}
        {!resultUrl ? (
          <button className="btn-primary" onClick={handleExport} disabled={isProcessing}
            style={{ padding: "7px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            {isProcessing ? <><Loader2 className="animate-spin" size={15} /> Exporting...</>
              : <><Download size={15} /> Export PDF</>}
          </button>
        ) : (
          <a href={resultUrl} download={file.name.replace(/\.pdf$/i, "") + "-edited.pdf"}
            className="btn-primary"
            style={{ padding: "7px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <Download size={15} /> Download
          </a>
        )}
      </div>

      {/* ═══ Sub-Toolbar (contextual options) ═══ */}
      {(mode === "text" || (selectedId && findOverlay(selectedId)?.type === "text")) && (
        <div className="pdf-sub-toolbar">
          <label>
            Size
            <select value={fontSize} onChange={e => {
              const v = Number(e.target.value);
              setFontSize(v);
              if (selectedId) updateOverlay(selectedId, { fontSize: v });
            }}>
              {FONT_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
            </select>
          </label>
          <label>
            Color
            <input type="color" value={fontColor} onChange={e => {
              setFontColor(e.target.value);
              if (selectedId) updateOverlay(selectedId, { fontColor: e.target.value });
            }} />
          </label>
          <button className={`pdf-tool-btn ${fontBold ? "active" : ""}`}
            onClick={() => { setFontBold(!fontBold); if (selectedId) updateOverlay(selectedId, { bold: !fontBold }); }}
            title="Bold">
            <Bold size={15} />
          </button>
          <button className={`pdf-tool-btn ${fontItalic ? "active" : ""}`}
            onClick={() => { setFontItalic(!fontItalic); if (selectedId) updateOverlay(selectedId, { italic: !fontItalic }); }}
            title="Italic">
            <Italic size={15} />
          </button>
          <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 4px" }} />
          <button className={`pdf-tool-btn ${textBgWhiteout ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px" }}
            onClick={() => {
              const next = !textBgWhiteout;
              setTextBgWhiteout(next);
              if (selectedId) updateOverlay(selectedId, { bgWhiteout: next });
            }}
            title="Whiteout Background (covers/erases text underneath on the PDF)">
            <Eraser size={14} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>Whiteout Behind</span>
          </button>
        </div>
      )}

      {(mode === "draw" || mode === "eraser") && (
        <div className="pdf-sub-toolbar">
          {mode === "draw" && (
            <>
              <label>Color</label>
              <div style={{ display: "flex", gap: 4 }}>
                {DRAW_COLORS.map(c => (
                  <div key={c} className={`pdf-color-swatch ${drawColor === c ? "active" : ""}`}
                    style={{ background: c }} onClick={() => setDrawColor(c)} />
                ))}
              </div>
            </>
          )}
          {mode === "eraser" && (
            <>
              <label>Type</label>
              <div style={{ display: "flex", gap: 4 }}>
                <button className={`pdf-tool-btn ${eraserType === "brush" ? "active" : ""}`}
                  style={{ fontSize: 12, padding: "3px 10px" }}
                  onClick={() => setEraserType("brush")} title="Brush Eraser (freehand white lines)">
                  Brush
                </button>
                <button className={`pdf-tool-btn ${eraserType === "box" ? "active" : ""}`}
                  style={{ fontSize: 12, padding: "3px 10px" }}
                  onClick={() => setEraserType("box")} title="Box Eraser (draw solid white boxes to cover paragraphs)">
                  Box/Whiteout
                </button>
              </div>
            </>
          )}
          {(mode === "draw" || (mode === "eraser" && eraserType === "brush")) && (
            <label>
              Width
              <select value={drawWidth} onChange={e => setDrawWidth(Number(e.target.value))}>
                {STROKE_WIDTHS.map(w => <option key={w} value={w}>{w}px</option>)}
              </select>
            </label>
          )}
        </div>
      )}

      {["rect", "circle", "line", "arrow"].includes(mode) && (
        <div className="pdf-sub-toolbar">
          <label>
            Stroke
            <input type="color" value={shapeStroke} onChange={e => setShapeStroke(e.target.value)} />
          </label>
          {(mode === "rect" || mode === "circle") && (
            <label>
              Fill
              <select value={shapeFill} onChange={e => setShapeFill(e.target.value)}>
                <option value="transparent">None</option>
                <option value="#FFFFFF">White (Whiteout)</option>
                <option value="#EF4444">Red</option>
                <option value="#3B82F6">Blue</option>
                <option value="#10B981">Green</option>
                <option value="#F59E0B">Yellow</option>
                <option value="#8B5CF6">Purple</option>
              </select>
            </label>
          )}
          <label>
            Width
            <select value={drawWidth} onChange={e => setDrawWidth(Number(e.target.value))}>
              {STROKE_WIDTHS.map(w => <option key={w} value={w}>{w}px</option>)}
            </select>
          </label>
        </div>
      )}

      {mode === "highlight" && (
        <div className="pdf-sub-toolbar">
          <label>Color</label>
          <div style={{ display: "flex", gap: 4 }}>
            {HIGHLIGHT_COLORS.map(c => (
              <div key={c} className={`pdf-color-swatch ${highlightColor === c ? "active" : ""}`}
                style={{ background: c }} onClick={() => setHighlightColor(c)} />
            ))}
          </div>
        </div>
      )}

      {mode === "image" && pendingImage && (
        <div className="pdf-sub-toolbar">
          <span style={{ fontSize: 12, color: "var(--muted)" }}>📎 {pendingImage.file.name} — click on PDF to place</span>
          <button className="pdf-tool-btn" onClick={() => { setPendingImage(null); setMode("select"); }}>
            <X size={14} /> Cancel
          </button>
        </div>
      )}

      {error && (
        <div style={{ padding: "8px 16px", background: "#FEE2E2", color: "#991B1B", fontSize: 13, borderBottom: "1px solid #FECACA" }}>
          {error}
        </div>
      )}

      {/* ═══ PDF Canvas Area ═══ */}
      <div className="pdf-canvas-area" onClick={() => { if (mode === "select") setSelectedId(null); }}>
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div style={{ padding: 60, textAlign: "center" }}>
              <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 16px", color: "var(--accent)" }} />
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading PDF...</p>
            </div>
          }
        >
          <div
            className={`pdf-page-wrapper mode-${mode}`}
            ref={pageContainerRef}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            style={{ cursor: getCursor(), touchAction: "none" }}
          >
            <Page
              pageNumber={currentPage}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              width={pageWidth}
            />

            {/* SVG layer for draw/eraser strokes */}
            <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
              {currentPageOverlays.filter(o => (o.type === "draw" || o.type === "eraser") && o.points && o.points.length > 1).map(o => (
                <polyline
                  key={o.id}
                  points={o.points!.map(pt => `${pt.x}%,${pt.y}%`).join(' ')}
                  stroke={o.strokeColor || "#000"}
                  strokeWidth={o.strokeWidth || 3}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={o.id === selectedId ? { filter: "drop-shadow(0 0 3px rgba(59,130,246,0.5))" } : {}}
                />
              ))}

              {/* Line / Arrow overlays */}
              {currentPageOverlays.filter(o => (o.type === "line" || o.type === "arrow") && o.points && o.points.length === 2).map(o => {
                const p1 = o.points![0];
                const p2 = o.points![1];
                return (
                  <g key={o.id}>
                    <line
                      x1={`${p1.x}%`} y1={`${p1.y}%`}
                      x2={`${p2.x}%`} y2={`${p2.y}%`}
                      stroke={o.strokeColor || "#000"}
                      strokeWidth={o.strokeWidth || 2}
                      strokeLinecap="round"
                    />
                    {o.type === "arrow" && (() => {
                      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                      const headLen = 2;
                      return (
                        <>
                          <line
                            x1={`${p2.x}%`} y1={`${p2.y}%`}
                            x2={`${p2.x - headLen * Math.cos(angle - Math.PI / 6)}%`}
                            y2={`${p2.y - headLen * Math.sin(angle - Math.PI / 6)}%`}
                            stroke={o.strokeColor || "#000"}
                            strokeWidth={o.strokeWidth || 2}
                            strokeLinecap="round"
                          />
                          <line
                            x1={`${p2.x}%`} y1={`${p2.y}%`}
                            x2={`${p2.x - headLen * Math.cos(angle + Math.PI / 6)}%`}
                            y2={`${p2.y - headLen * Math.sin(angle + Math.PI / 6)}%`}
                            stroke={o.strokeColor || "#000"}
                            strokeWidth={o.strokeWidth || 2}
                            strokeLinecap="round"
                          />
                        </>
                      );
                    })()}
                  </g>
                );
              })}
            </svg>

            {/* Shape overlays (rect, circle) */}
            {currentPageOverlays.filter(o => o.type === "rect" || o.type === "circle").map(o => (
              <div
                key={o.id}
                className={`pdf-overlay-element ${selectedId === o.id ? "selected" : ""}`}
                style={{
                  left: `${o.x}%`, top: `${o.y}%`,
                  width: `${o.width}%`, height: `${o.height}%`,
                  border: o.strokeWidth === 0 ? "none" : `${o.strokeWidth ?? 2}px solid ${o.strokeColor || "#000"}`,
                  borderRadius: o.type === "circle" ? "50%" : "0",
                  background: o.fillColor === "#FFFFFF" ? "#FFFFFF" : (o.fillColor && o.fillColor !== "transparent" ? `${o.fillColor}4D` : "transparent"),
                  pointerEvents: mode === "select" ? "auto" : "none",
                }}
                onPointerDown={e => handleElementPointerDown(o.id, e)}
                onPointerMove={handleElementPointerMove}
                onPointerUp={handleElementPointerUp}
              >
                <button className="pdf-overlay-delete" onClick={e => { e.stopPropagation(); const id = o.id; setOverlays(prev => { const n = { ...prev, [currentPage]: (prev[currentPage] || []).filter(x => x.id !== id) }; pushHistory(n); return n; }); setSelectedId(null); }}>
                  <X size={10} />
                </button>
                {selectedId === o.id && (
                  <>
                    {["nw","ne","sw","se"].map(corner => (
                      <div key={corner} className={`pdf-resize-handle ${corner}`}
                        onPointerDown={e => handleResizeStart(corner, o.id, e)}
                        onPointerMove={handleResizeMove}
                        onPointerUp={handleResizeEnd}
                      />
                    ))}
                  </>
                )}
              </div>
            ))}

            {/* Highlight overlays */}
            {currentPageOverlays.filter(o => o.type === "highlight").map(o => (
              <div
                key={o.id}
                className={`pdf-overlay-element ${selectedId === o.id ? "selected" : ""}`}
                style={{
                  left: `${o.x}%`, top: `${o.y}%`,
                  width: `${o.width}%`, height: `${o.height}%`,
                  background: o.highlightColor || "#FBBF24",
                  opacity: o.opacity || 0.35,
                  borderRadius: 2,
                  pointerEvents: mode === "select" ? "auto" : "none",
                }}
                onPointerDown={e => handleElementPointerDown(o.id, e)}
                onPointerMove={handleElementPointerMove}
                onPointerUp={handleElementPointerUp}
              >
                <button className="pdf-overlay-delete" onClick={e => { e.stopPropagation(); setOverlays(prev => { const n = { ...prev, [currentPage]: (prev[currentPage] || []).filter(x => x.id !== o.id) }; pushHistory(n); return n; }); setSelectedId(null); }}>
                  <X size={10} />
                </button>
              </div>
            ))}

            {/* Text overlays — seamless inline editing like Word */}
            {currentPageOverlays.filter(o => o.type === "text").map(o => {
              const isEditing = selectedId === o.id;
              return (
                <div
                  key={o.id}
                  className={`pdf-text-overlay ${isEditing ? "editing" : ""}`}
                  style={{
                    position: "absolute",
                    left: `${o.x}%`,
                    top: `${o.y}%`,
                    width: `${o.width}%`,
                    height: `${o.height}%`,
                    background: o.bgWhiteout ? "#FFFFFF" : "transparent",
                    border: isEditing ? "1px dashed #1A73E8" : (o.bgWhiteout ? "1px solid #E5E7EB" : "none"),
                    cursor: mode === "select" ? "move" : "text",
                    pointerEvents: mode === "select" || mode === "text" ? "auto" : "none",
                    zIndex: isEditing ? 12 : 10,
                  }}
                  onPointerDown={e => {
                    if (mode === "text") {
                      // In text mode, clicking existing text focuses it
                      e.stopPropagation();
                      setSelectedId(o.id);
                      return;
                    }
                    handleElementPointerDown(o.id, e);
                  }}
                  onPointerMove={handleElementPointerMove}
                  onPointerUp={handleElementPointerUp}
                >
                  {/* Delete button — only shows on hover */}
                  <button className="pdf-text-delete" onClick={e => {
                    e.stopPropagation();
                    setOverlays(prev => {
                      const n = { ...prev, [currentPage]: (prev[currentPage] || []).filter(x => x.id !== o.id) };
                      pushHistory(n);
                      return n;
                    });
                    setSelectedId(null);
                  }}>
                    <X size={10} />
                  </button>
                  <textarea
                    value={o.value || ""}
                    onChange={e => {
                      const val = e.target.value;
                      // Update overlay value without pushing to history on every keystroke
                      setOverlays(prev => ({
                        ...prev,
                        [o.page]: (prev[o.page] || []).map(item =>
                          item.id === o.id ? { ...item, value: val } : item
                        )
                      }));
                    }}
                    onBlur={() => {
                      // Push to history when user finishes typing
                      pushHistory(overlays);
                    }}
                    onPointerDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                      // Prevent Delete/Backspace from triggering element deletion
                      e.stopPropagation();
                    }}
                    ref={el => {
                      // Auto-focus newly placed text
                      if (isEditing && el && !el.dataset.focused) {
                        el.focus();
                        el.dataset.focused = "1";
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      resize: "none",
                      overflow: "hidden",
                      fontSize: (o.fontSize || 16) + "px",
                      lineHeight: 1.4,
                      fontWeight: o.bold ? 700 : 400,
                      fontStyle: o.italic ? "italic" : "normal",
                      color: o.fontColor || "#000",
                      fontFamily: "Helvetica, Arial, sans-serif",
                      padding: "4px",
                      margin: 0,
                      caretColor: "#1A73E8",
                      letterSpacing: "0.01em",
                      wordBreak: "break-word",
                    }}
                  />
                  {selectedId === o.id && (
                    <>
                      {["nw","ne","sw","se"].map(corner => (
                        <div key={corner} className={`pdf-resize-handle ${corner}`}
                          onPointerDown={e => handleResizeStart(corner, o.id, e)}
                          onPointerMove={handleResizeMove}
                          onPointerUp={handleResizeEnd}
                        />
                      ))}
                    </>
                  )}
                </div>
              );
            })}

            {/* Image & Signature overlays */}
            {currentPageOverlays.filter(o => o.type === "image" || o.type === "signature").map(o => (
              <div
                key={o.id}
                className={`pdf-overlay-element ${selectedId === o.id ? "selected" : ""}`}
                style={{
                  left: `${o.x}%`, top: `${o.y}%`,
                  width: `${o.width}%`, height: `${o.height}%`,
                  pointerEvents: mode === "select" ? "auto" : "none",
                }}
                onPointerDown={e => handleElementPointerDown(o.id, e)}
                onPointerMove={handleElementPointerMove}
                onPointerUp={handleElementPointerUp}
              >
                <button className="pdf-overlay-delete" onClick={e => { e.stopPropagation(); setOverlays(prev => { const n = { ...prev, [currentPage]: (prev[currentPage] || []).filter(x => x.id !== o.id) }; pushHistory(n); return n; }); setSelectedId(null); }}>
                  <X size={10} />
                </button>
                <img
                  src={o.dataUrl || o.signatureDataUrl}
                  style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
                  alt={o.type === "signature" ? "Signature" : "Stamp"}
                  draggable={false}
                />
                {selectedId === o.id && (
                  <>
                    {["nw","ne","sw","se"].map(corner => (
                      <div key={corner} className={`pdf-resize-handle ${corner}`}
                        onPointerDown={e => handleResizeStart(corner, o.id, e)}
                        onPointerMove={handleResizeMove}
                        onPointerUp={handleResizeEnd}
                      />
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </Document>
      </div>

      {/* ═══ Bottom Bar ═══ */}
      <div className="pdf-bottom-bar">
        <div className="pdf-page-nav">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} title="Previous Page">
            <ChevronLeft size={14} />
          </button>
          <span style={{ minWidth: 80, textAlign: "center", fontWeight: 500 }}>
            Page {currentPage} of {numPages}
          </span>
          <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} title="Next Page">
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="pdf-zoom-controls">
          <button className="pdf-tool-btn" onClick={() => setZoom(z => { const idx = ZOOM_LEVELS.indexOf(z); return idx > 0 ? ZOOM_LEVELS[idx - 1] : z; })}
            disabled={zoom <= ZOOM_LEVELS[0]} title="Zoom Out">
            <ZoomOut size={15} />
          </button>
          <span style={{ minWidth: 50, textAlign: "center", fontWeight: 500, fontSize: 12 }}>
            {Math.round(zoom * 100)}%
          </span>
          <button className="pdf-tool-btn" onClick={() => setZoom(z => { const idx = ZOOM_LEVELS.indexOf(z); return idx < ZOOM_LEVELS.length - 1 ? ZOOM_LEVELS[idx + 1] : z; })}
            disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]} title="Zoom In">
            <ZoomIn size={15} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {resultUrl && (
            <button className="pdf-tool-btn" onClick={() => { setResultUrl(null); showToast("Ready for more edits"); }} title="Continue Editing">
              <Pen size={14} /> <span className="pdf-tool-btn-label">Edit More</span>
            </button>
          )}
        </div>
      </div>

      {/* ═══ Signature Modal ═══ */}
      {showSignature && (
        <div className="pdf-sig-modal-backdrop" onClick={() => { setShowSignature(false); if (mode === "signature") setMode("select"); }}>
          <div className="pdf-sig-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
              Add Your Signature
            </h3>

            <div className="pdf-sig-tabs">
              <button className={`pdf-sig-tab ${sigMode === "draw" ? "active" : ""}`}
                onClick={() => setSigMode("draw")}>
                ✏️ Draw
              </button>
              <button className={`pdf-sig-tab ${sigMode === "type" ? "active" : ""}`}
                onClick={() => setSigMode("type")}>
                ⌨️ Type
              </button>
            </div>

            {sigMode === "draw" ? (
              <>
                <canvas
                  ref={sigCanvasRef}
                  className="pdf-sig-canvas"
                  width={460}
                  height={160}
                  onPointerDown={sigStartDraw}
                  onPointerMove={sigDraw}
                  onPointerUp={sigEndDraw}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button className="pdf-tool-btn" onClick={clearSigCanvas}>
                    <Eraser size={14} /> Clear
                  </button>
                </div>
              </>
            ) : (
              <input
                type="text"
                value={sigText}
                onChange={e => setSigText(e.target.value)}
                placeholder="Type your name..."
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  fontSize: 28,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  border: "2px dashed var(--border)",
                  borderRadius: 10,
                  background: "white",
                  color: "#000",
                  textAlign: "center",
                }}
              />
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn-outline" style={{ padding: "8px 20px", fontSize: 13 }}
                onClick={() => { setShowSignature(false); if (mode === "signature") setMode("select"); }}>
                Cancel
              </button>
              <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                onClick={placeSignature}>
                <Check size={15} /> Place Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Toast ═══ */}
      {toast && <div className="pdf-toast" key={toast}>{toast}</div>}
    </div>
  );
}

// ─── Toolbar Button Component ───
function ToolBtn({ icon, label, active, onClick, disabled, title }: {
  icon: React.ReactNode; label: string; active: boolean;
  onClick: () => void; disabled?: boolean; title?: string;
}) {
  return (
    <button
      className={`pdf-tool-btn ${active ? "active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon}
      {label && <span className="pdf-tool-btn-label">{label}</span>}
    </button>
  );
}
