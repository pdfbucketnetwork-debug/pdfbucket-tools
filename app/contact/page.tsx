import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — PDFBucket",
  description: "Get in touch with the PDFBucket team for support, feedback, or business inquiries.",
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 896, margin: "0 auto", paddingTop: 160, paddingBottom: 64, paddingLeft: 24, paddingRight: 24 }}>
      <h1 className="text-4xl font-bold font-outfit mb-8 tracking-tight">Contact Us</h1>
      <p className="text-lg text-[var(--muted)] mb-12">
        Have questions, feedback, or need support? We're here to help. Reach out to us using the contact information below, and our team will get back to you as soon as possible.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="glass p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="bg-[var(--accent-hover-bg)] p-4 rounded-full mb-6">
            <Mail className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-xl font-bold font-outfit mb-2">Email Support</h3>
          <p className="text-[var(--muted)] mb-4">
            For general inquiries, support, or partnership opportunities, send us an email.
          </p>
          <a href="mailto:support@pdfbucket.online" className="text-[var(--accent)] font-semibold hover:underline">
            support@pdfbucket.online
          </a>
        </div>

        <div className="glass p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="bg-[var(--accent-hover-bg)] p-4 rounded-full mb-6">
            <MapPin className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-xl font-bold font-outfit mb-2">Location</h3>
          <p className="text-[var(--muted)] mb-4">
            PDFBucket operates globally, providing borderless access to private file tools.
          </p>
          <span className="text-[var(--text)] font-semibold">
            Global / Remote
          </span>
        </div>
      </div>

      <div className="blog-content">
        <h2>Report an Issue</h2>
        <p>
          Encountered a bug or an issue with one of our tools? Please send an email to our support team with a description of the problem, the tool you were using, and your browser/device information. We strive to fix issues as quickly as possible.
        </p>

        <h2>Feature Requests</h2>
        <p>
          We build PDFBucket for you. If there's a specific tool or feature you'd like to see added to our suite, don't hesitate to drop us an email. We read every single suggestion and prioritize the features our community needs the most.
        </p>
      </div>
    </div>
  );
}
