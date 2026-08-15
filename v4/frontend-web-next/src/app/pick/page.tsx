import type { Metadata } from "next";
import MakePick from "@/components/Pick/MakePick";

export const metadata: Metadata = {
  title: "Make A Pick | Heise Powless",
};

export default function Page() {
  return <MakePick />;
}
