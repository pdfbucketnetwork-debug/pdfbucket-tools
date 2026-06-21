import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — PDFBucket",
  description: "Get in touch with the PDFBucket team for customer support, bug reports, feature requests, or business inquiries.",
  alternates: { canonical: "https://pdfbucket.online/contact" },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Us",
  "description": "Contact PDFBucket support for bug reports, feature requests, or general inquiries.",
  "url": "https://pdfbucket.online/contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "PDFBucket",
    "url": "https://pdfbucket.online"
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
