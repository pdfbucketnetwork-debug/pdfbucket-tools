import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolsData, getToolBySlug } from "@/lib/toolsData";
import ToolRenderer from "@/components/ToolRenderer";
import Link from "next/link";

// 1. Generate Static Params so pages are pre-rendered
export async function generateStaticParams() {
  return toolsData.map((tool) => ({
    slug: tool.slug,
  }));
}

// 2. Generate dynamic metadata for each tool
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);
  
  if (!tool) return {};

  const url = `https://pdfbucket.online/tools/${tool.slug}`;

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: url,
      type: "website",
    },
  };
}

export default async function ToolPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  // 3. Structured Data for Software Application (GEO/AEO)
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.label,
    "description": tool.seo.description,
    "applicationCategory": "BrowserApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.content.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section style={{ padding: "80px 16px", maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Back Button */}
        <Link 
          href="/tools" 
          style={{
            background: "none", border: "1px solid var(--border)", color: "var(--muted)",
            borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontSize: 13,
            marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6,
            textDecoration: "none"
          }}
        >
          ← Back to Tools
        </Link>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div className="icon-box" style={{ background: `${tool.color}18`, marginBottom: 0 }}>
            {tool.icon}
          </div>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.8rem", margin: 0, marginBottom: 4 }}>
              {tool.label}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{tool.desc}</p>
          </div>
        </div>

        {/* Tool interactive area */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 20, padding: 28, maxWidth: 640, marginBottom: 64
        }}>
          <ToolRenderer id={tool.id} />
        </div>

        {/* Semantic Content for GEO / AEO */}
        <article style={{ maxWidth: 800, lineHeight: 1.7, color: "var(--fg)" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.6rem", fontWeight: 700, marginBottom: 24, letterSpacing: "-0.02em" }}>
            {tool.content.h2}
          </h2>
          {tool.content.paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: 20, color: "var(--muted)", fontSize: 16 }}>{p}</p>
          ))}
          
          <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "48px 0" }} />
          
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.6rem", fontWeight: 700, marginBottom: 32 }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {tool.content.faq.map((f, i) => (
              <div key={i} style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>{f.q}</h3>
                <p style={{ color: "var(--muted)", fontSize: 15, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
