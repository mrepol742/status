import type { Metadata } from "next";
import "./globals.css";
import { ConsentProvider } from "@/context/consent";
import CookieBanner from "@/components/common/PrivacyPolicyPrompt";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

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
  openGraph: {
    title: "Status - Melvin Jones Repol",
    description:
      "Service availability and uptime monitoring for Melvin Jones Repol.",
    url: "https://status.melvinjonesrepol.com",
    siteName: "Status",
    images: [
      {
        url: "https://status.melvinjonesrepol.com/images/melvinjonesrepol.cover.png",
        width: 800,
        height: 600,
        alt: "Melvin Jones Repol",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Status - Melvin Jones Repol",
    description:
      "Service availability and uptime monitoring for Melvin Jones Repol.",
    images: [
      "https://status.melvinjonesrepol.com/images/melvinjonesrepol.cover.png",
    ],
    creator: "@mrepol742",
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
          <div className="site-nav-shell">
            <Navbar />
          </div>
          <CookieBanner />
          {children}
          <Footer />
        </ConsentProvider>
      </body>
    </html>
  );
}
