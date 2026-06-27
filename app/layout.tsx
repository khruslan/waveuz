import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wavelabs.uz"),
  title: "WaveLabs - AI Engineering Studio · Tashkent",
  description:
    "WaveLabs is a C-level AI engineering studio based in Tashkent, Uzbekistan. Official resident of IT Park, AIFC, and Astana Hub.",
  keywords: [
    "AI engineering",
    "machine learning",
    "custom software",
    "data engineering",
    "Uzbekistan",
    "Kazakhstan",
    "Central Asia",
    "IT Park",
    "AIFC",
    "Astana Hub"
  ],
  openGraph: {
    title: "WaveLabs - AI Engineering Studio",
    description:
      "C-level AI execution. Official resident of IT Park, AIFC, and Astana Hub. Closing enterprise contracts across Central Asia.",
    url: "https://wavelabs.uz",
    siteName: "WaveLabs",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "WaveLabs - AI Engineering Studio",
    description: "AI systems, enterprise software, and data infrastructure for Central Asia and beyond."
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06060A"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
