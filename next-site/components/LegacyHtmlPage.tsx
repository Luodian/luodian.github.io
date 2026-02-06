import { notFound } from "next/navigation";
import { loadLegacyDocument } from "@/lib/legacy-page";

type LegacyHtmlPageProps = {
  source: string;
};

export default function LegacyHtmlPage({ source }: LegacyHtmlPageProps) {
  try {
    const page = loadLegacyDocument(source);
    return <div dangerouslySetInnerHTML={{ __html: page.html }} />;
  } catch {
    notFound();
  }
}
