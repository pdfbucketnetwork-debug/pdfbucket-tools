import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "PDFBucket — Free Online File Tools",
  description: "Fast, free tools for images, audio, QR codes and more. No signup. No upload limits. All processing happens in your browser.",
  keywords: "image compressor, resize image, convert image, background remover, qr code generator, free online tools",
  openGraph: {
    title: "PDFBucket — Free Online File Tools",
    description: "Drop any file. Get what you need.",
    url: "https://pdfbucket.online",
    siteName: "PDFBucket",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
