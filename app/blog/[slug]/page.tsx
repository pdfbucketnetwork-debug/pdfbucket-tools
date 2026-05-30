import type { Metadata } from "next";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getBlogPosts().map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | PDFBucket Blog`,
    description: post.description,
    keywords: post.keywords.join(", "),
    alternates: { canonical: `https://pdfbucket.online/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://pdfbucket.online/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      siteName: "PDFBucket",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const allPosts = getBlogPosts().filter(p => p.slug !== slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": { "@type": "Organization", "name": "PDFBucket Team", "url": "https://pdfbucket.online" },
    "publisher": {
      "@type": "Organization",
      "name": "PDFBucket",
      "url": "https://pdfbucket.online",
      "logo": { "@type": "ImageObject", "url": "https://pdfbucket.online/logo.png" },
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://pdfbucket.online/blog/${post.slug}` },
    "keywords": post.keywords.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pdfbucket.online" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://pdfbucket.online/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://pdfbucket.online/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <div style={{ paddingTop: 80, background: "var(--bg2)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 24px 0", display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: "var(--muted)", textDecoration: "none" }}>Blog</Link>
          <span>/</span>
          <span style={{ color: "var(--text)" }}>{post.category}</span>
        </div>

        {/* Hero */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 64px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{
              background: "rgba(108,99,255,0.12)", color: "var(--accent)",
              fontSize: 11, fontFamily: "Syne, sans-serif", fontWeight: 700,
              padding: "4px 10px", borderRadius: 50, letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {post.category}
            </span>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>{post.readTime}</span>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 20 }}>
            {post.title}
          </h1>

          <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.7, marginBottom: 32 }}>
            {post.description}
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg, #6c63ff, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🪣</div>
            <div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14 }}>PDFBucket Team</div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>Free Tool Builders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px 24px" }}>
        {/* TL;DR box */}
        <div style={{
          background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.2)",
          borderLeft: "4px solid var(--accent)", borderRadius: "0 12px 12px 0",
          padding: "20px 24px", marginBottom: 48,
        }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--accent)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            TL;DR
          </div>
          <p style={{ color: "var(--text)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
        </div>

        {/* Markdown content rendered as HTML */}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

        {/* CTA box */}
        <div style={{
          marginTop: 64, borderRadius: 20, padding: "48px 32px", textAlign: "center",
          background: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(56,189,248,0.07))",
          border: "1px solid var(--border)",
        }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.6rem", fontWeight: 800, marginBottom: 12 }}>
            Try it for free — right now
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: 15 }}>
            No signup. No limits. All tools run in your browser.
          </p>
          <Link href="/tools" className="btn-primary" style={{ textDecoration: "none", padding: "14px 36px", fontSize: 15 }}>
            Use Free Tools ↗
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: "var(--bg2)" }}>
        <FAQ items={post.faq} title={`FAQs about ${post.category}`} />
      </div>

      {/* Related posts */}
      {allPosts.length > 0 && (
        <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.5rem", marginBottom: 32 }}>
            More Guides
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {allPosts.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                <div className="glass-hover" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px" }}>
                  <span style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, fontFamily: "Syne, sans-serif", textTransform: "uppercase" }}>{p.category}</span>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginTop: 8, color: "var(--text)", lineHeight: 1.4 }}>{p.title}</h3>
                  <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, marginTop: 12 }}>Read →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function renderMarkdown(md: string): string {
  return md
    .trim()
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.slice(2, -2).split(' | ');
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    })
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/<\/p><p>(<h[234]>)/g, '$1')
    .replace(/(<\/h[234]>)<\/p><p>/g, '$1')
    .replace(/<\/p><p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p><p>/g, '$1')
    .replace(/<\/p><p>(<hr\/>)/g, '$1')
    .replace(/(<hr\/>)<\/p><p>/g, '$1')
    .replace(/<\/p><p>(<tr>)/g, '<table>$1')
    .replace(/(<\/tr>)(?=\s*<\/p><p><tr>|$)/g, '$1')
    .replace(/(<tr>[\s\S]*?<\/tr>(?:\s*<tr>[\s\S]*?<\/tr>)*)/g, '<table>$1</table>')
    .replace(/<table>(<table>)/g, '<table>')
    .replace(/<\/table><\/table>/g, '</table>')
    .replace(/^(?!<[h2-6]|<ul|<ol|<li|<hr|<table|<tr)(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[234]>)/g, '$1')
    .replace(/(<\/h[234]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1')
    .replace(/<p>(<hr\/>)<\/p>/g, '$1')
    .replace(/<p>(<table>)/g, '$1')
    .replace(/(<\/table>)<\/p>/g, '$1');
}
