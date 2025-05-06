import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Influen Sync - Connect Brands and Influencers",
  description: "AI-powered platform for matching brands and influencers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full light`}
      data-force-color-scheme="light"
    >
      <body className="font-sans h-full bg-white text-primary-800">
        {children}
      </body>
    </html>
  );
}
