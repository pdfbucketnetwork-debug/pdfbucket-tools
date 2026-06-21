import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — PDFBucket",
  description: "Learn more about PDFBucket, our founding story, local-first privacy-focused architecture, and our mission to provide secure web tools.",
  alternates: { canonical: "https://pdfbucket.online/about" },
};

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>
      
      {/* Hero Section */}
      <section style={{ padding: "140px 24px 80px", textAlign: "center", background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>🔒 PRIVACY FIRST</span>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 20, lineHeight: 1.1 }}>
            About PDFBucket
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.7, maxWidth: 640, margin: "0 auto", fontWeight: 400 }}>
            Discover the founding story and core philosophy behind the internet's premier secure, local-first file processing suite.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
          <div>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Our Founding Story
            </h2>
            <div style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 16 }}>
              <p>
                In early 2024, our founder, Jeeva, needed to compress several sensitive financial files and contract scans to meet email size restrictions. Checking online services, he found that every popular tool required uploading the documents to a remote cloud server. This posed significant data breach risks and violated client confidentiality policies.
              </p>
              <p>
                Frustrated by the lack of local-first alternatives, Jeeva set out to build a lightweight, browser-based image compressor that executed entirely in-memory using Web Canvas APIs. Seeing how fast and private the approach was, he teamed up with designer Nobal to design and expand PDFBucket into a full suite of image, PDF, and productivity tools.
              </p>
              <p>
                Today, PDFBucket processes thousands of files daily. By leveraging modern client-side technologies like **WebAssembly (WASM)**, **Tesseract.js**, and **pdf-lib**, we provide desktop-grade utility speeds directly inside web browser tabs—guaranteeing that your files never leave your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Pillars Section */}
      <section style={{ padding: "80px 24px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 700, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Our Technical Guarantees
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            <div style={{ textAlign: "left", padding: 24, border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🛡️</div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>100% On-Device</h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                All algorithms run in browser memory. Not a single byte of your uploaded file is transmitted over the internet to our servers.
              </p>
            </div>
            <div style={{ textAlign: "left", padding: 24, border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>No Queue Waiting</h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Since file encoding operates locally using your device's CPU/GPU, there are no queues, server lags, or bandwidth throttles.
              </p>
            </div>
            <div style={{ textAlign: "left", padding: 24, border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🌐</div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>Open Source Trust</h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Our tools are fully open source. You can inspect the source code, trace resource calls, and verify our compliance standards on our <Link href="https://github.com/pdfbucketnetwork-debug/pdfbucket-tools" target="_blank" style={{ color: "var(--accent)" }}>GitHub repository</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
