import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — PDFBucket",
  description: "Read the terms and conditions for using PDFBucket's free online tools and website.",
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 896, margin: "0 auto", paddingTop: 160, paddingBottom: 64, paddingLeft: 24, paddingRight: 24 }}>
      <h1 className="text-4xl font-bold font-outfit mb-4 tracking-tight">Terms & Conditions</h1>
      <p className="text-[var(--muted)] mb-8 font-medium">Last Updated: June 4, 2026</p>
      
      <div className="blog-content">
        <p>
          Welcome to PDFBucket. By accessing and using our website (pdfbucket.online) and our suite of free online tools, you agree to be bound by these Terms and Conditions. Please read them carefully. If you do not agree with any part of these terms, you must not use our website.
        </p>

        <h2>1. Use of the Service</h2>
        <p>
          PDFBucket provides a collection of free, browser-based tools for processing files (such as image compression, resizing, format conversion, and text extraction). 
        </p>
        <ul>
          <li><strong>No Warranty:</strong> The tools and services are provided "as is" without any warranties, expressed or implied. We do not guarantee that the tools will always be available, error-free, or meet your specific requirements.</li>
          <li><strong>Local Processing:</strong> All file processing is performed locally in your web browser. We do not upload, store, or have access to the files you process using our tools.</li>
          <li><strong>Lawful Use:</strong> You agree to use the service only for lawful purposes. You must not use our tools to process illegal, harmful, or copyright-infringing materials.</li>
        </ul>

        <h2>2. Intellectual Property Rights</h2>
        <p>
          The website design, text, graphics, branding, and underlying codebase (excluding open-source libraries used) of PDFBucket are the intellectual property of PDFBucket. You may not reproduce, distribute, or create derivative works from any part of our website without explicit permission.
        </p>
        <p>
          <strong>Your Files:</strong> You retain full ownership and intellectual property rights to any files you process using PDFBucket. Since files are not uploaded to our servers, we claim no rights over your processed content.
        </p>

        <h2>3. Limitation of Liability</h2>
        <p>
          In no event shall PDFBucket, its developers, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages resulting from:
        </p>
        <ul>
          <li>The use or inability to use the service.</li>
          <li>Data loss, file corruption, or any errors during file processing.</li>
          <li>Any unauthorized access to your device resulting from vulnerabilities outside of our control.</li>
        </ul>
        <p>
          You are solely responsible for keeping backups of your files before processing them with PDFBucket.
        </p>

        <h2>4. Advertisements and Third-Party Links</h2>
        <p>
          To keep our tools free, PDFBucket displays advertisements provided by third-party networks (e.g., Google AdSense). We are not responsible for the content of these advertisements or the websites they link to. Your interactions with advertisers found on our site are solely between you and the advertiser.
        </p>

        <h2>5. Modifications to the Service</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice. We also reserve the right to change these Terms and Conditions at any time. Your continued use of the website following the posting of changes will mean you accept those changes.
        </p>

        <h2>6. Governing Law</h2>
        <p>
          These Terms and Conditions are governed by and construed in accordance with standard international internet laws, and you irrevocably submit to the exclusive jurisdiction of the competent courts in the jurisdiction where PDFBucket operates.
        </p>

        <h2>7. Contact Information</h2>
        <p>
          If you have any questions regarding these Terms and Conditions, please refer to our <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact Us</Link> page or reach out directly at <a href="mailto:support@pdfbucket.online">support@pdfbucket.online</a>.
        </p>
      </div>
    </div>
  );
}
