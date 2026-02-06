import type { Metadata } from "next";
import LegacyHtmlPage from "@/components/LegacyHtmlPage";
import { buildLegacyMetadata } from "@/lib/legacy-page";

const SOURCE = "index.html";

export const metadata: Metadata = buildLegacyMetadata(SOURCE);

export default function HomePage() {
  return <LegacyHtmlPage source={SOURCE} />;
}
