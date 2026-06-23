import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Playfair_Display } from "next/font/google";
import { defaultSiteMetadata, SITE_URL } from "@/lib/site-metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  ...defaultSiteMetadata("mk"),
  metadataBase: SITE_URL,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mk" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-hidden bg-amor-white text-amor-text">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
