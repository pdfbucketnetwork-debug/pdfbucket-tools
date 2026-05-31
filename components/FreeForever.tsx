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
    <section id="free" style={{ padding: "100px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2.6rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Free forever. Seriously.
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 540, margin: "0 auto" }}>
            We make money through non-intrusive ads. You get world-class tools at zero cost.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map(([icon, title, desc], i) => (
            <div key={i} className="glass" style={{ borderRadius: 16, padding: "28px 24px", display: "flex", gap: 20, alignItems: "flex-start", background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 28, lineHeight: 1, padding: 12, background: "var(--bg)", borderRadius: 12, border: "1px solid var(--border2)" }}>{icon}</div>
              <div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 17, marginBottom: 6 }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{
          marginTop: 80, borderRadius: 24, padding: "64px 32px", textAlign: "center",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.05)"
        }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2.4rem", fontWeight: 700, marginBottom: 16 }}>
            Ready to streamline your workflow?
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 17, maxWidth: 480, margin: "0 auto 36px" }}>
            Start with any tool. No account required. No software to download.
          </p>
          <a href="#tools" className="btn-primary" style={{ fontSize: 16, padding: "16px 40px", textDecoration: "none" }}>
            Start using tools
          </a>
        </div>
      </div>
    </section>
  );
}
