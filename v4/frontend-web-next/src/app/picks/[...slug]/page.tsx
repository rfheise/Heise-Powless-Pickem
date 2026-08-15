import type { Metadata } from "next";
import PickPage from "@/components/Pick/PickCoalese";

export const metadata: Metadata = {
  title: "My Picks | Heise Powless",
};

//matches the old "/picks/*" route - the user uuid is the last segment
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const state = slug[slug.length - 1];
  return <PickPage route={`/api/picks/${state}`} userId={state} />;
}
