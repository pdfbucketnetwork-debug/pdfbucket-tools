"use client";
export default function HowItWorks() {
  const steps = [
    { n: "01", icon: "📂", title: "Pick a Tool", desc: "Choose from 10+ free tools — compressor, converter, QR generator and more." },
    { n: "02", icon: "⬆️", title: "Drop Your File", desc: "Drag and drop or click to upload. No file size restrictions. No account needed." },
    { n: "03", icon: "⚡", title: "Instant Processing", desc: "Everything runs in your browser. Zero server uploads. Your files stay private." },
    { n: "04", icon: "⬇️", title: "Download & Done", desc: "One click to download your result. Fast, clean, and completely free." },
  ];

  return (
    <section id="how" style={{ padding: "80px 24px", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>⚡ Dead Simple</span>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>
            How it works
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 400, margin: "0 auto" }}>
            Four steps. Under 30 seconds. No technical knowledge required.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, position: "relative" }}>
          {/* Connector line */}
          <div style={{
            position: "absolute", top: 32, left: "12.5%", right: "12.5%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.3), rgba(56,189,248,0.3), transparent)",
            pointerEvents: "none",
          }} />

          {steps.map((step, i) => (
            <div key={i} style={{ textAlign: "center", padding: "28px 20px", position: "relative" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, position: "relative"
              }}>
                {step.icon}
                <span style={{
                  position: "absolute", top: -6, right: -6, width: 20, height: 20,
                  background: "var(--accent)", borderRadius: "50%", fontSize: 9,
                  fontFamily: "Syne, sans-serif", fontWeight: 700, color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>{i + 1}</span>
              </div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 6 }}>{step.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
