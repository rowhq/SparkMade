import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sparkmade.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SparkMade - AI-Powered Product Creation & Crowdfunding",
    template: "%s | SparkMade",
  },
  description:
    "Turn your product ideas into reality with AI-powered design, image generation, and smart crowdfunding. Create, validate, and launch manufacturable products in minutes.",
  keywords: [
    "product design",
    "AI design",
    "crowdfunding",
    "product development",
    "manufacturing",
    "pre-orders",
    "kickstarter alternative",
    "product validation",
    "AI image generation",
    "product studio",
  ],
  authors: [{ name: "SparkMade" }],
  creator: "SparkMade",
  publisher: "SparkMade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "SparkMade - AI-Powered Product Creation & Crowdfunding",
    description:
      "Turn your product ideas into reality with AI-powered design, image generation, and smart crowdfunding.",
    siteName: "SparkMade",
  },
  twitter: {
    card: "summary_large_image",
    title: "SparkMade - AI-Powered Product Creation & Crowdfunding",
    description:
      "Turn your product ideas into reality with AI-powered design, image generation, and smart crowdfunding.",
    creator: "@sparkmade",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
