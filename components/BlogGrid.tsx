"use client";
import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/lib/blog";
import Link from "next/link";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [currentCategory, setCurrentCategory] = useState("All");

  const filteredPosts = currentCategory === "All" 
    ? posts 
    : posts.filter(p => p.category === currentCategory);

  return (
    <section style={{ padding: "64px 24px 100px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
        {["All", "Image Tools", "Guides", "Social Media", "QR Codes", "Productivity", "Design", "Reviews"].map(cat => {
          const isActive = currentCategory === cat;
          return (
            <button 
              key={cat} 
              onClick={() => setCurrentCategory(cat)} 
              style={{
                padding: "6px 16px",
                borderRadius: 50,
                fontSize: 13,
                fontWeight: 500,
                background: isActive ? "var(--accent)" : "var(--surface)",
                color: isActive ? "white" : "var(--muted)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
        {filteredPosts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", gridColumn: "1 / -1" }}>
            No posts found for this category.
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 80, borderRadius: 20, padding: "56px 32px", textAlign: "center",
        background: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(56,189,248,0.07))",
        border: "1px solid var(--border)",
      }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
          Ready to try the tools?
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 15 }}>
          All tools run in your browser. No signup. No limits. 100% free.
        </p>
        <Link href="/tools" className="btn-primary" style={{ textDecoration: "none", padding: "14px 36px", fontSize: 15 }}>
          Use Free Tools ↗
        </Link>
      </div>
    </section>
  );
}
