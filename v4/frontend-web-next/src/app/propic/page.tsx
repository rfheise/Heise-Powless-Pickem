import type { Metadata } from "next";
import ProPic from "@/components/Account/ProPic";

//"Login" is not a typo. The old page passes title="Login" to BackgroundParent,
//so both its heading and its tab read Login - almost certainly a copy/paste
//slip, but changing it here would be a change to the app rather than a port of
//it. Kept as-is so the tab and the heading still agree.
export const metadata: Metadata = {
  title: "Login | Heise Powless",
};

export default function Page() {
  return <ProPic />;
}
