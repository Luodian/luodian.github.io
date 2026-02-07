import type { Metadata } from "next";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "Brian is building",
  description:
    "Brian is building something. Previously he built LMMs-Eval, LLaVA-OneVision, LMMs-Engine, and OneVision-Encoder.",
};

export default function HomePage() {
  return <SplashScreen />;
}
