import type { Metadata } from "next";
import VoteList from "@/components/Voting/VoteList";

export const metadata: Metadata = {
  title: "Current Votes | Heise Powless",
};

//fetched in the browser, not on the server
export default function Page() {
  return <VoteList />;
}
