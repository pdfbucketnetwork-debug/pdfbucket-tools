"use client";

export default function FeaturesGrid() {
  const features = [
    { icon: "⚡", title: "Blazing Fast", desc: "No server uploads. Everything processes instantly in your local browser." },
    { icon: "🔒", title: "100% Private", desc: "Your files never leave your device. Zero risk of data leaks." },
    { icon: "♾️", title: "No Limits", desc: "Process files of any size, as many times as you want. Truly unlimited." },
    { icon: "🆓", title: "Always Free", desc: "No subscriptions, no hidden fees. All core tools are completely free." },
  ];

  return (
    <section style={{ padding: "80px 24px", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "2.2rem", fontWeight: 800, marginBottom: 14, color: "var(--text)" }}>
            Why Choose PDFBucket?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            The fastest, most secure way to handle your everyday file tasks.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="glass glass-hover" style={{ padding: "32px 24px", borderRadius: 16, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 12, color: "var(--text)" }}>{f.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
