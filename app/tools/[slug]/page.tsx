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
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {howToSchema && <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />}
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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

        {/* Header & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div className="icon-box" style={{ background: `${tool.color}18`, marginBottom: 0, width: 56, height: 56, fontSize: 28, borderRadius: 16 }}>
            {tool.icon}
          </div>
          <div>
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "2.2rem", margin: 0, marginBottom: 4, letterSpacing: "-0.02em" }}>
              {tool.label}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 16, margin: 0 }}>{tool.desc}</p>
          </div>
        </div>

        {/* Introduction Section Above the Tool UI */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, marginBottom: 48, maxWidth: 900 }}>
          <div style={{ lineHeight: 1.8, fontSize: 16, color: "var(--text)" }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>
              {tool.content.h2}
            </h2>
            {tool.content.paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 16, color: "var(--muted)" }}>{p}</p>
            ))}
          </div>

          {/* Key Features List */}
          <div style={{ 
            background: "var(--surface)", border: "1px solid var(--border)", 
            borderRadius: 20, padding: 24, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.03)" 
          }}>
            <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 16, marginTop: 0, color: "var(--text)" }}>
              Key Features
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
              {tool.content.features.map((feature, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
                  <span style={{ color: tool.color, fontWeight: "bold" }}>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Tool Area */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 600, marginBottom: 16, color: "var(--text)" }}>
            Interactive Online Tool
          </h2>
          <div style={{
            background: tool.id === "pdf-editor" ? "transparent" : "var(--surface)",
            border: tool.id === "pdf-editor" ? "none" : "1px solid var(--border)",
            borderRadius: 24,
            padding: tool.id === "pdf-editor" ? 0 : 32,
            maxWidth: tool.id === "pdf-editor" ? "100%" : 640,
            boxShadow: tool.id === "pdf-editor" ? "none" : "0 20px 40px -12px rgba(0,0,0,0.05)"
          }}>
            <ToolRenderer id={tool.id} />
          </div>
        </div>

        {/* Detailed Guidelines & Use Cases Below the Tool */}
        <article style={{ maxWidth: 900, lineHeight: 1.7, color: "var(--text)", marginTop: 64 }}>
          
          {/* Step-by-Step Instructions */}
          {tool.content.steps && (
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.6rem", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>
                How to Use the {tool.label}
              </h2>
              <ol style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                {tool.content.steps.map((step, i) => (
                  <li key={i} style={{ 
                    display: "flex", gap: 16, background: "var(--surface)", 
                    border: "1px solid var(--border)", borderRadius: 16, padding: 20 
                  }}>
                    <div style={{
                      background: `${tool.color}15`, color: tool.color, fontWeight: 700,
                      width: 32, height: 32, borderRadius: "50%", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <strong style={{ color: "var(--text)", fontSize: 16, display: "block", marginBottom: 4 }}>{step.name}</strong>
                      <span style={{ color: "var(--muted)", fontSize: 15 }}>{step.text}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Common Use Cases Section */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.6rem", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>
              Common Use Cases
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {tool.content.useCases.map((useCase, i) => (
                <div key={i} style={{ 
                  border: "1px solid var(--border)", borderRadius: 16, padding: 24, 
                  background: "var(--surface)", display: "flex", flexDirection: "column", gap: 8 
                }}>
                  <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)" }}>
                    {useCase.title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                    {useCase.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "40px 0" }} />

          {/* Frequently Asked Questions */}
          <div>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.6rem", fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tool.content.faq.map((f, i) => (
                <div key={i} style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}>
                  <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8, marginTop: 0, color: "var(--text)" }}>
                    {f.q}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </article>
      </section>
    </>
  );
}
