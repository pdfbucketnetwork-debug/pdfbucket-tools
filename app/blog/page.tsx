import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog";
import BlogGrid from "@/components/BlogGrid";

export const metadata: Metadata = {
  title: "Blog — Image Tools, Guides & Tips | PDFBucket",
  description: "Free guides on image compression, format conversion, QR codes, OCR, and more. Learn how to process images faster and smarter — no signup required.",
  keywords: "image compression guide, how to convert images, qr code guide, ocr tutorial, free image tools blog",
  alternates: { canonical: "https://pdfbucket.online/blog" },
  openGraph: {
    title: "Blog — Image Tools, Guides & Tips | PDFBucket",
    description: "Free guides on image compression, format conversion, QR codes, OCR, and more.",
    url: "https://pdfbucket.online/blog",
    type: "website",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "PDFBucket Blog",
  "description": "Guides and tutorials on image tools, compression, conversion, and web performance.",
  "url": "https://pdfbucket.online/blog",
  "publisher": {
    "@type": "Organization",
    "name": "PDFBucket",
    "url": "https://pdfbucket.online",
    "logo": "https://pdfbucket.online/logo.png",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section style={{ padding: "120px 24px 64px", textAlign: "center", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>📝 Knowledge Base</span>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Guides, Tips & Tutorials
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.7 }}>
            Learn how to compress, convert, resize, and process images like a pro.
            All tools are free. All guides are practical.
          </p>
        </div>
      </section>

      <BlogGrid posts={posts} />
    </>
  );
}
