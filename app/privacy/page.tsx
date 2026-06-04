import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PDFBucket",
  description: "Read our privacy policy to understand how PDFBucket protects your data and ensures your files remain private and secure.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto pt-32 pb-16 px-6 sm:px-12">
      <h1 className="text-4xl font-bold font-outfit mb-4 tracking-tight">Privacy Policy</h1>
      <p className="text-[var(--muted)] mb-8 font-medium">Last Updated: June 4, 2026</p>
      
      <div className="blog-content">
        <p>
          At PDFBucket, your privacy is our top priority. This Privacy Policy outlines our practices regarding any information we might collect and how we ensure your data remains secure when you use our website (pdfbucket.online) and our suite of free tools.
        </p>

        <h2>1. Local Processing & File Privacy</h2>
        <p>
          The core feature of PDFBucket is that <strong>we do not upload, store, or process your files on our servers.</strong> All file manipulations—including compression, resizing, format conversion, and text extraction—are performed strictly locally within your web browser using JavaScript and WebAssembly APIs.
        </p>
        <ul>
          <li><strong>No Uploads:</strong> Not a single byte of your file is transmitted over the internet to our servers.</li>
          <li><strong>Complete Privacy:</strong> Since the processing happens on your device, only you have access to your files and the processed results.</li>
        </ul>

        <h2>2. Data Collection</h2>
        <p>
          Because our tools run completely on the client side, we do not require you to create an account, nor do we collect any personally identifiable information (PII) such as your name, email address, or billing details.
        </p>
        <p>
          We may automatically collect non-personally identifiable information strictly for analytics and performance monitoring purposes. This includes:
        </p>
        <ul>
          <li>Browser type and version</li>
          <li>Device type (mobile or desktop)</li>
          <li>Pages visited on our website</li>
          <li>Anonymous usage metrics of our tools (e.g., number of times a tool was accessed)</li>
        </ul>

        <h2>3. Cookies and Tracking Technologies</h2>
        <p>
          PDFBucket uses standard cookies to enhance user experience. We use basic analytical tools to understand website traffic and usage patterns.
        </p>
        <p>
          We also partner with third-party advertising networks, such as Google AdSense, to display non-intrusive ads that help keep our tools free. These third-party vendors may use cookies to serve ads based on a user's prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.
        </p>

        <h2>4. Third-Party Links</h2>
        <p>
          Our website may contain links to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
        </p>

        <h2>5. Children's Privacy</h2>
        <p>
          Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
        </p>

        <h2>6. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions or suggestions about our Privacy Policy, please contact us at: <a href="mailto:support@pdfbucket.online">support@pdfbucket.online</a>.
        </p>
      </div>
    </div>
  );
}
