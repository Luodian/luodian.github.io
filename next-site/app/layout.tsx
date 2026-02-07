import type { ReactNode } from "react";
import "./globals.css";
import { GeistPixelSquare } from "geist/font/pixel";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistPixelSquare.variable}>
      <body>{children}</body>
    </html>
  );
}
