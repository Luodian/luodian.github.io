import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
export const metadata: Metadata = {
  title: "Brian (Bo) Li | Researcher & Builder",
  description:
    "Bo Li at Advanced Machine Intelligence. Multimodal models, visual representations, and open research tools. Co-founder of LMMs-Lab.",
  alternates: { canonical: "https://www.brianboli.com/" },
};
export default function HomePage() {
  return <Portfolio />;
}
