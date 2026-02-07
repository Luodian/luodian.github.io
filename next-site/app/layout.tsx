import type { ReactNode } from "react";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { GeistPixelSquare } from "geist/font/pixel";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <head>
        <link rel="preload" as="image" href="/vibe-bg.jpg" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
