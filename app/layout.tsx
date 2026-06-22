import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Amor Travel",
  description: "Amor Travel — holidays, excursions, and custom trips.",
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
    <html lang="mk" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-hidden bg-amor-white text-amor-text">
        {children}
      </body>
    </html>
  );
}
