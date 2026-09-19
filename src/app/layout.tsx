import type { Metadata } from "next";
import "./globals.css";
import { ConsentProvider } from "@/context/consent";
import CookieBanner from "@/components/common/PrivacyPolicyPrompt";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://status.melvinjonesrepol.com"),
  title: "Status - Melvin Jones Repol",
  description:
    "Service availability and uptime monitoring for Melvin Jones Repol.",
  authors: [
    { name: "Melvin Jones Repol", url: "https://www.melvinjonesrepol.com" },
  ],
  alternates: {
    canonical: "https://status.melvinjonesrepol.com",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="hostname" content="status.melvinjonesrepol.com" />
      </head>
      <body className="antialiased">
        <ConsentProvider>
          <CookieBanner />
          {children}
          <Footer />
        </ConsentProvider>
      </body>
    </html>
  );
}
