import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Status - Melvin Jones Repol",
  description:
    "Service availability and uptime monitoring for Melvin Jones Repol.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="hostname" content="status.melvinjonesrepol.com" />
        <meta name="canonical" content="https://status.melvinjonesrepol.com/" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
