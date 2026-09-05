import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
export const metadata: Metadata = {
  title: "Publications | Brian (Bo) Li",
  description:
    "Selected publications by Bo Li, including LLaVA-OneVision-2, OneVision-Encoder, LongVT, and MMSearch-R1.",
  alternates: { canonical: "https://www.brianboli.com/publications/" },
};
export default function PublicationsPage() {
  return <Portfolio view="publications" />;
}
