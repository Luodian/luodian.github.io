import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
export const metadata: Metadata = {
  title: "About | Brian (Bo) Li",
  description:
    "Bo Li's research interests, professional experience, talks, and community work.",
  alternates: { canonical: "https://www.brianboli.com/inside/" },
};
export default function AboutPage() {
  return <Portfolio view="inside" />;
}
