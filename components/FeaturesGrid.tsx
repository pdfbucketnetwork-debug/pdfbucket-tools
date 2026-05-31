"use client";

export default function FeaturesGrid() {
  const features = [
    { icon: "⚡", title: "Blazing Fast", desc: "No server uploads. Everything processes instantly in your local browser." },
    { icon: "🔒", title: "100% Private", desc: "Your files never leave your device. Zero risk of data leaks." },
    { icon: "♾️", title: "No Limits", desc: "Process files of any size, as many times as you want. Truly unlimited." },
    { icon: "🆓", title: "Always Free", desc: "No subscriptions, no hidden fees. All core tools are completely free." },
  ];

  return (
    <section style={{ padding: "100px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2.6rem", fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
            Engineered for speed & privacy
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 540, margin: "0 auto", fontWeight: 400 }}>
            The fastest, most secure way to handle your everyday file tasks without compromising your data.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="glass glass-hover" style={{ padding: "40px 32px", borderRadius: 16, textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 12, background: "var(--bg2)", 
                display: "flex", alignItems: "center", justifyContent: "center", 
                fontSize: 24, marginBottom: 24, border: "1px solid var(--border)"
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 10, color: "var(--text)" }}>{f.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
