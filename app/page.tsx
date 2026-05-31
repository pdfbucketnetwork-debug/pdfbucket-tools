import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import FreeForever from "@/components/FreeForever";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "PDFBucket — Free Online Image & File Tools",
  description: "Free browser-based tools to compress, resize, convert images, generate QR codes, extract text (OCR), and more. No signup. 100% private. Works on any device.",
  alternates: { canonical: "https://pdfbucket.online" },
  openGraph: { url: "https://pdfbucket.online" },
};

const homeFAQ = [
  { q: "Are all PDFBucket tools really free?", a: "Yes, 100% free. We support the project through non-intrusive advertising. There are no premium tiers, no hidden fees, and no usage limits. Core tools will always be free." },
  { q: "Do my files get uploaded to your servers?", a: "Never. All processing happens entirely within your browser using JavaScript and WebAssembly. Not a single byte of your files is transmitted to any server. Your files are completely private." },
  { q: "Do I need to create an account?", a: "No account required. Open any tool and start using it immediately — no email, no password, no credit card." },
  { q: "Does PDFBucket work on mobile phones?", a: "Yes. PDFBucket is fully responsive and works on smartphones and tablets. You can upload images from your camera roll, process them, and download results — all on mobile." },
  { q: "Which image formats does PDFBucket support?", a: "PDFBucket tools support PNG, JPEG, WEBP, and GIF for most operations. The Format Converter supports conversion between PNG, JPEG, and WEBP." },
  { q: "Is there a file size limit?", a: "Since all processing happens in your browser, the practical limit is your device's available memory. Most modern devices handle files up to several hundred megabytes without issues." },
];

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDFBucket",
  "url": "https://pdfbucket.online",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "Free browser-based tools to compress, resize, convert images, generate QR codes, and extract text.",
  "featureList": [
    "Image Compression", "Image Resizing", "Image Format Conversion",
    "QR Code Generation", "OCR Text Extraction", "Color Palette Extraction",
    "Text to Handwriting Conversion",
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <main>
        <Hero />
        <ToolsSection />
        <FeaturesGrid />
        <FreeForever />
        <FAQ items={homeFAQ} title="Everything you need to know about PDFBucket" />
      </main>
    </>
  );
}
