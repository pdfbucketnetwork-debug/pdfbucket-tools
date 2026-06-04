import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "How It Works — PDFBucket Free Image Tools",
  description: "Learn how PDFBucket image tools work in 4 simple steps. No signup, no file uploads — all image processing happens directly in your browser.",
  alternates: { canonical: "https://pdfbucket.online/how-it-works" },
  openGraph: {
    title: "How PDFBucket Works | Free Image Tools",
    description: "4 steps. Under 30 seconds. Your files never leave your device.",
    url: "https://pdfbucket.online/how-it-works",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Use PDFBucket Free Image Tools",
  "description": "Process images for free in your browser without uploading files to any server.",
  "totalTime": "PT1M",
  "tool": { "@type": "HowToTool", "name": "A modern web browser" },
  "supply": { "@type": "HowToSupply", "name": "An image file (PNG, JPEG, WEBP, or GIF)" },
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Pick a Tool", "text": "Choose from 7+ free tools — Image Compressor, Resizer, Format Converter, QR Code Generator, OCR Text Extractor, Color Palette, or Text-to-Handwriting.", "url": "https://pdfbucket.online/tools" },
    { "@type": "HowToStep", "position": 2, "name": "Drop Your File", "text": "Drag and drop your image file into the upload zone, or click 'Browse Files' to select it from your device. No file size limits apply.", "url": "https://pdfbucket.online/tools" },
    { "@type": "HowToStep", "position": 3, "name": "Instant Processing", "text": "The tool processes your image instantly using your browser's computing power. No server uploads — your files stay 100% private on your device.", "url": "https://pdfbucket.online/tools" },
    { "@type": "HowToStep", "position": 4, "name": "Download & Done", "text": "Click the download button to save your processed image. It's ready to use — no watermarks, no branding, completely free.", "url": "https://pdfbucket.online/tools" },
  ],
};

const howFAQ = [
  { q: "Does PDFBucket upload my files to a server?", a: "No. All processing happens locally in your browser. Your files never leave your device. Not a single byte is transmitted to PDFBucket's servers or any third party." },
  { q: "Why is browser-based processing faster than server-based?", a: "Server-based processing requires uploading your file, waiting for a server to process it, then downloading the result. Browser-based processing skips the upload and download — it happens instantly on your device." },
  { q: "What technology powers PDFBucket's tools?", a: "PDFBucket uses the Web Canvas API for image manipulation, WebAssembly (WASM) for high-performance tasks like OCR (via Tesseract.js), and native browser APIs for file access." },
  { q: "Can I use PDFBucket offline?", a: "Once the page is loaded in your browser, most tools will continue to work even without an internet connection, since all processing is local. Note that initial page load requires internet." },
];

export default function HowItWorksPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <HowItWorks />
      <div style={{ background: "var(--bg2)" }}>
        <FAQ items={howFAQ} title="How It Works — FAQ" />
      </div>
    </>
  );
}
