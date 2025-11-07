import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/providers/AccessibilityProvider";
import AccessibilityToolbar from "@/components/ui/AccessibilityToolbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HeartConnect - Matrimony for People with Special Needs",
  description:
    "A compassionate matrimony platform designed specifically for individuals with special needs. Find meaningful connections with understanding and support.",
  keywords:
    "matrimony, special needs, disability, marriage, relationships, accessible dating",
  authors: [{ name: "HeartConnect Team" }],
  openGraph: {
    title: "HeartConnect - Matrimony for People with Special Needs",
    description:
      "Find meaningful connections on our inclusive matrimony platform",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartConnect",
    description: "Inclusive matrimony platform for people with special needs",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#ef4444",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AccessibilityProvider>
          {children}
          <AccessibilityToolbar />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
