"use client";
import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title = "Frequently Asked Questions" }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };

  return (
    <section style={{ padding: "80px 24px", maxWidth: 860, margin: "0 auto" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>💬 FAQ</span>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>
          {title}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: "var(--surface)",
              border: `1px solid ${open === i ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 14,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                cursor: "pointer",
                textAlign: "left",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <span style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "var(--text)",
                flex: 1,
              }}>
                {item.q}
              </span>
              <span style={{
                color: "var(--accent)",
                fontSize: 20,
                fontWeight: 300,
                flexShrink: 0,
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                display: "inline-block",
              }}>
                +
              </span>
            </button>

            {open === i && (
              <div style={{ padding: "0 24px 20px", color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
