import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
export const metadata: Metadata = {
  title: "Projects | Brian (Bo) Li",
  description:
    "Open multimodal models and tools: LLaVA-OneVision, OneVision-Encoder, LMMs-Eval, LMMs-Engine, and more.",
  alternates: { canonical: "https://www.brianboli.com/projects/" },
};
export default function ProjectsPage() {
  return <Portfolio view="projects" />;
}
