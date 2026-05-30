"use client";
export default function FreeForever() {
  const features = [
    ["🔒", "Privacy First", "Files never leave your browser. Zero server uploads ever."],
    ["⚡", "Instant Results", "All processing is local. No waiting for server response."],
    ["🚫", "No Signup", "No account. No email. No credit card. Just use it."],
    ["♾️", "No Limits", "No daily limits, no file count caps, no watermarks."],
    ["📱", "Works on Mobile", "Fully responsive. Use on any device, any screen."],
    ["🆓", "Always Free", "Core tools will always be free. No bait-and-switch."],
  ];

  return (
    <section id="free" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>🆓 No Catch</span>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>
            Free forever. Seriously.
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 440, margin: "0 auto" }}>
            We make money through non-intrusive ads. You get world-class tools at zero cost.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {features.map(([icon, title, desc], i) => (
            <div key={i} className="glass glass-hover" style={{ borderRadius: 14, padding: "22px 20px", display: "flex", gap: 14 }}>
              <div style={{ fontSize: 26, lineHeight: 1 }}>{icon}</div>
              <div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{
          marginTop: 48, borderRadius: 20, padding: "48px 32px", textAlign: "center",
          background: "linear-gradient(135deg, rgba(108,99,255,0.12), rgba(56,189,248,0.08))",
          border: "1px solid rgba(108,99,255,0.2)"
        }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
            Ready to use pdfbucket?
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 15 }}>
            Start with any tool. No account. No download. Just results.
          </p>
          <a href="#tools" className="btn-primary" style={{ fontSize: 15, padding: "14px 36px", textDecoration: "none" }}>
            Start Free ↗
          </a>
        </div>
      </div>
    </section>
  );
}
