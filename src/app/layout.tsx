import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/providers/AccessibilityProvider";
import AccessibilityToolbar from "@/components/ui/AccessibilityToolbar";
import AccessibilityChatbot from "@/components/ui/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HeartConnect - Matrimony for People with Special Needs",
  description:
    "A compassionate matrimony platform designed specifically for individuals with special needs. Find meaningful connections with understanding and support.",
  keywords:
    "matrimony, special needs, disability, marriage, relationships, accessible dating, inclusive platform",
  authors: [{ name: "HeartConnect Team" }],
  openGraph: {
    title: "HeartConnect - Matrimony for People with Special Needs",
    description:
      "Find meaningful connections on our inclusive matrimony platform designed for people with special needs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartConnect - Inclusive Matrimony Platform",
    description: "Inclusive matrimony platform for people with special needs",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
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
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AccessibilityProvider>
          {children}
          <AccessibilityToolbar />
          <AccessibilityChatbot />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
