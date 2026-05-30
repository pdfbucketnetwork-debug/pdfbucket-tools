import Link from "next/link";
import { BlogPost } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <article style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "28px 24px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
        className="glass-hover"
      >
        <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            background: "rgba(108,99,255,0.12)",
            color: "var(--accent)",
            fontSize: 11,
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 50,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {post.category}
          </span>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>{post.readTime}</span>
        </div>

        <h2 style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: 17,
          color: "var(--text)",
          marginBottom: 12,
          lineHeight: 1.4,
          flex: 1,
        }}>
          {post.title}
        </h2>

        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          {post.excerpt}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid var(--border)",
          paddingTop: 16,
        }}>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>Read more →</span>
        </div>
      </article>
    </Link>
  );
}
