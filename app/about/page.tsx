import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — PDFBucket",
  description: "Learn more about PDFBucket, our mission, and our completely free, private, and browser-based file tools.",
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 896, margin: "0 auto", paddingTop: 160, paddingBottom: 64, paddingLeft: 24, paddingRight: 24 }}>
      <h1 className="text-4xl font-bold font-outfit mb-8 tracking-tight">About PDFBucket</h1>
      <div className="blog-content">
        <p>
          Welcome to PDFBucket. We are a passionate team dedicated to making essential file processing tools accessible, fast, and completely secure for everyone.
        </p>

        <h2>Our Mission</h2>
        <p>
          In an era where privacy is often compromised for convenience, our mission is to prove that you don't have to choose between the two. We set out to build a comprehensive suite of file tools—from image compression and resizing to format conversion and OCR text extraction—that operate entirely within your browser. 
        </p>
        <p>
          By leveraging modern web technologies like WebAssembly and local processing APIs, we ensure that your files never leave your device. There are no server uploads, no waiting times, and no hidden fees.
        </p>

        <h2>Why We Stand Out</h2>
        <ul>
          <li><strong>100% Privacy:</strong> All file processing is done locally on your machine. We don't store, view, or upload any of your files.</li>
          <li><strong>Lightning Fast:</strong> Say goodbye to upload and download delays. Results are instantaneous.</li>
          <li><strong>No Strings Attached:</strong> No signups, no subscriptions, and no complicated pricing tiers. The tools you need, always free.</li>
        </ul>

        <h2>Looking Ahead</h2>
        <p>
          We are constantly evolving and expanding our toolkit to meet the needs of developers, students, and everyday users. If you have any suggestions or feedback, we'd love to hear from you.
        </p>
        <p>
          Thank you for trusting PDFBucket with your files.
        </p>
      </div>
    </div>
  );
}
