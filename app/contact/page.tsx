"use client";
import { useState } from "react";
import { Mail, MapPin, Send, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>
      
      {/* Hero Header */}
      <section style={{ padding: "140px 24px 64px", textAlign: "center", background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>💬 GET IN TOUCH</span>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1 }}>
            Contact Us
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            Have questions, feedback, or need help? Send us a message and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: "80px 24px 120px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: 40,
          alignItems: "start"
        }}>
          
          {/* Left Column: Interactive Contact Form */}
          <div className="glass" style={{ 
            background: "var(--surface)", 
            border: "1px solid var(--border)", 
            borderRadius: 24, 
            padding: 32,
            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.05)"
          }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
              Send a Message
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
              Fill out the form below and we will reach out to you directly via email.
            </p>

            {submitted ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px 16px", 
                background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(56,189,248,0.05))",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 16
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
                  Message Sent!
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  Thank you for reaching out. We have received your submission and will contact you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: 20, background: "none", border: "1px solid var(--border)",
                    borderRadius: 100, padding: "8px 20px", cursor: "pointer", fontSize: 13,
                    color: "var(--text)", fontWeight: 500
                  }}
                  className="glass-hover"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label htmlFor="name" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      border: "1px solid var(--border)", background: "var(--bg)",
                      color: "var(--text)", fontSize: 14, outline: "none", transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                <div>
                  <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      border: "1px solid var(--border)", background: "var(--bg)",
                      color: "var(--text)", fontSize: 14, outline: "none", transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                <div>
                  <label htmlFor="subject" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>
                    Subject
                  </label>
                  <select 
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      border: "1px solid var(--border)", background: "var(--bg)",
                      color: "var(--text)", fontSize: 14, outline: "none", cursor: "pointer"
                    }}
                  >
                    <option value="General Support">General Support</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Business Inquiries">Business Inquiries</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>
                    Message
                  </label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 12,
                      border: "1px solid var(--border)", background: "var(--bg)",
                      color: "var(--text)", fontSize: 14, outline: "none",
                      resize: "vertical", fontFamily: "inherit", transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    background: "var(--accent)", color: "white", border: "none",
                    borderRadius: 12, padding: "14px", cursor: "pointer", fontSize: 14,
                    fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, transition: "background 0.2s, opacity 0.2s", marginTop: 8
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent)"}
                >
                  <Send size={16} />
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Info Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Email Support Card */}
            <div style={{ 
              background: "var(--surface)", border: "1px solid var(--border)", 
              borderRadius: 20, padding: 24, display: "flex", gap: 16, alignItems: "flex-start" 
            }}>
              <div style={{ 
                background: "rgba(108,99,255,0.08)", color: "var(--accent)", 
                padding: 12, borderRadius: 12, display: "flex", alignItems: "center" 
              }}>
                <Mail size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 6px 0", color: "var(--text)" }}>
                  Email Support
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, margin: "0 0 12px 0" }}>
                  For support, bug reporting, or suggestions, reach out via our official support email.
                </p>
                <a 
                  href="mailto:support@pdfbucket.online" 
                  style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
                  className="hover:underline"
                >
                  support@pdfbucket.online
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div style={{ 
              background: "var(--surface)", border: "1px solid var(--border)", 
              borderRadius: 20, padding: 24, display: "flex", gap: 16, alignItems: "flex-start" 
            }}>
              <div style={{ 
                background: "rgba(56,189,248,0.08)", color: "#38bdf8", 
                padding: 12, borderRadius: 12, display: "flex", alignItems: "center" 
              }}>
                <MapPin size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 6px 0", color: "var(--text)" }}>
                  Location & Operations
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, margin: "0 0 4px 0" }}>
                  PDFBucket operates as a global, remote-first project, bringing secure in-browser utility converters to users worldwide.
                </p>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>
                  Global / Remote
                </span>
              </div>
            </div>

            {/* Bug & Feature Reports Card */}
            <div style={{ 
              background: "var(--surface)", border: "1px solid var(--border)", 
              borderRadius: 20, padding: 24, display: "flex", gap: 16, alignItems: "flex-start" 
            }}>
              <div style={{ 
                background: "rgba(245,158,11,0.08)", color: "#f59e0b", 
                padding: 12, borderRadius: 12, display: "flex", alignItems: "center" 
              }}>
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 6px 0", color: "var(--text)" }}>
                  Issue & Feature Request Policy
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, margin: 0 }}>
                  Encountered a glitch or need a new conversion option? Use our contact form or send a detailed email specifying your device, browser, and the steps to reproduce the issue. We review all feedback to continuously improve PDFBucket.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
