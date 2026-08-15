import type { Metadata } from "next";
import Logout from "@/components/Account/Logout";

export const metadata: Metadata = {
  title: "Logout | Heise Powless",
};

export default function Page() {
  return <Logout />;
}
