import type { Metadata } from "next";
import SplashScreen from "@/components/SplashScreen";
export const metadata: Metadata = {
  title: "I'm feeling it | Brian (Bo) Li",
  description: "The playful side of Brian's homepage.",
};
export default function PlayPage() {
  return (
    <>
      <link rel="preload" as="image" href="/vibe-bg.jpg" fetchPriority="high" />
      <SplashScreen />
    </>
  );
}
