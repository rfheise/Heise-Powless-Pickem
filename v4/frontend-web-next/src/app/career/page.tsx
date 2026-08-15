import type { Metadata } from "next";
import CareerView from "@/components/Career/CareerView";
import { serverGet } from "@/lib/server";
import { Player } from "@/lib/types";

//prerendered html is served to every visitor and regenerated in the
//background at most once every 5 minutes. must be a literal - next parses
//this statically, it cannot follow an imported constant.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "All Time | Heise Powless",
};

export default async function Page() {
  const req = await serverGet("/api/career");
  const players: Player[] = req.success ? req.payload.players : [];
  return <CareerView players={players} />;
}
