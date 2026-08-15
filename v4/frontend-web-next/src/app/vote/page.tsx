import type { Metadata } from "next";
import Voting from "@/components/Voting/Voting";

export const metadata: Metadata = {
  title: "Ban Some Teams | Heise Powless",
};

export default function Page() {
  return <Voting />;
}
