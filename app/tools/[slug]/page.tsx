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

  // 4. HowTo Schema for Step-by-Step AI Engine Optimization
  const howToSchema = tool.content.steps ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": tool.content.h2,
    "description": tool.content.paragraphs[0],
    "step": tool.content.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  } : null;

  // 5. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pdfbucket.online"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://pdfbucket.online/tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.label,
        "item": `https://pdfbucket.online/tools/${tool.slug}`
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {howToSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section style={{ padding: "80px 16px", maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Back Button */}
        <Link 
          href="/tools" 
          style={{
            background: "none", border: "1px solid var(--border)", color: "var(--muted)",
            borderRadius: 100, padding: "8px 16px", cursor: "pointer", fontSize: 13,
            marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6,
            textDecoration: "none", fontFamily: "Inter, sans-serif", fontWeight: 500
          }}
          className="glass-hover"
        >
          ← Back to Tools
        </Link>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div className="icon-box" style={{ background: `${tool.color}18`, marginBottom: 0, width: 56, height: 56, fontSize: 28, borderRadius: 16 }}>
            {tool.icon}
          </div>
          <div>
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "2rem", margin: 0, marginBottom: 4, letterSpacing: "-0.01em" }}>
              {tool.label}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 15, margin: 0 }}>{tool.desc}</p>
          </div>
        </div>

        {/* Tool interactive area */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 24, padding: 32, maxWidth: 640, marginBottom: 64,
          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.05)"
        }}>
          <ToolRenderer id={tool.id} />
        </div>

        {/* Semantic Content for GEO / AEO */}
        <article style={{ maxWidth: 800, lineHeight: 1.7, color: "var(--text)" }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>
            {tool.content.h2}
          </h2>
          {tool.content.paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: 20, color: "var(--muted)", fontSize: 16 }}>{p}</p>
          ))}
          
          {/* Step-by-Step Instructions */}
          {tool.content.steps && (
            <div style={{ marginTop: 40, marginBottom: 40 }}>
              <ol style={{ paddingLeft: 24, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {tool.content.steps.map((step, i) => (
                  <li key={i} style={{ color: "var(--muted)", fontSize: 16, paddingLeft: 8 }}>
                    <strong style={{ color: "var(--text)", fontWeight: 600 }}>{step.name}:</strong> {step.text}
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "48px 0" }} />
          
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: 32, letterSpacing: "-0.01em" }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {tool.content.faq.map((f, i) => (
              <div key={i} style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 8, marginTop: 0, color: "var(--text)" }}>{f.q}</h3>
                <p style={{ color: "var(--muted)", fontSize: 15, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
