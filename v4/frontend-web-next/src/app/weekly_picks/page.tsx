import type { Metadata } from "next";
import WeeklyPicksView from "@/components/Pick/WeeklyPicksView";

export const metadata: Metadata = {
  title: "Weekly Picks | Heise Powless",
};

//fetched in the browser, not on the server
export default function Page() {
  return <WeeklyPicksView />;
}
