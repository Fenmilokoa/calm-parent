import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Calm Parent — Guidance for your hardest parenting moments",
  description: "Trauma-informed, real-time parenting support. Built by a parent, for parents who want to do better.",
  metadataBase: new URL("https://calm-parent.vercel.app"),
  openGraph: {
    title: "Calm Parent — Guidance for your hardest parenting moments",
    description: "Trauma-informed, real-time parenting support. Built by a parent, for parents who want to do better.",
    url: "https://calm-parent.vercel.app",
    siteName: "Calm Parent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calm Parent",
    description: "Trauma-informed, real-time parenting support. Built by a parent, for parents who want to do better.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
