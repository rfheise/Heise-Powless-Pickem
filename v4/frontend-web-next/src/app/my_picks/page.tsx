import type { Metadata } from "next";
import PickPage from "@/components/Pick/PickCoalese";

export const metadata: Metadata = {
  title: "My Picks | Heise Powless",
};

export default function Page() {
  return <PickPage route={"/api/mypicks"} userId={"me"} />;
}
