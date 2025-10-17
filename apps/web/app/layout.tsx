import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SparkMade - The product is the strategy",
  description: "Bring new products to life with AI-powered design and smart crowdfunding.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
