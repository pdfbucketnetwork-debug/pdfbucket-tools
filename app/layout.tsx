import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const DOMAIN = "https://pdfbucket.online";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "PDFBucket — Free Online Image & File Tools",
    template: "%s | PDFBucket",
  },
  description: "Free browser-based tools to compress, resize, convert, and process images. No signup. No file uploads. 100% private. Works on any device.",
  keywords: [
    "image compressor online free", "resize image online", "convert png to jpeg",
    "qr code generator free", "ocr text extractor", "color palette from image",
    "compress image without losing quality", "free online image tools", "browser image tools",
    "image tools no signup",
  ],
  authors: [{ name: "PDFBucket Team", url: DOMAIN }],
  creator: "PDFBucket",
  publisher: "PDFBucket",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: DOMAIN,
    siteName: "PDFBucket",
    title: "PDFBucket — Free Online Image & File Tools",
    description: "Compress, resize, convert, and process images — free, private, in your browser.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDFBucket — Free Online Image Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFBucket — Free Online Image & File Tools",
    description: "Compress, resize, convert images — free, no signup, 100% private.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PDFBucket",
  "url": DOMAIN,
  "description": "Free browser-based tools to compress, resize, convert, and process images.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `${DOMAIN}/blog?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PDFBucket",
  "url": DOMAIN,
  "logo": `${DOMAIN}/logo.png`,
  "description": "PDFBucket provides free, browser-based image processing tools. No signup, no file uploads — 100% private.",
  "foundingDate": "2024",
  "sameAs": [
    "https://github.com/pdfbucketnetwork-debug/pdfbucket-tools",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": `${DOMAIN}/blog`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#6c63ff" />
        <meta name="format-detection" content="telephone=no" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          <main style={{ minHeight: "100vh" }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
