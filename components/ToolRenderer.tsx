"use client";
import dynamic from "next/dynamic";

const ToolLoading = () => <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Loading tool...</div>;

const toolComponents: Record<string, any> = {
  compress: dynamic(() => import("./tools/ImageCompressor"), { ssr: false, loading: ToolLoading }),
  resize: dynamic(() => import("./tools/ImageResizer"), { ssr: false, loading: ToolLoading }),
  convert: dynamic(() => import("./tools/ImageConverter"), { ssr: false, loading: ToolLoading }),
  qr: dynamic(() => import("./tools/QRGenerator"), { ssr: false, loading: ToolLoading }),
  ocr: dynamic(() => import("./tools/TextExtractor"), { ssr: false, loading: ToolLoading }),
  palette: dynamic(() => import("./tools/ColorPalette"), { ssr: false, loading: ToolLoading }),
  handwriting: dynamic(() => import("./tools/TextHandwriting"), { ssr: false, loading: ToolLoading }),
  "audio-extractor": dynamic(() => import("./tools/VideoToAudio"), { ssr: false, loading: ToolLoading }),
  "bg-remover": dynamic(() => import("./tools/BackgroundRemover"), { ssr: false, loading: ToolLoading }),
  "doc-to-pdf": dynamic(() => import("./tools/DocumentToPdf"), { ssr: false, loading: ToolLoading }),
  "merge-pdf": dynamic(() => import("./tools/PdfMerge"), { ssr: false, loading: ToolLoading }),
  "pdf-editor": dynamic(() => import("./tools/PdfEditor"), { ssr: false, loading: ToolLoading }),
};

export default function ToolRenderer({ id }: { id: string }) {
  const Component = toolComponents[id];
  return Component ? <Component /> : null;
}
