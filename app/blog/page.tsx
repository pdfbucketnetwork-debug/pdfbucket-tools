import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";

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

export default async function BlogPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const currentCategory = (searchParams?.category as string) || "All";
  const allPosts = getBlogPosts();
  const posts = currentCategory === "All" 
    ? allPosts 
    : allPosts.filter(p => p.category === currentCategory);

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

      {/* Blog grid */}
      <section style={{ padding: "64px 24px 100px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {["All", "Image Tools", "Guides", "Social Media", "QR Codes", "Productivity", "Design", "Reviews"].map(cat => {
            const isActive = currentCategory === cat;
            return (
              <Link href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`} key={cat} style={{
                padding: "6px 16px",
                borderRadius: 50,
                fontSize: 13,
                fontWeight: 500,
                background: isActive ? "var(--accent)" : "var(--surface)",
                color: isActive ? "white" : "var(--muted)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                textDecoration: "none",
              }}>
                {cat}
              </Link>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
          {posts.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", gridColumn: "1 / -1" }}>
              No posts found for this category.
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 80, borderRadius: 20, padding: "56px 32px", textAlign: "center",
          background: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(56,189,248,0.07))",
          border: "1px solid var(--border)",
        }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
            Ready to try the tools?
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 15 }}>
            All tools run in your browser. No signup. No limits. 100% free.
          </p>
          <Link href="/tools" className="btn-primary" style={{ textDecoration: "none", padding: "14px 36px", fontSize: 15 }}>
            Use Free Tools ↗
          </Link>
        </div>
      </section>
    </>
  );
}
