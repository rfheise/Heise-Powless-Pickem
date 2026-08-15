import type { Metadata } from "next";
import ProPic from "@/components/Account/ProPic";

export const metadata: Metadata = {
  title: "Profile Picture | Heise Powless",
};

export default function Page() {
  return <ProPic />;
}
