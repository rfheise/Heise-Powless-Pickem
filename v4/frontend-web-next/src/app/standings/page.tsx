import type { Metadata } from "next";
import Standings from "@/components/Standings/Standings";
import { serverGet } from "@/lib/server";
import { User } from "@/lib/interfaces";

//prerendered html is served to every visitor and regenerated in the
//background at most once every 5 minutes. must be a literal - next parses
//this statically, it cannot follow an imported constant.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Standings | Heise Powless",
};

export default async function Page() {
  const req = await serverGet("/api/standings");
  const standings: User[] = req.success ? req.payload : [];
  return <Standings standings={standings} />;
}
