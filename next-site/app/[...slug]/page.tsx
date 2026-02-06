import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegacyHtmlPage from "@/components/LegacyHtmlPage";
import {
  buildLegacyMetadata,
  listLegacySlugs,
  slugToLegacySource
} from "@/lib/legacy-page";

type CatchAllPageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return listLegacySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  const source = slugToLegacySource(slug);
  if (!source) {
    return {};
  }
  return buildLegacyMetadata(source);
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const source = slugToLegacySource(slug);
  if (!source) {
    notFound();
  }

  return <LegacyHtmlPage source={source} />;
}
