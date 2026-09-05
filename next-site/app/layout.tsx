import type { ReactNode } from "react";
import "./globals.css";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { GeistPixelSquare } from "geist/font/pixel";

const ArkPixelZhCn = localFont({
  src: "./fonts/ark-pixel-16px-proportional-zh_cn.otf.woff2",
  variable: "--font-ark-pixel-zh-cn",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} ${ArkPixelZhCn.variable}`}
    >
      <head>
        <link rel="preload" as="image" href="/vibe-bg.jpg" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
