import type { Metadata } from "next";
import ToolsSection from "@/components/ToolsSection";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Free Online Image Tools — Compress, Resize, Convert & More",
  description: "7+ free browser-based image tools: compress, resize, convert, extract text (OCR), generate QR codes, and extract color palettes. No signup. No file uploads.",
  keywords: "free image tools, image compressor, image resizer, format converter, qr code generator, ocr tool, color palette, no signup",
  alternates: { canonical: "https://pdfbucket.online/tools" },
  openGraph: {
    title: "Free Online Image Tools | PDFBucket",
    description: "7+ free browser-based image tools. No signup. No upload limits.",
    url: "https://pdfbucket.online/tools",
  },
};

const toolsFAQ = [
  { q: "What tools are available on PDFBucket?", a: "PDFBucket offers 7 free tools: Image Compressor, Image Resizer, Format Converter (PNG/JPEG/WEBP), QR Code Generator, Text Extractor (OCR), Color Palette Generator, and Text-to-Handwriting Converter. More tools are coming soon." },
  { q: "How do the tools work?", a: "All tools run entirely in your browser using JavaScript and WebAssembly. When you upload an image, it is processed locally on your device. No files are sent to any server." },
  { q: "Can I use these tools on my phone?", a: "Yes. All tools are fully mobile-compatible. Tap 'Browse Files' in any tool to upload from your camera roll, process the image, and download the result." },
  { q: "Is there a watermark on downloaded files?", a: "Never. Files processed by PDFBucket tools are yours — no watermarks, no branding, no hidden metadata added." },
  { q: "Which browsers are supported?", a: "All modern browsers are supported: Chrome, Firefox, Safari (desktop and mobile), Edge, and Opera. For best performance, use the latest version of your browser." },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "PDFBucket Free Online Image Tools",
  "description": "Free browser-based image processing tools",
  "url": "https://pdfbucket.online/tools",
  "numberOfItems": 7,
  "itemListElement": [
    { "@type": "SoftwareApplication", "position": 1, "name": "Image Compressor", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "operatingSystem": "Any" },
    { "@type": "SoftwareApplication", "position": 2, "name": "Image Resizer", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "operatingSystem": "Any" },
    { "@type": "SoftwareApplication", "position": 3, "name": "Format Converter", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "operatingSystem": "Any" },
    { "@type": "SoftwareApplication", "position": 4, "name": "QR Code Generator", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "operatingSystem": "Any" },
    { "@type": "SoftwareApplication", "position": 5, "name": "Text Extractor (OCR)", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "operatingSystem": "Any" },
    { "@type": "SoftwareApplication", "position": 6, "name": "Color Palette Generator", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "operatingSystem": "Any" },
    { "@type": "SoftwareApplication", "position": 7, "name": "Text to Handwriting", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "operatingSystem": "Any" },
  ],
};

export default function ToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <ToolsSection />
      <div style={{ background: "var(--bg2)" }}>
        <FAQ items={toolsFAQ} title="Tools FAQ" />
      </div>
    </>
  );
}
